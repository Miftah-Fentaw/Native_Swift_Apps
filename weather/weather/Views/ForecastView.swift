//
//  ForecastView.swift
//  weather
//

import SwiftUI

enum ForecastMode: String, CaseIterable, Identifiable {
    case hourly = "Hourly"
    case daily = "Daily"
    case fourteenDay = "14-Day"

    var id: Self { self }
}

struct ForecastView: View {
    @Environment(WeatherStore.self) private var store
    @Binding var mode: ForecastMode
    var onBack: () -> Void = {}

    @State private var expandedDay: Date?
    @Namespace private var modeNamespace

    var body: some View {
        ZStack {
            SkyBackground()
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    header
                    modePicker
                    if let report = store.report {
                        switch mode {
                        case .hourly:
                            hourlyList(report)
                        case .daily:
                            dailyList(report, days: 7)
                        case .fourteenDay:
                            dailyList(report, days: 14)
                        }
                        if let airQuality = report.airQuality {
                            AirQualityCard(airQuality: airQuality)
                        }
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

    // MARK: - Header

    private var header: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Button(action: onBack) {
                    CircleIconLabel(systemName: "arrow.left")
                }
                .accessibilityLabel("Back")
                Spacer()
                ProfileAvatar()
            }
            .padding(.top, 8)

            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Forecast")
                        .font(.system(size: 34, weight: .semibold))
                        .foregroundStyle(.white)
                    Label(store.selectedCity.displayName, systemImage: "mappin.and.ellipse")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.9))
                }
                Spacer()
                ZStack(alignment: .bottomTrailing) {
                    SunView(size: 52)
                        .padding(.trailing, 30)
                        .padding(.bottom, 20)
                    CloudView(width: 50)
                }
            }
        }
    }

    private var modePicker: some View {
        HStack(spacing: 0) {
            ForEach(ForecastMode.allCases) { option in
                let isSelected = option == mode
                Button {
                    withAnimation(.snappy) { mode = option }
                } label: {
                    Text(option.rawValue)
                        .font(.subheadline.weight(isSelected ? .semibold : .regular))
                        .foregroundStyle(isSelected ? Theme.accent : Theme.secondaryText)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background {
                            if isSelected {
                                Capsule()
                                    .fill(.white)
                                    .shadow(color: Theme.shadow, radius: 6, y: 2)
                                    .matchedGeometryEffect(id: "mode", in: modeNamespace)
                            }
                        }
                        .contentShape(Capsule())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .padding(5)
        .background(.white.opacity(0.6), in: Capsule())
    }

    // MARK: - Lists

    private func dailyList(_ report: WeatherReport, days: Int) -> some View {
        VStack(spacing: 10) {
            ForEach(Array(report.daily.prefix(days).enumerated()), id: \.element.id) { index, day in
                DailyRow(
                    day: day,
                    isToday: index == 0,
                    timeZone: report.timeZone,
                    isExpanded: expandedDay == day.date
                ) {
                    withAnimation(.snappy) {
                        expandedDay = expandedDay == day.date ? nil : day.date
                    }
                }
            }
        }
    }

    private func hourlyList(_ report: WeatherReport) -> some View {
        VStack(spacing: 10) {
            ForEach(Array(report.hourly.enumerated()), id: \.element.id) { index, hour in
                HStack(spacing: 12) {
                    Text(index == 0 ? "Now" : hour.time.formatted(.dateTime.hour(), in: report.timeZone))
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(index == 0 ? Theme.accent : Theme.primaryText)
                        .frame(width: 60, alignment: .leading)
                    WeatherIcon(condition: hour.condition, isDay: hour.isDay, size: 24)
                    Text(store.temperature(hour.temperature))
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(Theme.primaryText)
                        .frame(width: 50, alignment: .leading)
                    Text(hour.condition.label(isDay: hour.isDay))
                        .font(.footnote)
                        .foregroundStyle(Theme.secondaryText)
                        .lineLimit(1)
                    Spacer(minLength: 0)
                    Label("\(hour.precipitationChance)%", systemImage: "drop.fill")
                        .font(.caption)
                        .foregroundStyle(Theme.accent)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(index == 0 ? Theme.accent.opacity(0.08) : .white,
                            in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .shadow(color: Theme.shadow, radius: 10, y: 4)
                .accessibilityElement(children: .combine)
            }
        }
    }
}

// MARK: - Rows

private struct DailyRow: View {
    @Environment(WeatherStore.self) private var store
    let day: DailyForecast
    let isToday: Bool
    let timeZone: TimeZone
    let isExpanded: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(isToday ? "Today" : day.date.formatted(.dateTime.weekday(.abbreviated).month(.abbreviated).day(), in: timeZone))
                            .font(.subheadline.weight(isToday ? .semibold : .medium))
                            .foregroundStyle(isToday ? Theme.accent : Theme.primaryText)
                        if isToday {
                            Text(day.date.formatted(.dateTime.month(.abbreviated).day().year(), in: timeZone))
                                .font(.caption2)
                                .foregroundStyle(Theme.secondaryText)
                        }
                    }
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                    .frame(width: 84, alignment: .leading)

                    WeatherIcon(condition: day.condition, size: 24)

                    temperatureColumn(day.high, caption: "Day")
                    temperatureColumn(day.low, caption: "Night")

                    VStack(alignment: .leading, spacing: 2) {
                        Text(day.condition.label())
                            .font(.caption)
                            .foregroundStyle(Theme.secondaryText)
                            .lineLimit(1)
                            .minimumScaleFactor(0.8)
                        Label("\(day.precipitationChance)%", systemImage: "drop.fill")
                            .font(.caption2)
                            .foregroundStyle(Theme.accent)
                    }
                    Spacer(minLength: 0)

                    Image(systemName: "chevron.down")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(Theme.secondaryText)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }

                if isExpanded {
                    Divider()
                    HStack {
                        StatItem(systemName: "sunrise.fill", title: "Sunrise",
                                 value: day.sunrise?.formatted(.dateTime.hour().minute(), in: timeZone) ?? "—",
                                 tint: .orange)
                        StatItem(systemName: "sunset.fill", title: "Sunset",
                                 value: day.sunset?.formatted(.dateTime.hour().minute(), in: timeZone) ?? "—",
                                 tint: .purple)
                        StatItem(systemName: "sun.max.fill", title: "UV Index",
                                 value: day.uvIndex.formatted(.number.precision(.fractionLength(0))),
                                 tint: Theme.sun)
                    }
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
            .padding(14)
            .background(isToday ? Color(red: 0.93, green: 0.95, blue: 1.0) : .white,
                        in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            .shadow(color: Theme.shadow, radius: 10, y: 4)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityHint(isExpanded ? "Collapse details" : "Expand details")
    }

    private func temperatureColumn(_ value: Double, caption: String) -> some View {
        VStack(spacing: 0) {
            Text(store.temperature(value))
                .font(.headline)
                .foregroundStyle(Theme.primaryText)
            Text(caption)
                .font(.caption2)
                .foregroundStyle(Theme.secondaryText)
        }
        .frame(width: 40)
    }
}

/// Compact air quality summary shown under the forecast list.
private struct AirQualityCard: View {
    let airQuality: AirQuality

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Air Quality Today")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.primaryText)
                HStack(spacing: 10) {
                    Text("\(airQuality.index)")
                        .font(.system(size: 26, weight: .semibold, design: .rounded))
                        .foregroundStyle(Theme.primaryText)
                    Text(airQuality.category)
                        .font(.caption)
                        .foregroundStyle(Theme.secondaryText)
                    GradientMeter(fraction: airQuality.meterFraction, gradient: Theme.airQualityGradient, height: 6)
                }
                Text(airQuality.summary)
                    .font(.caption2)
                    .foregroundStyle(Theme.secondaryText)
            }
            Image(systemName: "sun.max")
                .font(.title3)
                .foregroundStyle(Theme.secondaryText)
        }
        .padding(16)
        .background(Color(red: 0.93, green: 0.95, blue: 1.0), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(Theme.accent.opacity(0.15)))
        .accessibilityElement(children: .combine)
    }
}

#Preview {
    @Previewable @State var mode = ForecastMode.daily
    ForecastView(mode: $mode)
        .environment(WeatherStore.preview)
}
