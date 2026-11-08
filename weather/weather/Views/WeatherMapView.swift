//
//  WeatherMapView.swift
//  weather
//

import MapKit
import SwiftUI

enum MapLayer: CaseIterable, Identifiable {
    case precipitation, wind, temperature

    var id: Self { self }

    var title: String {
        switch self {
        case .precipitation: "Precipitation"
        case .wind: "Wind"
        case .temperature: "Temperature"
        }
    }

    var symbol: String {
        switch self {
        case .precipitation: "cloud.rain"
        case .wind: "wind"
        case .temperature: "thermometer.medium"
        }
    }
}

extension City {
    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

struct WeatherMapView: View {
    @Environment(WeatherStore.self) private var store
    @State private var position: MapCameraPosition = .automatic
    @State private var layer: MapLayer = .temperature
    @State private var isSatellite = false
    @State private var showsPanels = true

    var body: some View {
        ZStack {
            Map(position: $position) {
                if let report = store.report {
                    Annotation(report.city.name, coordinate: report.city.coordinate, anchor: .bottom) {
                        cityPin(report)
                    }
                    .annotationTitles(.hidden)
                }
            }
            .mapStyle(isSatellite ? .hybrid(elevation: .realistic) : .standard(elevation: .realistic))
            .ignoresSafeArea()

            VStack(spacing: 12) {
                header
                HStack(alignment: .center) {
                    layerPicker
                    Spacer()
                    mapControls
                }
                Spacer()
                if showsPanels, let report = store.report {
                    VStack(spacing: 10) {
                        legend(report)
                        summaryCard(report)
                        HourlyStrip(hours: Array(report.hourly.prefix(8)), timeZone: report.timeZone)
                            .card(padding: 10, cornerRadius: 20)
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)
        }
        .onAppear { recenter(animated: false) }
        .onChange(of: store.selectedCity) { recenter(animated: true) }
    }

    // MARK: - Overlays

    private var header: some View {
        HStack {
            SettingsMenu()
            Spacer()
            Menu {
                ForEach(store.favorites) { city in
                    Button {
                        Task { await store.select(city) }
                    } label: {
                        if city == store.selectedCity {
                            Label(city.displayName, systemImage: "checkmark")
                        } else {
                            Text(city.displayName)
                        }
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "mappin.and.ellipse")
                        .foregroundStyle(Theme.accent)
                    Text(store.selectedCity.displayName)
                        .lineLimit(1)
                    Image(systemName: "chevron.down")
                        .font(.caption.weight(.semibold))
                }
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.primaryText)
                .padding(.horizontal, 16)
                .padding(.vertical, 11)
                .background(.white, in: Capsule())
                .shadow(color: Theme.shadow, radius: 8, y: 3)
            }
            .accessibilityLabel("Choose city, \(store.selectedCity.displayName)")
            Spacer()
            ProfileAvatar()
        }
        .padding(.top, 8)
    }

    private var layerPicker: some View {
        VStack(spacing: 4) {
            ForEach(MapLayer.allCases) { option in
                let isSelected = option == layer
                Button {
                    withAnimation(.snappy) { layer = option }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: option.symbol)
                            .font(.system(size: 18))
                        Text(option.title)
                            .font(.system(size: 9, weight: .medium))
                    }
                    .foregroundStyle(isSelected ? Theme.accent : Theme.secondaryText)
                    .frame(width: 66, height: 58)
                    .background {
                        if isSelected {
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Theme.accent.opacity(0.1))
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .padding(4)
        .background(.white.opacity(0.92), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .shadow(color: Theme.shadow, radius: 10, y: 4)
    }

    private var mapControls: some View {
        VStack(spacing: 4) {
            mapControlButton("location", label: "Recenter") { recenter(animated: true) }
            mapControlButton(isSatellite ? "map" : "square.2.layers.3d", label: "Map Style") {
                isSatellite.toggle()
            }
            mapControlButton(showsPanels ? "arrow.up.left.and.arrow.down.right" : "arrow.down.right.and.arrow.up.left",
                             label: showsPanels ? "Hide Details" : "Show Details") {
                withAnimation(.snappy) { showsPanels.toggle() }
            }
        }
        .padding(4)
        .background(.white.opacity(0.92), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .shadow(color: Theme.shadow, radius: 10, y: 4)
    }

    private func mapControlButton(_ systemName: String, label: String, action: @escaping () -> Void) -> MapControlButton {
        MapControlButton(systemName: systemName, label: label, action: action)
    }

    private func cityPin(_ report: WeatherReport) -> some View {
        VStack(spacing: 6) {
            HStack(spacing: 4) {
                WeatherIcon(condition: report.current.condition, isDay: report.current.isDay, size: 14)
                Text(store.temperature(report.current.temperature))
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.primaryText)
            }
            .padding(.leading, 6)
            .padding(.trailing, 10)
            .padding(.vertical, 4)
            .background(.white, in: Capsule())
            .shadow(color: .black.opacity(0.15), radius: 6, y: 2)

            Circle()
                .fill(Theme.accent)
                .frame(width: 16, height: 16)
                .overlay(Circle().stroke(.white, lineWidth: 3))
                .background(Circle().fill(Theme.accent.opacity(0.2)).frame(width: 48, height: 48))
        }
    }

    // MARK: - Cards

    private func legend(_ report: WeatherReport) -> some View {
        let config = legendConfiguration(for: report)
        return VStack(alignment: .leading, spacing: 8) {
            Text(config.title)
                .font(.caption.weight(.medium))
                .foregroundStyle(Theme.primaryText)
            GeometryReader { proxy in
                let x = min(max(config.fraction, 0), 1) * proxy.size.width
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(config.gradient)
                        .frame(height: 8)
                    Circle()
                        .fill(.white)
                        .frame(width: 16, height: 16)
                        .shadow(color: .black.opacity(0.25), radius: 2)
                        .position(x: x, y: proxy.size.height / 2)
                    Text(config.valueLabel)
                        .font(.caption2.weight(.semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(.white, in: Capsule())
                        .shadow(color: Theme.shadow, radius: 4)
                        .position(x: x, y: -10)
                }
            }
            .frame(height: 16)
            .padding(.top, 10)
            HStack {
                ForEach(config.ticks, id: \.self) { tick in
                    Text(tick)
                    if tick != config.ticks.last { Spacer() }
                }
            }
            .font(.caption2)
            .foregroundStyle(Theme.secondaryText)
        }
        .card(padding: 14, cornerRadius: 20)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(config.title): \(config.valueLabel)")
    }

    private func summaryCard(_ report: WeatherReport) -> some View {
        let current = report.current
        return HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    WeatherIcon(condition: current.condition, isDay: current.isDay, size: 34)
                    VStack(alignment: .leading, spacing: 0) {
                        Text(store.temperature(current.temperature))
                            .font(.system(size: 32, weight: .semibold, design: .rounded))
                            .foregroundStyle(Theme.primaryText)
                        Text(current.condition.label(isDay: current.isDay))
                            .font(.footnote)
                            .foregroundStyle(Theme.primaryText)
                    }
                }
                Text("Feels like \(store.temperature(current.feelsLike))")
                    .font(.caption2)
                    .foregroundStyle(Theme.secondaryText)
            }
            .fixedSize()

            Divider()

            Grid(alignment: .leading, horizontalSpacing: 8, verticalSpacing: 10) {
                GridRow {
                    compactStat("drop", "Humidity", "\(current.humidity)%")
                    compactStat("wind", "Wind", "\(Int(current.windSpeed.rounded())) km/h \(current.windDirection.compassDirection)")
                }
                GridRow {
                    compactStat("gauge.with.dots.needle.50percent", "Pressure", "\(Int(current.pressure.rounded())) hPa")
                    compactStat("eye", "Visibility", current.visibility.map { "\(Int(($0 / 1000).rounded())) km" } ?? "—")
                }
            }
        }
        // Keep the vertical divider from stretching the card to fill available height.
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        .card(padding: 14, cornerRadius: 20)
    }

    private func compactStat(_ systemName: String, _ title: String, _ value: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: systemName)
                .font(.system(size: 14))
                .foregroundStyle(Theme.accent)
                .frame(width: 18)
            VStack(alignment: .leading, spacing: 0) {
                Text(title)
                    .font(.caption2)
                    .foregroundStyle(Theme.secondaryText)
                Text(value)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(Theme.primaryText)
            }
            .lineLimit(1)
            .minimumScaleFactor(0.8)
        }
        .accessibilityElement(children: .combine)
    }

