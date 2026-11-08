//
//  WeatherIcon.swift
//  weather
//

import SwiftUI

/// SF Symbol for a weather condition, tinted so clouds stay visible on white cards.
struct WeatherIcon: View {
    let condition: WeatherCondition
    var isDay: Bool = true
    var size: CGFloat = 24

    var body: some View {
        let colors = palette
        Image(systemName: condition.symbol(isDay: isDay))
            .symbolRenderingMode(.palette)
            .foregroundStyle(colors[0], colors[1], colors[2])
            .font(.system(size: size))
            .frame(width: size * 1.35, height: size * 1.35)
            .accessibilityLabel(condition.label(isDay: isDay))
    }

    /// Palette layers follow each symbol's layer order (cloud first, then accent layers).
    private var palette: [Color] {
        let layers: [Color] = switch condition {
        case .clear, .mostlyClear:
            isDay ? [Theme.sun] : [Theme.moon]
        case .partlyCloudy:
            [Theme.cloud, isDay ? Theme.sun : Theme.moon]
        case .overcast, .fog:
            [Theme.cloud]
        case .drizzle, .rain, .heavyRain:
            [Theme.cloud, Theme.rain]
        case .snow:
            [Theme.cloud, Theme.skyMiddle]
        case .showers:
            [Theme.cloud, isDay ? Theme.sun : Theme.moon, Theme.rain]
        case .thunderstorm:
            [Theme.cloud, Theme.rain, Theme.bolt]
        }
        return (0..<3).map { layers[min($0, layers.count - 1)] }
    }
}

#Preview {
    let conditions: [WeatherCondition] = [
        .clear, .mostlyClear, .partlyCloudy, .overcast, .fog, .drizzle,
        .rain, .heavyRain, .snow, .showers, .thunderstorm
    ]
    VStack(spacing: 16) {
        HStack {
            ForEach(conditions, id: \.self) { WeatherIcon(condition: $0, size: 22) }
        }
        HStack {
            ForEach(conditions, id: \.self) { WeatherIcon(condition: $0, isDay: false, size: 22) }
        }
    }
    .card()
    .padding()
}
