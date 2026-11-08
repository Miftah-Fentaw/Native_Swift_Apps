//
//  Theme.swift
//  Journal
//

import SwiftUI

/// Pastel card colours taken from the reference design.
enum CardColor: String, CaseIterable, Identifiable, Codable {
    case peach, lemon, sky, sand, mint, lavender, rose

    var id: String { rawValue }

    var color: Color {
        switch self {
        case .peach: Color(red: 0.94, green: 0.66, blue: 0.58)
        case .lemon: Color(red: 0.99, green: 0.97, blue: 0.62)
        case .sky: Color(red: 0.84, green: 0.93, blue: 0.95)
        case .sand: Color(red: 0.96, green: 0.89, blue: 0.69)
        case .mint: Color(red: 0.75, green: 0.92, blue: 0.82)
        case .lavender: Color(red: 0.84, green: 0.81, blue: 0.96)
        case .rose: Color(red: 0.98, green: 0.8, blue: 0.86)
        }
    }

    /// Slightly darker shade used for checklist pills and chips on the card.
    var accent: Color {
        color.mix(with: .black, by: 0.06)
    }
}

/// User-selectable appearance, stored in AppStorage under "appearance".
enum AppAppearance: String, CaseIterable, Identifiable {
    case system, light, dark

    var id: String { rawValue }

    var title: String { rawValue.capitalized }

    var systemImage: String {
        switch self {
        case .system: "circle.lefthalf.filled"
        case .light: "sun.max.fill"
        case .dark: "moon.fill"
        }
    }

    /// `nil` follows the device setting.
    var colorScheme: ColorScheme? {
        switch self {
        case .system: nil
        case .light: .light
        case .dark: .dark
        }
    }
}

enum Theme {
    /// Main screen background (Home, Insights, Onboarding).
    static let background = Color(
        light: Color(red: 0.965, green: 0.965, blue: 0.955),
        dark: Color(red: 0.04, green: 0.04, blue: 0.05)
    )
    /// Secondary screen background (Calendar, Search, Settings).
    static let groupedBackground = Color(
        light: Color(red: 0.84, green: 0.93, blue: 0.95),
        dark: Color(red: 0.07, green: 0.09, blue: 0.1)
    )
    /// Raised panels such as the prompt card and chart cards.
    static let surface = Color(light: .white, dark: .white.opacity(0.08))
    static let separator = Color(light: .black.opacity(0.08), dark: .white.opacity(0.1))
    /// Subtle fill for round buttons on adaptive backgrounds.
    static let fill = Color(light: .black.opacity(0.06), dark: .white.opacity(0.1))

    static let text = Color(light: .black, dark: .white)
    static let secondaryText = Color(light: .black.opacity(0.55), dark: .white.opacity(0.55))
    /// Text drawn on top of a `text`-coloured fill (e.g. a selected chip).
    static let textInverse = Color(light: .white, dark: .black)

    /// Light teal used behind the detail screen. Pastel screens stay light in both modes.
    static let paper = Color(red: 0.84, green: 0.93, blue: 0.95)
    static let paperButton = Color.black.opacity(0.07)
    static let cardRadius: CGFloat = 28
}

extension Color {
    /// A colour that resolves differently in light and dark mode.
    nonisolated init(light: Color, dark: Color) {
        let lightColor = UIColor(light)
        let darkColor = UIColor(dark)
        self.init(uiColor: UIColor { traits in
            traits.userInterfaceStyle == .dark ? darkColor : lightColor
        })
    }
}

/// The round icon button used in headers ("≡", "<").
struct CircleIconButton: View {
    let systemImage: String
    var foreground: Color = .primary
    var background: Color = Theme.paperButton
    var size: CGFloat = 52
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(foreground)
                .frame(width: size, height: size)
                .background(background, in: Circle())
                .contentShape(Circle())
        }
        .buttonStyle(.plain)
    }
}

/// Capsule filter chip — filled when selected, outlined otherwise.
struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(.body, weight: .medium))
                .padding(.horizontal, 22)
                .padding(.vertical, 12)
                .foregroundStyle(isSelected ? Theme.textInverse : Theme.secondaryText)
                .background {
                    Capsule()
                        .fill(isSelected ? Theme.text : .clear)
                }
                .overlay {
                    Capsule()
                        .strokeBorder(isSelected ? .clear : Theme.text.opacity(0.25), lineWidth: 1.5)
                }
        }
        .buttonStyle(.plain)
        .animation(.snappy, value: isSelected)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}
