//
//  AppSettings.swift
//  calculator
//

import SwiftUI

/// The appearance the user picked for the app.
enum AppTheme: String, CaseIterable, Identifiable {
    case system
    case light
    case dark

    var id: String { rawValue }

    var title: String {
        switch self {
        case .system: "System"
        case .light: "Light"
        case .dark: "Dark"
        }
    }

    var symbol: String {
        switch self {
        case .system: "circle.lefthalf.filled"
        case .light: "sun.max"
        case .dark: "moon"
        }
    }

    /// `nil` lets the app follow the system appearance.
    var colorScheme: ColorScheme? {
        switch self {
        case .system: nil
        case .light: .light
        case .dark: .dark
        }
    }
}

/// The tools available from the mode switcher at the top of the app.
enum AppMode: String, CaseIterable, Identifiable {
    case calculator
    case tip
    case converter

    var id: String { rawValue }

    var title: String {
        switch self {
        case .calculator: "Calc"
        case .tip: "Tip"
        case .converter: "Convert"
        }
    }
}

/// `UserDefaults` / `@AppStorage` keys shared across the app.
enum SettingsKey {
    static let theme = "appTheme"
    static let appMode = "appMode"
    static let haptics = "hapticsEnabled"

    // Calculator
    static let angleMode = "angleMode"
    static let precision = "decimalPlaces"
    static let grouping = "useGrouping"
    static let showScientific = "showScientific"
    static let liveResult = "showLiveResult"
    static let history = "calculationHistory"

    // Tip
    static let defaultTip = "defaultTipPercent"
    static let roundUp = "roundUpSplit"
    static let showCurrency = "showCurrencySymbol"
}

/// Tip percentages offered on the tip screen and in settings.
let tipPresets = [0, 5, 10, 15, 18, 20, 25]

/// Decimal place limits offered in settings.
let precisionOptions = [2, 4, 6, 8, 10]

extension Color {
    /// Accent used throughout the app (soft indigo, matching the design).
    /// Lighter in dark mode so it keeps good contrast on black.
    static let appAccent = Color(UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(red: 0.55, green: 0.52, blue: 1.0, alpha: 1)
            : UIColor(red: 0.31, green: 0.27, blue: 0.85, alpha: 1)
    })
}

extension Double {
    /// Formats as a money value, with or without the local currency symbol.
    func moneyString(showSymbol: Bool) -> String {
        if showSymbol {
            let code = Locale.current.currency?.identifier ?? "USD"
            return formatted(.currency(code: code))
        }
        return formatted(.number.precision(.fractionLength(2)))
    }
}
