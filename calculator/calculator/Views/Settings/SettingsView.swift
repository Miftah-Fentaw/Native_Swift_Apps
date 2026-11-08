//
//  SettingsView.swift
//  calculator
//

import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(CalculatorEngine.self) private var engine

    @AppStorage(SettingsKey.theme) private var theme: AppTheme = .system
    @AppStorage(SettingsKey.haptics) private var hapticsEnabled = true

    @AppStorage(SettingsKey.precision) private var precision = 10
    @AppStorage(SettingsKey.grouping) private var grouping = true
    @AppStorage(SettingsKey.liveResult) private var showsLiveResult = true
    @AppStorage(SettingsKey.showScientific) private var showScientific = false

    @AppStorage(SettingsKey.defaultTip) private var defaultTip = 10
    @AppStorage(SettingsKey.roundUp) private var roundUp = false
    @AppStorage(SettingsKey.showCurrency) private var showCurrency = false

    @State private var isConfirmingClear = false

    var body: some View {
        @Bindable var engine = engine

        NavigationStack {
            Form {
                Section("Appearance") {
                    Picker("Theme", selection: $theme) {
                        ForEach(AppTheme.allCases) { option in
                            Label(option.title, systemImage: option.symbol)
                                .tag(option)
                        }
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
                }

                Section {
                    Picker("Angle unit", selection: $engine.angleMode) {
                        Text("Degrees").tag(AngleMode.degrees)
                        Text("Radians").tag(AngleMode.radians)
                    }
                    Picker("Decimal places", selection: $precision) {
                        ForEach(precisionOptions, id: \.self) { places in
                            Text("\(places)").tag(places)
                        }
                    }
                    Toggle("Thousands separator", isOn: $grouping)
                    Toggle("Live result preview", isOn: $showsLiveResult)
                    Toggle("Scientific keys", isOn: $showScientific)
                } header: {
                    Text("Calculator")
                } footer: {
                    Text("Swipe across the display to delete a digit. Long-press ⌫ to clear everything.")
                }

                Section {
                    Picker("Default tip", selection: $defaultTip) {
                        ForEach(tipPresets, id: \.self) { percent in
                            Text("\(percent)%").tag(percent)
                        }
                    }
                    Toggle("Round up split total", isOn: $roundUp)
                    Toggle("Show currency symbol", isOn: $showCurrency)
                } header: {
                    Text("Tip")
                } footer: {
                    Text("Rounding up makes each person's share a whole amount.")
                }

                Section("Feedback") {
                    Toggle("Haptics", isOn: $hapticsEnabled)
                }

                Section("Data") {
                    Button("Clear Calculation History", role: .destructive) {
                        isConfirmingClear = true
                    }
                    .disabled(engine.history.isEmpty)
                }

                Section {
                    LabeledContent("Version", value: appVersion)
                }
            }
            .tint(.appAccent)
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .confirmationDialog("Clear all history?", isPresented: $isConfirmingClear,
                                titleVisibility: .visible) {
                Button("Clear History", role: .destructive) {
                    engine.clearHistory()
                }
            }
        }
        .preferredColorScheme(theme.colorScheme)
    }

    private var appVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
    }
}

#Preview {
    SettingsView()
        .environment(CalculatorEngine())
}
