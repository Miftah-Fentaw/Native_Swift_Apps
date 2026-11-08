//
//  AddCityView.swift
//  weather
//

import SwiftUI

/// Sheet for searching cities and adding them to favorites.
struct AddCityView: View {
    @Environment(WeatherStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var query = ""
    @State private var results: [City] = []
    @State private var isSearching = false
    @State private var searchError: String?

    private let service = WeatherService()

    var body: some View {
        NavigationStack {
            List(results) { city in
                Button {
                    store.addFavorite(city)
                    Task { await store.select(city) }
                    dismiss()
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(city.name)
                                .font(.body.weight(.medium))
                                .foregroundStyle(Theme.primaryText)
                            Text(city.subtitle)
                                .font(.caption)
                                .foregroundStyle(Theme.secondaryText)
                        }
                        Spacer()
                        Image(systemName: store.isFavorite(city) ? "heart.fill" : "plus.circle.fill")
                            .font(.title3)
                            .foregroundStyle(store.isFavorite(city) ? .pink : Theme.accent)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            .scrollContentBackground(.hidden)
            .background(Theme.background)
            .overlay { overlayContent }
            .navigationTitle("Add City")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: "Search for a city")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close", systemImage: "xmark") { dismiss() }
                }
            }
            // Restarting the task on each keystroke cancels the previous one, which debounces requests.
            .task(id: query) { await search() }
        }
    }

    @ViewBuilder
    private var overlayContent: some View {
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        if isSearching && results.isEmpty {
            ProgressView()
        } else if let searchError {
            ContentUnavailableView("Search Failed", systemImage: "wifi.exclamationmark", description: Text(searchError))
        } else if trimmed.count < 2 {
            ContentUnavailableView("Find a City", systemImage: "magnifyingglass",
                                   description: Text("Search by city name to add it to your favorites."))
        } else if results.isEmpty {
            ContentUnavailableView.search(text: trimmed)
        }
    }

    private func search() async {
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        searchError = nil
        guard trimmed.count >= 2 else {
            results = []
            return
        }
        do {
            try await Task.sleep(for: .milliseconds(350))
        } catch {
            return
        }

        isSearching = true
        defer { isSearching = false }
        do {
            let found = try await service.searchCities(matching: trimmed)
            guard !Task.isCancelled else { return }
            results = found
        } catch is CancellationError {
            return
        } catch let error as URLError where error.code == .cancelled {
            return
        } catch {
            results = []
            searchError = error.localizedDescription
        }
    }
}

#Preview {
    AddCityView()
        .environment(WeatherStore.preview)
}