    // MARK: - Helpers

    private struct LegendConfiguration {
        let title: String
        let valueLabel: String
        let fraction: Double
        let gradient: LinearGradient
        let ticks: [String]
    }

    private func legendConfiguration(for report: WeatherReport) -> LegendConfiguration {
        switch layer {
        case .temperature:
            let ticks = [-10.0, 0, 10, 20, 30, 40]
            return LegendConfiguration(
                title: "Temperature (\(store.unit.symbol))",
                valueLabel: store.temperature(report.current.temperature),
                fraction: (report.current.temperature + 10) / 50,
                gradient: Theme.temperatureGradient,
                ticks: ticks.map { "\(store.convertedTemperature($0))\($0 == ticks.last ? "+" : "")" }
            )
        case .precipitation:
            let chance = report.hourly.first?.precipitationChance ?? 0
            return LegendConfiguration(
                title: "Chance of Rain (%)",
                valueLabel: "\(chance)%",
                fraction: Double(chance) / 100,
                gradient: Theme.precipitationGradient,
                ticks: ["0", "25", "50", "75", "100"]
            )
        case .wind:
            return LegendConfiguration(
                title: "Wind Speed (km/h)",
                valueLabel: "\(Int(report.current.windSpeed.rounded()))",
                fraction: report.current.windSpeed / 60,
                gradient: Theme.windGradient,
                ticks: ["0", "15", "30", "45", "60+"]
            )
        }
    }

    private func recenter(animated: Bool) {
        let region = MKCoordinateRegion(
            center: store.selectedCity.coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.5, longitudeDelta: 0.5)
        )
        if animated {
            withAnimation(.easeInOut) { position = .region(region) }
        } else {
            position = .region(region)
        }
    }
}

/// Square icon button used in the map's right-hand control stack.
private struct MapControlButton: View {
    let systemName: String
    let label: String
    let action: () -> Void

    var body: some View {
        Button {
            action()
        } label: {
            Image(systemName: systemName)
                .font(.system(size: 17))
                .foregroundStyle(Theme.primaryText)
                .frame(width: 40, height: 40)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }
}

#Preview {
    WeatherMapView()
        .environment(WeatherStore.preview)
}
