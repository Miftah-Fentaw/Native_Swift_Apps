//
//  weatherApp.swift
//  weather
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI

@main
struct weatherApp: App {
    @State private var store = WeatherStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .tint(Theme.accent)
                // The app is designed for a light appearance only.
                .preferredColorScheme(.light)
        }
    }
}
