//
//  SampleData.swift
//  weather
//

import Foundation

extension WeatherReport {
    /// Static data modeled on the design reference, used for SwiftUI previews.
    static let sample: WeatherReport = {
        let timeZone = TimeZone(identifier: "Asia/Kolkata") ?? .current
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timeZone
        let now = Date.now
        let startOfDay = calendar.startOfDay(for: now)

        let current = CurrentConditions(
            time: now,
            temperature: 28,
            feelsLike: 31,
            humidity: 62,
            windSpeed: 12,
            windDirection: 45,
            pressure: 1012,
            visibility: 10_000,
            cloudCover: 5,
            condition: .clear,
            isDay: true
        )

        let hourlyCodes = [0, 0, 2, 2, 1, 0, 0, 3, 61, 2, 0, 1]
        let hourly = (0..<24).map { offset in
            let time = now.addingTimeInterval(Double(offset) * 3600)
            let hour = calendar.component(.hour, from: time)
            return HourlyForecast(
                time: time,
                temperature: 26 + 4 * sin(Double(hour - 8) / 24 * .pi * 2),
                condition: WeatherCondition(code: hourlyCodes[offset % hourlyCodes.count]),
                isDay: (6..<18).contains(hour),
                precipitationChance: [5, 10, 20, 10][offset % 4]
            )
        }

        let dailyValues: [(high: Double, low: Double, code: Int, rain: Int)] = [
            (28, 18, 0, 10), (29, 19, 2, 20), (27, 18, 61, 60), (26, 17, 95, 80),
            (28, 18, 2, 20), (30, 19, 0, 5), (31, 20, 0, 5), (27, 18, 61, 40),
            (28, 19, 1, 10), (29, 19, 2, 15), (30, 20, 0, 5), (28, 18, 3, 30),
            (27, 18, 80, 55), (29, 19, 1, 10)
        ]
        let daily = dailyValues.enumerated().map { index, value in
            let date = startOfDay.addingTimeInterval(Double(index) * 86_400)
            return DailyForecast(
                date: date,
                high: value.high,
                low: value.low,
                condition: WeatherCondition(code: value.code),
                precipitationChance: value.rain,
                sunrise: date.addingTimeInterval(6 * 3600 + 32 * 60),
                sunset: date.addingTimeInterval(18 * 3600 + 5 * 60),
                uvIndex: 7
            )
        }

        return WeatherReport(
            city: .calicut,
            timeZone: timeZone,
            current: current,
            hourly: hourly,
            daily: daily,
            airQuality: AirQuality(index: 72),
            fetchedAt: now
        )
    }()
}
