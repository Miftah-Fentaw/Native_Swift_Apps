//
//  WeatherModels.swift
//  weather
//

import Foundation

/// A location the user can view weather for.
struct City: Identifiable, Codable, Hashable {
    let id: Int
    let name: String
    let region: String?
    let country: String?
    let latitude: Double
    let longitude: Double

    /// "Calicut, Kerala" style label used throughout the UI.
    var displayName: String {
        if let region, !region.isEmpty, region != name {
            return "\(name), \(region)"
        }
        if let country, !country.isEmpty {
            return "\(name), \(country)"
        }
        return name
    }

    /// Secondary line used in lists, e.g. "Kerala, India".
    var subtitle: String {
        [region, country]
            .compactMap { $0 }
            .filter { !$0.isEmpty }
            .joined(separator: ", ")
    }

    static let calicut = City(
        id: 1265873,
        name: "Calicut",
        region: "Kerala",
        country: "India",
        latitude: 11.2588,
        longitude: 75.7804
    )
}

/// Simplified weather condition derived from a WMO weather code.
enum WeatherCondition: Hashable {
    case clear, mostlyClear, partlyCloudy, overcast, fog
    case drizzle, rain, heavyRain, snow, showers, thunderstorm

    /// Maps WMO weather interpretation codes (as returned by Open-Meteo).
    init(code: Int) {
        switch code {
        case 0: self = .clear
        case 1: self = .mostlyClear
        case 2: self = .partlyCloudy
        case 3: self = .overcast
        case 45, 48: self = .fog
        case 51...57: self = .drizzle
        case 61, 63, 66: self = .rain
        case 65, 67: self = .heavyRain
        case 71...77, 85, 86: self = .snow
        case 80...82: self = .showers
        case 95...99: self = .thunderstorm
        default: self = .partlyCloudy
        }
    }

    func label(isDay: Bool = true) -> String {
        switch self {
        case .clear: isDay ? "Sunny" : "Clear"
        case .mostlyClear: isDay ? "Mostly Sunny" : "Mostly Clear"
        case .partlyCloudy: "Partly Cloudy"
        case .overcast: "Cloudy"
        case .fog: "Foggy"
        case .drizzle: "Drizzle"
        case .rain: "Light Rain"
        case .heavyRain: "Heavy Rain"
        case .snow: "Snow"
        case .showers: "Showers"
        case .thunderstorm: "Thunderstorms"
        }
    }

    func symbol(isDay: Bool = true) -> String {
        switch self {
        case .clear: isDay ? "sun.max.fill" : "moon.stars.fill"
        case .mostlyClear: isDay ? "sun.max.fill" : "moon.fill"
        case .partlyCloudy: isDay ? "cloud.sun.fill" : "cloud.moon.fill"
        case .overcast: "cloud.fill"
        case .fog: "cloud.fog.fill"
        case .drizzle: "cloud.drizzle.fill"
        case .rain: "cloud.rain.fill"
        case .heavyRain: "cloud.heavyrain.fill"
        case .snow: "cloud.snow.fill"
        case .showers: isDay ? "cloud.sun.rain.fill" : "cloud.moon.rain.fill"
        case .thunderstorm: "cloud.bolt.rain.fill"
        }
    }

    /// Whether the hero illustration should show a bright sun.
    var isSunny: Bool {
        self == .clear || self == .mostlyClear || self == .partlyCloudy
    }
}

struct CurrentConditions {
    let time: Date
    let temperature: Double
    let feelsLike: Double
    let humidity: Int
    let windSpeed: Double
    let windDirection: Double
    let pressure: Double
    /// Visibility in meters, when available.
    let visibility: Double?
    let cloudCover: Int
    let condition: WeatherCondition
    let isDay: Bool

    var cloudCoverDescription: String {
        switch cloudCover {
        case ...10: "Clear"
        case ...50: "Scattered"
        case ...85: "Mostly Cloudy"
        default: "Overcast"
        }
    }
}

struct HourlyForecast: Identifiable {
    var id: Date { time }
    let time: Date
    let temperature: Double
    let condition: WeatherCondition
    let isDay: Bool
    let precipitationChance: Int
}

struct DailyForecast: Identifiable {
    var id: Date { date }
    let date: Date
    let high: Double
    let low: Double
    let condition: WeatherCondition
    let precipitationChance: Int
    let sunrise: Date?
    let sunset: Date?
    let uvIndex: Double
}

/// US AQI value with human readable descriptions.
struct AirQuality {
    let index: Int

    var category: String {
        switch index {
        case ...50: "Good"
        case ...100: "Moderate"
        case ...150: "Sensitive"
        case ...200: "Unhealthy"
        case ...300: "Very Unhealthy"
        default: "Hazardous"
        }
    }

    var summary: String {
        switch index {
        case ...50: "Air quality is great for outdoor activities."
        case ...100: "Air quality is acceptable for most activities."
        case ...150: "Sensitive groups should limit time outdoors."
        case ...200: "Everyone may begin to feel health effects."
        default: "Avoid prolonged outdoor exertion."
        }
    }

    /// Position on a 0–300 scale used by the gradient meter.
    var meterFraction: Double {
        min(max(Double(index) / 300, 0), 1)
    }
}

/// Everything the app shows for a single city.
struct WeatherReport {
    let city: City
    let timeZone: TimeZone
    let current: CurrentConditions
    let hourly: [HourlyForecast]
    let daily: [DailyForecast]
    let airQuality: AirQuality?
    let fetchedAt: Date

    var today: DailyForecast? { daily.first }

    /// How far the sun is through today's arc, from 0 (sunrise) to 1 (sunset).
    var sunProgress: Double {
        guard let sunrise = today?.sunrise, let sunset = today?.sunset, sunset > sunrise else {
            return current.isDay ? 0.5 : 0
        }
        let progress = current.time.timeIntervalSince(sunrise) / sunset.timeIntervalSince(sunrise)
        return min(max(progress, 0), 1)
    }
}

extension Double {
    /// Eight-point compass direction for a bearing in degrees.
    var compassDirection: String {
        let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        let normalized = (truncatingRemainder(dividingBy: 360) + 360).truncatingRemainder(dividingBy: 360)
        return directions[Int((normalized + 22.5) / 45) % 8]
    }
}

extension Date {
    /// Formats the date in a specific time zone (the city's, not the device's).
    func formatted(_ style: Date.FormatStyle, in timeZone: TimeZone) -> String {
        var style = style
        style.timeZone = timeZone
        return formatted(style)
    }
}
