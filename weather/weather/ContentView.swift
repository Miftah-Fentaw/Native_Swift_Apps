//
//  ContentView.swift
//  weather
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI

/// Root view hosting the four main screens behind a custom floating tab bar.
struct ContentView: View {
    @Environment(WeatherStore.self) private var store
    @State private var selectedTab: AppTab = .home
    @State private var forecastMode: ForecastMode = .daily
    @State private var isAddingCity = false

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            switch selectedTab {
            case .home:
                HomeView {
                    forecastMode = .hourly
                    selectedTab = .forecast
                }
            case .forecast:
                ForecastView(mode: $forecastMode) {
                    selectedTab = .home
                }
            case .map:
                WeatherMapView()
            case .favorites:
                FavoritesView {
                    selectedTab = .home
                } onAdd: {
                    isAddingCity = true
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            AppTabBar(selection: $selectedTab) {
                isAddingCity = true
            }
            .padding(.horizontal, 16)
        }
        .sheet(isPresented: $isAddingCity) {
            AddCityView()
                .presentationDetents([.large])
        }
        .task { await store.load() }
    }
}

#Preview {
    ContentView()
        .environment(WeatherStore.preview)
}
