//
//  FavoritesView.swift
//  weather
//

import SwiftUI

struct FavoritesView: View {
    @Environment(WeatherStore.self) private var store
    var onSelect: () -> Void = {}
    var onAdd: () -> Void = {}

    var body: some View {
        ZStack {
            SkyBackground()
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        SettingsMenu()
                        Spacer()
                        ProfileAvatar()
                    }
                    .padding(.top, 8)

                    Text("Favorites")
                        .font(.system(size: 34, weight: .semibold))
                        .foregroundStyle(.white)
                    Text("\(store.favorites.count) saved \(store.favorites.count == 1 ? "city" : "cities")")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.9))
                        .padding(.top, -12)

                    if store.favorites.isEmpty {
                        ContentUnavailableView {
                            Label("No Favorites Yet", systemImage: "heart")
                        } description: {
                            Text("Save cities to quickly check their weather.")
                        } actions: {
                            Button("Add City", action: onAdd)
                                .buttonStyle(.borderedProminent)
                                .tint(Theme.accent)
                        }
                        .card()
                        .padding(.top, 40)
                    } else {
                        ForEach(store.favorites) { city in
                            FavoriteCityRow(city: city, report: store.favoriteReports[city.id]) {
                                Task { await store.select(city) }
                                onSelect()
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
            .scrollIndicators(.hidden)
        }
        .task(id: store.favorites.map(\.id)) {
            await store.loadFavorites()
        }
    }
}

private struct FavoriteCityRow: View {
    @Environment(WeatherStore.self) private var store
    let city: City
    let report: WeatherReport?
    let onSelect: () -> Void

    var body: some View {
        let isSelected = city == store.selectedCity
        Button(action: onSelect) {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text(city.name)
                            .font(.headline)
                            .foregroundStyle(Theme.primaryText)
                        if isSelected {
                            Image(systemName: "location.fill")
                                .font(.caption)
                                .foregroundStyle(Theme.accent)
                        }
                    }
                    Text(city.subtitle)
                        .font(.caption)
                        .foregroundStyle(Theme.secondaryText)
                    if let report {
                        Text(report.current.condition.label(isDay: report.current.isDay))
                            .font(.caption)
                            .foregroundStyle(Theme.primaryText)
                            .padding(.top, 4)
                    }
                }
                .lineLimit(1)
                Spacer()
                if let report {
                    WeatherIcon(condition: report.current.condition, isDay: report.current.isDay, size: 32)
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(store.temperature(report.current.temperature))
                            .font(.system(size: 30, weight: .semibold, design: .rounded))
                            .foregroundStyle(Theme.primaryText)
                        if let today = report.today {
                            Text("H:\(store.temperature(today.high))  L:\(store.temperature(today.low))")
                                .font(.caption2)
                                .foregroundStyle(Theme.secondaryText)
                        }
                    }
                } else {
                    ProgressView()
                }
            }
            .card()
            .overlay {
                if isSelected {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(Theme.accent.opacity(0.4), lineWidth: 1.5)
                }
            }
        }
        .buttonStyle(.plain)
        .contextMenu {
            Button("Remove from Favorites", systemImage: "heart.slash", role: .destructive) {
                withAnimation { store.removeFavorite(city) }
            }
        }
        .accessibilityAction(named: "Remove from Favorites") {
            store.removeFavorite(city)
        }
    }
}

#Preview {
    FavoritesView()
        .environment(WeatherStore.preview)
}
