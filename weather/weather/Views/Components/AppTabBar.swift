//
//  AppTabBar.swift
//  weather
//

import SwiftUI

enum AppTab: CaseIterable, Identifiable {
    case home, forecast, map, favorites

    var id: Self { self }

    var title: String {
        switch self {
        case .home: "Home"
        case .forecast: "Forecast"
        case .map: "Map"
        case .favorites: "Favorites"
        }
    }

    func symbol(selected: Bool) -> String {
        switch self {
        case .home: selected ? "house.fill" : "house"
        case .forecast: selected ? "cloud.sun.fill" : "cloud.sun"
        case .map: selected ? "globe.americas.fill" : "globe.americas"
        case .favorites: selected ? "heart.fill" : "heart"
        }
    }
}

/// Floating tab bar with a prominent "add city" button, matching the design reference.
struct AppTabBar: View {
    @Binding var selection: AppTab
    var onAdd: () -> Void

    var body: some View {
        HStack(spacing: 4) {
            ForEach(AppTab.allCases) { tab in
                let isSelected = tab == selection
                Button {
                    selection = tab
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: tab.symbol(selected: isSelected))
                            .font(.system(size: 20))
                            .frame(height: 24)
                        Text(tab.title)
                            .font(.caption2.weight(isSelected ? .semibold : .regular))
                    }
                    .foregroundStyle(isSelected ? Theme.accent : Theme.secondaryText)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background {
                        if isSelected {
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(Theme.accent.opacity(0.1))
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }

            Button(action: onAdd) {
                Image(systemName: "plus")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundStyle(.white)
                    .frame(width: 58, height: 58)
                    .background(Theme.accent.gradient, in: Circle())
                    .shadow(color: Theme.accent.opacity(0.4), radius: 10, y: 5)
            }
            .buttonStyle(.plain)
            .padding(.leading, 6)
            .accessibilityLabel("Add City")
        }
        .padding(8)
        .background(.white, in: RoundedRectangle(cornerRadius: 30, style: .continuous))
        .shadow(color: Theme.shadow, radius: 20, y: 8)
        .animation(.snappy, value: selection)
    }
}

#Preview {
    @Previewable @State var selection = AppTab.home
    AppTabBar(selection: $selection) {}
        .padding()
        .background(Theme.background)
}
