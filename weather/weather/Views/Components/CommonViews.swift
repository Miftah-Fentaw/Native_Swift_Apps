//
//  CommonViews.swift
//  weather
//

import SwiftUI

// MARK: - Header controls

/// Translucent circular icon used for header buttons.
struct CircleIconLabel: View {
    let systemName: String

    var body: some View {
        Image(systemName: systemName)
            .font(.system(size: 17, weight: .semibold))
            .foregroundStyle(Theme.primaryText)
            .frame(width: 44, height: 44)
            .background(.white.opacity(0.75), in: Circle())
            .shadow(color: Theme.shadow, radius: 8, y: 3)
    }
}

/// Header avatar button that opens the profile screen.
struct ProfileAvatar: View {
    @State private var isShowingProfile = false

    var body: some View {
        Button {
            isShowingProfile = true
        } label: {
            AvatarImage(size: 44)
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Profile")
        .sheet(isPresented: $isShowingProfile) {
            ProfileView()
        }
    }
}

/// Circular avatar showing the user's initials, or a person glyph when no name is set.
struct AvatarImage: View {
    @AppStorage(ProfileKeys.name) private var name = ""
    var size: CGFloat

    var body: some View {
        Group {
            if initials.isEmpty {
                Image(systemName: "person.fill")
                    .font(.system(size: size * 0.45))
            } else {
                Text(initials)
                    .font(.system(size: size * 0.38, weight: .semibold, design: .rounded))
            }
        }
        .foregroundStyle(.white)
        .frame(width: size, height: size)
        .background(
            LinearGradient(colors: [Color(red: 1, green: 0.7, blue: 0.5), Color(red: 0.85, green: 0.45, blue: 0.55)],
                           startPoint: .topLeading, endPoint: .bottomTrailing),
            in: Circle()
        )
        .overlay(Circle().stroke(.white, lineWidth: size > 60 ? 4 : 2))
        .shadow(color: Theme.shadow, radius: 8, y: 3)
    }

    private var initials: String {
        name.split(separator: " ")
            .prefix(2)
            .compactMap(\.first)
            .map { String($0).uppercased() }
            .joined()
    }
}

/// Hamburger menu with app settings.
struct SettingsMenu: View {
    @Environment(WeatherStore.self) private var store

    var body: some View {
        @Bindable var store = store
        Menu {
            Picker("Temperature Unit", selection: $store.unit) {
                ForEach(TemperatureUnit.allCases) { unit in
                    Text(unit.label).tag(unit)
                }
            }
            Divider()
            Button("Refresh", systemImage: "arrow.clockwise") {
                Task { await store.load(force: true) }
            }
        } label: {
            CircleIconLabel(systemName: "line.3.horizontal")
        }
        .accessibilityLabel("Menu")
    }
}

// MARK: - Meters

/// Gradient track with a thumb marking the current value.
struct GradientMeter: View {
    let fraction: Double
    let gradient: LinearGradient
    var height: CGFloat = 8

    var body: some View {
        GeometryReader { proxy in
            let clamped = min(max(fraction, 0), 1)
            ZStack(alignment: .leading) {
                Capsule().fill(gradient)
                Capsule()
                    .fill(.white)
                    .frame(width: 6, height: height + 10)
                    .shadow(color: .black.opacity(0.25), radius: 2)
                    .offset(x: clamped * (proxy.size.width - 6))
            }
        }
        .frame(height: height + 10)
        .accessibilityHidden(true)
    }
}

/// Simple capsule filled up to the given fraction.
struct FillMeter: View {
    let fraction: Double
    var tint: Color = Theme.accent

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.background)
                Capsule()
                    .fill(tint.gradient)
                    .frame(width: max(proxy.size.width * min(max(fraction, 0), 1), 14))
            }
        }
        .frame(height: 10)
        .accessibilityHidden(true)
    }
}

// MARK: - Hourly strip

/// Horizontal list of hourly forecasts with the first hour highlighted as "Now".
struct HourlyStrip: View {
    @Environment(WeatherStore.self) private var store
    let hours: [HourlyForecast]
    let timeZone: TimeZone

    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 4) {
                ForEach(hours) { hour in
                    let isNow = hour.id == hours.first?.id
                    VStack(spacing: 8) {
                        Text(isNow ? "Now" : hour.time.formatted(.dateTime.hour(), in: timeZone))
                            .font(.caption)
                            .foregroundStyle(isNow ? Theme.accent : Theme.secondaryText)
                        WeatherIcon(condition: hour.condition, isDay: hour.isDay, size: 20)
                        Text(store.temperature(hour.temperature))
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(isNow ? Theme.accent : Theme.primaryText)
                    }
                    .frame(width: 50)
                    .padding(.vertical, 10)
                    .background {
                        if isNow {
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Theme.accent.opacity(0.1))
                        }
                    }
                    .accessibilityElement(children: .combine)
                }
            }
        }
        .scrollIndicators(.hidden)
    }
}

// MARK: - Stats

/// Icon + title + value, used in detail grids.
struct StatItem: View {
    let systemName: String
    let title: String
    let value: String
    var detail: String? = nil
    var tint: Color = Theme.accent

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: systemName)
                .font(.system(size: 18))
                .foregroundStyle(tint)
                .frame(width: 34, height: 34)
                .background(tint.opacity(0.1), in: Circle())
            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.caption2)
                    .foregroundStyle(Theme.secondaryText)
                Text(value)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.primaryText)
                if let detail {
                    Text(detail)
                        .font(.caption2)
                        .foregroundStyle(Theme.secondaryText)
                }
            }
            .lineLimit(1)
            .minimumScaleFactor(0.8)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - States

/// Shown when weather couldn't be loaded and nothing is cached.
struct WeatherErrorView: View {
    @Environment(WeatherStore.self) private var store
    let message: String

    var body: some View {
        ContentUnavailableView {
            Label("Couldn't Load Weather", systemImage: "wifi.exclamationmark")
        } description: {
            Text(message)
        } actions: {
            Button("Try Again") {
                Task { await store.load(force: true) }
            }
            .buttonStyle(.borderedProminent)
            .tint(Theme.accent)
        }
        .card()
        .padding(.top, 80)
    }
}

/// Picks the right placeholder while there is no report yet.
struct ReportPlaceholder: View {
    @Environment(WeatherStore.self) private var store

    var body: some View {
        if let message = store.errorMessage {
            WeatherErrorView(message: message)
        } else {
            ProgressView("Loading weather…")
                .tint(Theme.accent)
                .frame(maxWidth: .infinity)
                .padding(.top, 200)
        }
    }
}
