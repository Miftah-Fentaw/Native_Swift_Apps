//
//  ContentView.swift
//  calculator
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI

/// Root screen: header with mode switcher, theme toggle, and settings, above the active tool.
struct ContentView: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(CalculatorEngine.self) private var engine

    @AppStorage(SettingsKey.theme) private var theme: AppTheme = .system
    @AppStorage(SettingsKey.appMode) private var mode: AppMode = .calculator
    @AppStorage(SettingsKey.haptics) private var hapticsEnabled = true

    @State private var isShowingSettings = false
    @State private var isShowingHistory = false

    var body: some View {
        VStack(spacing: 0) {
            header
                .padding(.horizontal, 8)
                .padding(.top, 8)
                .padding(.bottom, 4)

            Group {
                switch mode {
                case .calculator: CalculatorView()
                case .tip: TipCalculatorView()
                case .converter: ConverterView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .transition(.opacity)
        }
        .background(Color(.systemBackground))
        .sheet(isPresented: $isShowingSettings) {
            SettingsView()
                .environment(engine)
        }
        .sheet(isPresented: $isShowingHistory) {
            HistoryView()
                .environment(engine)
                .presentationDetents([.medium, .large])
        }
    }

    private var isDark: Bool {
        colorScheme == .dark
    }

    // MARK: - Header

    private var header: some View {
        HStack(spacing: 4) {
            // History only applies to the calculator; keep its space so the layout doesn't jump.
            Button("History", systemImage: "clock.arrow.circlepath") {
                isShowingHistory = true
            }
            .opacity(mode == .calculator ? 1 : 0)
            .disabled(mode != .calculator)

            // Stretches to fill the space between the buttons so every title fits.
            modePicker
                .padding(.horizontal, 6)

            Button(isDark ? "Light mode" : "Dark mode",
                   systemImage: isDark ? "sun.max" : "moon") {
                withAnimation(.easeInOut(duration: 0.25)) {
                    theme = isDark ? .light : .dark
                }
            }
            .contentTransition(.symbolEffect(.replace))

            Button("Settings", systemImage: "gearshape") {
                isShowingSettings = true
            }
        }
        .labelStyle(.iconOnly)
        .buttonStyle(IconButtonStyle())
    }

    /// Compact segmented control with a sliding selection capsule.
    private var modePicker: some View {
        HStack(spacing: 2) {
            ForEach(AppMode.allCases) { option in
                let isSelected = option == mode
                Button {
                    withAnimation(.snappy) { mode = option }
                } label: {
                    Text(option.title)
                        .font(.footnote.weight(.semibold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 8)
                        .frame(maxWidth: .infinity)
                        .foregroundStyle(isSelected ? Color.primary : Color.secondary)
                        .background {
                            if isSelected {
                                Capsule()
                                    .fill(Color(.systemBackground))
                                    .shadow(color: .black.opacity(0.08), radius: 3, y: 1)
                                    .matchedGeometryEffect(id: "selection", in: modeNamespace)
                            }
                        }
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .padding(3)
        .background(Capsule().fill(Color.primary.opacity(0.07)))
        .sensoryFeedback(trigger: mode) { _, _ in
            hapticsEnabled ? .selection : nil
        }
    }

    @Namespace private var modeNamespace
}

#Preview("Light") {
    ContentView()
        .environment(CalculatorEngine())
        .preferredColorScheme(.light)
}

#Preview("Dark") {
    ContentView()
        .environment(CalculatorEngine())
        .preferredColorScheme(.dark)
}
