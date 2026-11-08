//
//  WeatherService.swift
//  weather
//

import Foundation

enum WeatherServiceError: LocalizedError {
    case badResponse

    var errorDescription: String? {
        "The weather service returned an unexpected response."
    }
}

/// Fetches forecasts, air quality, and city search results from Open-Meteo (no API key required).
struct WeatherService {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    // MARK: - Public API

    func report(for city: City) async throws -> WeatherReport {
        async let forecast = fetchForecast(for: city)
        async let airQuality = fetchAirQualityIfAvailable(for: city)
        return try await makeReport(city: city, forecast: forecast, airQuality: airQuality)
    }

    func searchCities(matching query: String) async throws -> [City] {
        var components = URLComponents(string: "https://geocoding-api.open-meteo.com/v1/search")
        components?.queryItems = [
            URLQueryItem(name: "name", value: query),
            URLQueryItem(name: "count", value: "15"),
            URLQueryItem(name: "language", value: "en"),
            URLQueryItem(name: "format", value: "json")
        ]
        guard let url = components?.url else { throw WeatherServiceError.badResponse }

        let response = try await fetch(GeocodingResponse.self, from: url)
        return (response.results ?? []).map {
            City(
                id: $0.id,
                name: $0.name,
                region: $0.admin1,
                country: $0.country,
                latitude: $0.latitude,
                longitude: $0.longitude
            )
        }
    }

    // MARK: - Requests

    private func fetchForecast(for city: City) async throws -> ForecastResponse {
        var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")
        components?.queryItems = [
            URLQueryItem(name: "latitude", value: String(city.latitude)),
            URLQueryItem(name: "longitude", value: String(city.longitude)),
            URLQueryItem(name: "current", value: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,is_day"),
            URLQueryItem(name: "hourly", value: "temperature_2m,weather_code,precipitation_probability,is_day"),
            URLQueryItem(name: "daily", value: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max"),
            URLQueryItem(name: "timezone", value: "auto"),
            URLQueryItem(name: "forecast_days", value: "14")
        ]
        guard let url = components?.url else { throw WeatherServiceError.badResponse }
        return try await fetch(ForecastResponse.self, from: url)
    }

    /// Air quality is a nice-to-have, so failures are swallowed rather than failing the whole report.
    private func fetchAirQualityIfAvailable(for city: City) async -> AirQuality? {
        var components = URLComponents(string: "https://air-quality-api.open-meteo.com/v1/air-quality")
        components?.queryItems = [
            URLQueryItem(name: "latitude", value: String(city.latitude)),
            URLQueryItem(name: "longitude", value: String(city.longitude)),
            URLQueryItem(name: "current", value: "us_aqi")
        ]
        guard let url = components?.url,
              let response = try? await fetch(AirQualityResponse.self, from: url),
              let index = response.current.usAqi else {
            return nil
        }
        return AirQuality(index: Int(index.rounded()))
    }

    private func fetch<T: Decodable>(_ type: T.Type, from url: URL) async throws -> T {
        let (data, response) = try await session.data(from: url)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw WeatherServiceError.badResponse
        }
        // Keys are mapped explicitly via CodingKeys: `.convertFromSnakeCase` turns
        // "temperature_2m" into "temperature2M", which doesn't match our property names.
        return try JSONDecoder().decode(T.self, from: data)
    }

    // MARK: - Mapping

    private func makeReport(city: City, forecast: ForecastResponse, airQuality: AirQuality?) -> WeatherReport {
        let timeZone = TimeZone(identifier: forecast.timezone)
            ?? TimeZone(secondsFromGMT: forecast.utcOffsetSeconds)
            ?? .current
        // Open-Meteo returns local times without an offset, so parse them in the city's time zone.
        let dateTimeFormatter = Self.formatter("yyyy-MM-dd'T'HH:mm", timeZone: timeZone)
        let dayFormatter = Self.formatter("yyyy-MM-dd", timeZone: timeZone)

        let c = forecast.current
        let current = CurrentConditions(
            time: dateTimeFormatter.date(from: c.time) ?? .now,
            temperature: c.temperature2m,
            feelsLike: c.apparentTemperature,
            humidity: Int(c.relativeHumidity2m.rounded()),
            windSpeed: c.windSpeed10m,
            windDirection: c.windDirection10m,
            pressure: c.pressureMsl,
            visibility: c.visibility,
            cloudCover: Int(c.cloudCover.rounded()),
            condition: WeatherCondition(code: c.weatherCode),
            isDay: c.isDay == 1
        )

        // Keep the hour containing "now" and everything after it.
        let h = forecast.hourly
        let cutoff = current.time.addingTimeInterval(-3600)
        var hourly: [HourlyForecast] = []
        for index in h.time.indices {
            guard let time = dateTimeFormatter.date(from: h.time[index]), time > cutoff,
                  let temperature = h.temperature2m[index],
                  let code = h.weatherCode[index] else { continue }
            hourly.append(HourlyForecast(
                time: time,
                temperature: temperature,
                condition: WeatherCondition(code: code),
                isDay: (h.isDay[index] ?? 1) == 1,
                precipitationChance: h.precipitationProbability[index] ?? 0
            ))
            if hourly.count == 24 { break }
        }

        let d = forecast.daily
        var daily: [DailyForecast] = []
        for index in d.time.indices {
            guard let date = dayFormatter.date(from: d.time[index]),
                  let high = d.temperature2mMax[index],
                  let low = d.temperature2mMin[index],
                  let code = d.weatherCode[index] else { continue }
            daily.append(DailyForecast(
                date: date,
                high: high,
                low: low,
                condition: WeatherCondition(code: code),
                precipitationChance: d.precipitationProbabilityMax[index] ?? 0,
                sunrise: d.sunrise[index].flatMap(dateTimeFormatter.date(from:)),
                sunset: d.sunset[index].flatMap(dateTimeFormatter.date(from:)),
                uvIndex: d.uvIndexMax[index] ?? 0
            ))
        }

        return WeatherReport(
            city: city,
            timeZone: timeZone,
            current: current,
            hourly: hourly,
            daily: daily,
            airQuality: airQuality,
            fetchedAt: .now
        )
    }

    private static func formatter(_ format: String, timeZone: TimeZone) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = timeZone
        formatter.dateFormat = format
        return formatter
    }
}

