//
//  WeatherStore.swift
//  weather
//

import Foundation
import Observation
import SwiftUI // For Array.move(fromOffsets:toOffset:) and remove(atOffsets:).

enum TemperatureUnit: String, CaseIterable, Identifiable {
    case celsius, fahrenheit

    var id: Self { self }

    var label: String {
        switch self {
        case .celsius: "Celsius (°C)"
        case .fahrenheit: "Fahrenheit (°F)"
        }
    }

    var symbol: String {
        switch self {
        case .celsius: "°C"
        case .fahrenheit: "°F"
        }
    }
}

/// App-wide state: the selected city, saved favorites, and loaded weather.
@Observable
final class WeatherStore {
    private(set) var selectedCity: City
    private(set) var favorites: [City]
    private(set) var report: WeatherReport?
    private(set) var favoriteReports: [City.ID: WeatherReport] = [:]
    private(set) var isLoading = false
    private(set) var errorMessage: String?

    var unit: TemperatureUnit {
        didSet { defaults.set(unit.rawValue, forKey: Keys.unit) }
    }

    @ObservationIgnored private let service: WeatherService
    @ObservationIgnored private let defaults: UserDefaults

    private enum Keys {
        static let favorites = "favorites"
        static let selectedCity = "selectedCity"
        static let unit = "temperatureUnit"
    }

    init(service: WeatherService = WeatherService(), defaults: UserDefaults = .standard) {
        self.service = service
        self.defaults = defaults
        self.selectedCity = Self.decode(City.self, from: defaults, key: Keys.selectedCity) ?? .calicut
        self.favorites = Self.decode([City].self, from: defaults, key: Keys.favorites) ?? [.calicut]
        self.unit = defaults.string(forKey: Keys.unit).flatMap(TemperatureUnit.init(rawValue:)) ?? .celsius
    }

    // MARK: - Loading

    /// Loads weather for the selected city. Skips the request if fresh data (< 10 min) is already present.
    func load(force: Bool = false) async {
        if !force, let report, report.city == selectedCity,
           Date.now.timeIntervalSince(report.fetchedAt) < 600 {
            return
        }

        let city = selectedCity
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let newReport = try await service.report(for: city)
            // Ignore the result if the user switched cities while this request was in flight.
            guard city == selectedCity else { return }
            report = newReport
            favoriteReports[city.id] = newReport
        } catch is CancellationError {
            return
        } catch {
            guard city == selectedCity else { return }
            errorMessage = error.localizedDescription
        }
    }

    /// Fetches weather for favorites that haven't been loaded yet.
    func loadFavorites() async {
        for city in favorites where favoriteReports[city.id] == nil {
            if let report = try? await service.report(for: city) {
                favoriteReports[city.id] = report
            }
        }
    }

    func select(_ city: City) async {
        guard city != selectedCity else { return }
        selectedCity = city
        if let cached = favoriteReports[city.id] {
            report = cached
        }
        save(city, key: Keys.selectedCity)
        await load()
    }

    // MARK: - Favorites

    func isFavorite(_ city: City) -> Bool {
        favorites.contains { $0.id == city.id }
    }

    func addFavorite(_ city: City) {
        guard !isFavorite(city) else { return }
        favorites.append(city)
        save(favorites, key: Keys.favorites)
    }

    func removeFavorite(_ city: City) {
        favorites.removeAll { $0.id == city.id }
        save(favorites, key: Keys.favorites)
    }

    func removeFavorites(atOffsets offsets: IndexSet) {
        favorites.remove(atOffsets: offsets)
        save(favorites, key: Keys.favorites)
    }

    func moveFavorites(fromOffsets source: IndexSet, toOffset destination: Int) {
        favorites.move(fromOffsets: source, toOffset: destination)
        save(favorites, key: Keys.favorites)
    }

    // MARK: - Maintenance

    /// Drops all cached reports and reloads the selected city and favorites.
    func refreshAll() async {
        favoriteReports = [:]
        await load(force: true)
        await loadFavorites()
    }

    /// Restores favorites, selected city, and units to their first-launch defaults.
    func resetToDefaults() async {
        favorites = [.calicut]
        favoriteReports = [:]
        unit = .celsius
        save(favorites, key: Keys.favorites)
        if selectedCity == .calicut {
            await load(force: true)
        } else {
            await select(.calicut)
        }
    }

    // MARK: - Formatting

    /// Converts a Celsius value into the user's preferred unit.
    func convertedTemperature(_ celsius: Double) -> Int {
        let value = unit == .celsius ? celsius : celsius * 9 / 5 + 32
        return Int(value.rounded())
    }

    /// e.g. "28°"
    func temperature(_ celsius: Double) -> String {
        "\(convertedTemperature(celsius))°"
    }

    // MARK: - Persistence

    private func save<T: Encodable>(_ value: T, key: String) {
        if let data = try? JSONEncoder().encode(value) {
            defaults.set(data, forKey: key)
        }
    }

    private static func decode<T: Decodable>(_ type: T.Type, from defaults: UserDefaults, key: String) -> T? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }
}

// MARK: - Previews

extension WeatherStore {
    /// A store pre-populated with sample data so previews don't hit the network.
    static var preview: WeatherStore {
        let store = WeatherStore(defaults: UserDefaults(suiteName: "preview") ?? .standard)
        store.selectedCity = .calicut
        store.report = .sample
        store.favoriteReports[City.calicut.id] = .sample
        return store
    }
}
