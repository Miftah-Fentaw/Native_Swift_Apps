//
//  Theme.swift
//  weather
//

import SwiftUI

/// Light-only palette inspired by the design reference.
enum Theme {
    static let accent = Color(red: 0.24, green: 0.45, blue: 0.96)
    static let background = Color(red: 0.95, green: 0.96, blue: 0.98)
    static let skyTop = Color(red: 0.32, green: 0.55, blue: 0.91)
    static let skyMiddle = Color(red: 0.62, green: 0.78, blue: 0.96)
    static let primaryText = Color(red: 0.10, green: 0.12, blue: 0.20)
    static let secondaryText = Color(red: 0.45, green: 0.49, blue: 0.58)
    static let shadow = Color(red: 0.20, green: 0.30, blue: 0.50).opacity(0.08)

    // Weather icon colors.
    static let sun = Color(red: 1.00, green: 0.74, blue: 0.18)
    static let cloud = Color(red: 0.66, green: 0.74, blue: 0.86)
    static let rain = Color(red: 0.26, green: 0.52, blue: 0.96)
    static let moon = Color(red: 0.50, green: 0.53, blue: 0.80)
    static let bolt = Color(red: 1.00, green: 0.78, blue: 0.10)

    static let airQualityGradient = LinearGradient(
        colors: [.green, .yellow, .orange, .red, .purple],
        startPoint: .leading,
        endPoint: .trailing
    )

    static let temperatureGradient = LinearGradient(
        colors: [
            Color(red: 0.25, green: 0.40, blue: 0.95),
            Color(red: 0.30, green: 0.75, blue: 0.95),
            Color(red: 0.45, green: 0.85, blue: 0.55),
            Color(red: 1.00, green: 0.80, blue: 0.25),
            Color(red: 0.98, green: 0.50, blue: 0.25),
            Color(red: 0.90, green: 0.25, blue: 0.35)
        ],
        startPoint: .leading,
        endPoint: .trailing
    )

    static let precipitationGradient = LinearGradient(
        colors: [Color(red: 0.85, green: 0.92, blue: 1.0), rain, Color(red: 0.15, green: 0.20, blue: 0.65)],
        startPoint: .leading,
        endPoint: .trailing
    )

    static let windGradient = LinearGradient(
        colors: [Color(red: 0.55, green: 0.90, blue: 0.80), .teal, .indigo, .purple],
        startPoint: .leading,
        endPoint: .trailing
    )
}

extension View {
    /// White rounded card with a soft shadow.
    func card(padding: CGFloat = 16, cornerRadius: CGFloat = 24) -> some View {
        self
            .padding(padding)
            .background(.white, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .shadow(color: Theme.shadow, radius: 16, y: 6)
    }
}