// MARK: - Response DTOs

private struct ForecastResponse: Decodable {
    let timezone: String
    let utcOffsetSeconds: Int
    let current: Current
    let hourly: Hourly
    let daily: Daily

    enum CodingKeys: String, CodingKey {
        case timezone, current, hourly, daily
        case utcOffsetSeconds = "utc_offset_seconds"
    }

    struct Current: Decodable {
        let time: String
        let temperature2m: Double
        let relativeHumidity2m: Double
        let apparentTemperature: Double
        let weatherCode: Int
        let cloudCover: Double
        let pressureMsl: Double
        let windSpeed10m: Double
        let windDirection10m: Double
        let visibility: Double?
        let isDay: Int

        enum CodingKeys: String, CodingKey {
            case time, visibility
            case temperature2m = "temperature_2m"
            case relativeHumidity2m = "relative_humidity_2m"
            case apparentTemperature = "apparent_temperature"
            case weatherCode = "weather_code"
            case cloudCover = "cloud_cover"
            case pressureMsl = "pressure_msl"
            case windSpeed10m = "wind_speed_10m"
            case windDirection10m = "wind_direction_10m"
            case isDay = "is_day"
        }
    }

    struct Hourly: Decodable {
        let time: [String]
        let temperature2m: [Double?]
        let weatherCode: [Int?]
        let precipitationProbability: [Int?]
        let isDay: [Int?]

        enum CodingKeys: String, CodingKey {
            case time
            case temperature2m = "temperature_2m"
            case weatherCode = "weather_code"
            case precipitationProbability = "precipitation_probability"
            case isDay = "is_day"
        }
    }

    struct Daily: Decodable {
        let time: [String]
        let weatherCode: [Int?]
        let temperature2mMax: [Double?]
        let temperature2mMin: [Double?]
        let sunrise: [String?]
        let sunset: [String?]
        let precipitationProbabilityMax: [Int?]
        let uvIndexMax: [Double?]

        enum CodingKeys: String, CodingKey {
            case time, sunrise, sunset
            case weatherCode = "weather_code"
            case temperature2mMax = "temperature_2m_max"
            case temperature2mMin = "temperature_2m_min"
            case precipitationProbabilityMax = "precipitation_probability_max"
            case uvIndexMax = "uv_index_max"
        }
    }
}

private struct AirQualityResponse: Decodable {
    let current: Current

    struct Current: Decodable {
        let usAqi: Double?

        enum CodingKeys: String, CodingKey {
            case usAqi = "us_aqi"
        }
    }
}

private struct GeocodingResponse: Decodable {
    let results: [Result]?

    struct Result: Decodable {
        let id: Int
        let name: String
        let latitude: Double
        let longitude: Double
        let country: String?
        let admin1: String?
    }
}
