//
//  calculatorApp.swift
//  calculator
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI

@main
struct calculatorApp: App {
    @AppStorage(SettingsKey.theme) private var theme: AppTheme = .system
    @State private var engine = CalculatorEngine()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(engine)
                .tint(.appAccent)
                .preferredColorScheme(theme.colorScheme)
        }
    }
}
