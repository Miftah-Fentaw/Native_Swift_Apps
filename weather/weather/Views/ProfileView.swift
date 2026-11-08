//
//  ProfileView.swift
//  weather
//

import SwiftUI

/// UserDefaults keys for profile settings stored with `@AppStorage`.
enum ProfileKeys {
    static let name = "profileName"
}

/// Profile sheet with preferences, favorites management, and app actions.
struct ProfileView: View {
    @Environment(WeatherStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @AppStorage(ProfileKeys.name) private var name = ""

    @State private var isEditingName = false
    @State private var draftName = ""
    @State private var isConfirmingReset = false
    @State private var isRefreshing = false

    var body: some View {
        @Bindable var store = store
        NavigationStack {
            List {
                Section {
                    header
                }
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets())

                Section("Preferences") {
                    Picker(selection: $store.unit) {
                        ForEach(TemperatureUnit.allCases) { unit in
                            Text(unit.symbol).tag(unit)
                        }
                    } label: {
                        rowLabel("Temperature Unit", systemName: "thermometer.medium", tint: .orange)
                    }

                    LabeledContent {
                        Text(store.selectedCity.displayName)
                            .foregroundStyle(Theme.secondaryText)
                    } label: {
                        rowLabel("Current City", systemName: "mappin.and.ellipse", tint: Theme.accent)
                    }
                }

                Section("Locations") {
                    NavigationLink {
                        ManageFavoritesView()
                    } label: {
                        LabeledContent {
                            Text("\(store.favorites.count)")
                        } label: {
                            rowLabel("Manage Favorites", systemName: "heart.fill", tint: .pink)
                        }
                    }

                    if let report = store.report {
                        ShareLink(item: shareText(for: report)) {
                            rowLabel("Share Current Weather", systemName: "square.and.arrow.up", tint: .teal)
                        }
                    }
                }

                Section("Data") {
                    Button {
                        Task {
                            isRefreshing = true
                            await store.refreshAll()
                            isRefreshing = false
                        }
                    } label: {
                        HStack {
                            rowLabel("Refresh All Weather", systemName: "arrow.clockwise", tint: .green)
                            Spacer()
                            if isRefreshing { ProgressView() }
                        }
                    }
                    .disabled(isRefreshing)

                    Button(role: .destructive) {
                        isConfirmingReset = true
                    } label: {
                        rowLabel("Reset to Defaults", systemName: "arrow.counterclockwise", tint: .red)
                    }
                }

                Section("About") {
                    LabeledContent {
                        Text(appVersion)
                            .foregroundStyle(Theme.secondaryText)
                    } label: {
                        rowLabel("Version", systemName: "info.circle.fill", tint: .gray)
                    }
                    if let url = URL(string: "https://open-meteo.com") {
                        Link(destination: url) {
                            rowLabel("Weather Data by Open-Meteo", systemName: "cloud.sun.fill", tint: Theme.accent)
                        }
                    }
                }
            }
            .tint(Theme.primaryText)
            .scrollContentBackground(.hidden)
            .background(Theme.background)
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                        .tint(Theme.accent)
                }
            }
            .alert("Your Name", isPresented: $isEditingName) {
                TextField("Name", text: $draftName)
                    .textContentType(.name)
                Button("Cancel", role: .cancel) {}
                Button("Save") {
                    name = draftName.trimmingCharacters(in: .whitespacesAndNewlines)
                }
            }
            .confirmationDialog("Reset to Defaults?", isPresented: $isConfirmingReset, titleVisibility: .visible) {
                Button("Reset", role: .destructive) {
                    Task { await store.resetToDefaults() }
                }
            } message: {
                Text("This removes your saved favorites and restores Celsius.")
            }
        }
    }

    // MARK: - Subviews

    private var header: some View {
        VStack(spacing: 10) {
            AvatarImage(size: 88)
            Text(name.isEmpty ? "Weather Lover" : name)
                .font(.title2.weight(.semibold))
                .foregroundStyle(Theme.primaryText)
            Button {
                draftName = name
                isEditingName = true
            } label: {
                Label("Edit Name", systemImage: "pencil")
                    .font(.subheadline.weight(.medium))
            }
            .buttonStyle(.bordered)
            .tint(Theme.accent)

            HStack(spacing: 12) {
                summaryTile(value: "\(store.favorites.count)", caption: "Favorites")
                summaryTile(value: store.unit.symbol, caption: "Unit")
                summaryTile(value: store.report.map { store.temperature($0.current.temperature) } ?? "—",
                            caption: store.selectedCity.name)
            }
            .padding(.top, 6)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }

    private func summaryTile(value: String, caption: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.headline)
                .foregroundStyle(Theme.primaryText)
            Text(caption)
                .font(.caption)
                .foregroundStyle(Theme.secondaryText)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .card(padding: 12, cornerRadius: 16)
        .accessibilityElement(children: .combine)
    }

    private func rowLabel(_ title: String, systemName: String, tint: Color) -> some View {
        Label {
            Text(title)
                .foregroundStyle(Theme.primaryText)
        } icon: {
            Image(systemName: systemName)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 28, height: 28)
                .background(tint.gradient, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
        }
    }

    // MARK: - Helpers

    private func shareText(for report: WeatherReport) -> String {
        let current = report.current
        return "It's \(store.temperature(current.temperature)) and \(current.condition.label(isDay: current.isDay).lowercased()) in \(report.city.displayName) right now."
    }

    private var appVersion: String {
        let info = Bundle.main.infoDictionary
        let version = info?["CFBundleShortVersionString"] as? String ?? "1.0"
        let build = info?["CFBundleVersion"] as? String ?? "1"
        return "\(version) (\(build))"
    }
}

/// Reorder or delete saved cities.
private struct ManageFavoritesView: View {
    @Environment(WeatherStore.self) private var store

    var body: some View {
        List {
            ForEach(store.favorites) { city in
                VStack(alignment: .leading, spacing: 2) {
                    Text(city.name)
                        .foregroundStyle(Theme.primaryText)
                    Text(city.subtitle)
                        .font(.caption)
                        .foregroundStyle(Theme.secondaryText)
                }
            }
            .onDelete { store.removeFavorites(atOffsets: $0) }
            .onMove { store.moveFavorites(fromOffsets: $0, toOffset: $1) }
        }
        .overlay {
            if store.favorites.isEmpty {
                ContentUnavailableView("No Favorites", systemImage: "heart",
                                       description: Text("Use the + button to add cities."))
            }
        }
        .scrollContentBackground(.hidden)
        .background(Theme.background)
        .navigationTitle("Favorites")
        .toolbar {
            EditButton()
                .tint(Theme.accent)
        }
    }
}

#Preview {
    ProfileView()
        .environment(WeatherStore.preview)
}
