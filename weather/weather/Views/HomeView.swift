//
//  HomeView.swift
//  weather
//

import SwiftUI

struct HomeView: View {
    @Environment(WeatherStore.self) private var store
    var onShowAllHours: () -> Void = {}

    var body: some View {
        ZStack {
            SkyBackground()
            ScrollView {
                VStack(spacing: 16) {
                    header
                    if let report = store.report {
                        hero(report)
                        airAndCloudCard(report)
                        hourlyCard(report)
                        detailsCard(report)
                    } else {
                        ReportPlaceholder()
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
            .scrollIndicators(.hidden)
            .refreshable { await store.load(force: true) }
        }
    }

    // MARK: - Sections

    private var header: some View {
        HStack {
            SettingsMenu()
            Spacer()
            Label(store.selectedCity.displayName, systemImage: "mappin.and.ellipse")
                .font(.headline.weight(.medium))
                .foregroundStyle(.white)
                .lineLimit(1)
            Spacer()
            ProfileAvatar()
        }
        .padding(.top, 8)
    }

    private func hero(_ report: WeatherReport) -> some View {
        let current = report.current
        return VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                if current.isDay && current.condition.isSunny {
                    SunView(size: 60)
                        .padding(.leading, 12)
                } else {
                    WeatherIcon(condition: current.condition, isDay: current.isDay, size: 54)
                }
                Spacer()
                CloudView(width: 64)
                    .offset(y: 60)
            }
            .frame(height: 90)

            ZStack(alignment: .bottomLeading) {
                SunArc(progress: report.sunProgress)
                    .frame(height: 110)
                    .padding(.leading, 110)
                    .padding(.bottom, 10)

                Text(store.temperature(current.temperature))
                    .font(.system(size: 92, weight: .light, design: .rounded))
                    .foregroundStyle(.white)
                    .shadow(color: Theme.skyTop.opacity(0.4), radius: 8)
                    .contentTransition(.numericText())
                    .accessibilityLabel("Temperature \(store.temperature(current.temperature))")
            }

            HStack {
                Text(current.condition.label(isDay: current.isDay))
                    .font(.title3)
                    .foregroundStyle(.white)
                Spacer()
                Text(current.time.formatted(.dateTime.hour().minute(), in: report.timeZone))
                Spacer()
                Text(current.time.formatted(.dateTime.month(.abbreviated).day().year(), in: report.timeZone))
            }
            .font(.footnote)
            .foregroundStyle(.white.opacity(0.9))
        }
        .padding(.bottom, 8)
    }

    private func airAndCloudCard(_ report: WeatherReport) -> some View {
        HStack(alignment: .top, spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                cardTitle("Air Quality Index", systemName: "sun.max")
                if let airQuality = report.airQuality {
                    Text("\(airQuality.index)")
                        .font(.system(size: 28, weight: .semibold, design: .rounded))
                        .foregroundStyle(Theme.primaryText)
                    Text(airQuality.category)
                        .font(.caption)
                        .foregroundStyle(Theme.secondaryText)
                    GradientMeter(fraction: airQuality.meterFraction, gradient: Theme.airQualityGradient)
                        .padding(.top, 6)
                } else {
                    Text("—")
                        .font(.system(size: 28, weight: .semibold, design: .rounded))
                    Text("Unavailable")
                        .font(.caption)
                        .foregroundStyle(Theme.secondaryText)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Divider()

            VStack(alignment: .leading, spacing: 6) {
                cardTitle("Cloud Cover", systemName: "cloud")
                Text("\(report.current.cloudCover)%")
                    .font(.system(size: 28, weight: .semibold, design: .rounded))
                    .foregroundStyle(Theme.primaryText)
                Text(report.current.cloudCoverDescription)
                    .font(.caption)
                    .foregroundStyle(Theme.secondaryText)
                FillMeter(fraction: Double(report.current.cloudCover) / 100)
                    .padding(.vertical, 5)
                    .padding(.top, 6)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .card()
    }

    private func hourlyCard(_ report: WeatherReport) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Hourly Forecast")
                    .font(.headline)
                    .foregroundStyle(Theme.primaryText)
                Spacer()
                Button("View All", action: onShowAllHours)
                    .font(.footnote.weight(.medium))
                    .foregroundStyle(Theme.accent)
            }
            HourlyStrip(hours: Array(report.hourly.prefix(12)), timeZone: report.timeZone)
        }
        .card()
    }

    private func detailsCard(_ report: WeatherReport) -> some View {
        let current = report.current
        return VStack(spacing: 16) {
            HStack(spacing: 8) {
                StatItem(systemName: "thermometer.medium", title: "Feels Like",
                         value: store.temperature(current.feelsLike), tint: .orange)
                StatItem(systemName: "drop.fill", title: "Humidity",
                         value: "\(current.humidity)%")
                StatItem(systemName: "wind", title: "Wind",
                         value: "\(Int(current.windSpeed.rounded())) km/h",
                         detail: current.windDirection.compassDirection, tint: .teal)
            }
            Divider()
            HStack(spacing: 8) {
                StatItem(systemName: "sunrise.fill", title: "Sunrise",
                         value: report.today?.sunrise?.formatted(.dateTime.hour().minute(), in: report.timeZone) ?? "—",
                         tint: .orange)
                Divider().frame(height: 36)
                StatItem(systemName: "sunset.fill", title: "Sunset",
                         value: report.today?.sunset?.formatted(.dateTime.hour().minute(), in: report.timeZone) ?? "—",
                         tint: .purple)
                    .padding(.leading, 8)
            }
        }
        .card()
    }

    private func cardTitle(_ title: String, systemName: String) -> some View {
        HStack {
            Text(title)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.primaryText)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
            Spacer(minLength: 4)
            Image(systemName: systemName)
                .foregroundStyle(Theme.secondaryText)
        }
    }
}

#Preview {
    HomeView()
        .environment(WeatherStore.preview)
}
