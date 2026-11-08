//
//  TipCalculatorView.swift
//  calculator
//

import SwiftUI

/// Bill, tip percentage, and per-person split.
struct TipCalculatorView: View {
    @Environment(\.colorScheme) private var colorScheme

    @AppStorage(SettingsKey.defaultTip) private var defaultTip = 10
    @AppStorage(SettingsKey.haptics) private var hapticsEnabled = true
    @AppStorage(SettingsKey.roundUp) private var roundUp = false
    @AppStorage(SettingsKey.showCurrency) private var showCurrency = false

    @State private var calculator = TipCalculator()
    /// Bumped on every interaction so a haptic can fire.
    @State private var feedbackTrigger = 0

    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 32) {
                billSection
                tipSection
            }
            .padding(.horizontal, 24)
            .padding(.top, 16)
            .frame(maxWidth: .infinity, alignment: .leading)

            Spacer(minLength: 16)

            splitCard
                .padding(.horizontal, 16)
                .padding(.bottom, 16)

            KeypadView(onKey: handleKey, onClear: clearBill)
                .frame(height: 290)
        }
        .sensoryFeedback(trigger: feedbackTrigger) { _, _ in
            hapticsEnabled ? .selection : nil
        }
        .onAppear {
            calculator.tipPercent = defaultTip
        }
        .onChange(of: defaultTip) { _, newValue in
            calculator.tipPercent = newValue
        }
    }

    private var isDark: Bool {
        colorScheme == .dark
    }

    // MARK: - Bill

    private var billSection: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                sectionLabel("Bill total")
                Spacer()
                if !calculator.billInput.isEmpty || calculator.splitCount > 1 {
                    Button("Reset", systemImage: "arrow.counterclockwise") {
                        withAnimation(.snappy) {
                            calculator.reset(tipPercent: defaultTip)
                        }
                        feedbackTrigger += 1
                    }
                    .font(.subheadline.weight(.medium))
                    .tint(.appAccent)
                    .transition(.opacity)
                }
            }
            .animation(.snappy, value: calculator.billInput.isEmpty)

            HStack(spacing: 2) {
                if calculator.billInput.isEmpty {
                    BlinkingCursor()
                    Text(placeholder)
                        .foregroundStyle(.tertiary)
                } else {
                    Text(displayedBill)
                        .contentTransition(.numericText())
                    BlinkingCursor()
                }
            }
            .font(.system(size: 40, weight: .medium))
            .lineLimit(1)
            .minimumScaleFactor(0.5)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("Bill total")
            .accessibilityValue(calculator.billAmount.moneyString(showSymbol: true))
        }
    }

    private var placeholder: String {
        0.0.moneyString(showSymbol: showCurrency)
    }

    /// Shows what the user typed, prefixed with the currency symbol when enabled.
    private var displayedBill: String {
        let text = NumberFormatting.display(calculator.billInput, grouping: true)
        guard showCurrency else { return text }
        return (Locale.current.currencySymbol ?? "$") + text
    }

    // MARK: - Tip

    private var tipSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Tip")

            Text("\(calculator.tipPercent)%")
                .font(.system(size: 32, weight: .semibold))
                .contentTransition(.numericText(value: Double(calculator.tipPercent)))
                .accessibilityLabel("Tip \(calculator.tipPercent) percent")

            ScrollView(.horizontal) {
                HStack(spacing: 8) {
                    ForEach(tipPresets, id: \.self) { percent in
                        ChipButton(title: "\(percent)%", isSelected: calculator.tipPercent == percent) {
                            withAnimation(.snappy) {
                                calculator.tipPercent = percent
                            }
                            feedbackTrigger += 1
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
            .scrollClipDisabled()
        }
    }

    // MARK: - Split

    private var splitCard: some View {
        VStack(spacing: 14) {
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Split")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(Color.appAccent)

                    HStack(spacing: 12) {
                        stepperButton("minus", label: "Fewer people",
                                      disabled: calculator.splitCount <= TipCalculator.splitRange.lowerBound) {
                            calculator.decrementSplit()
                        }

                        Text("\(calculator.splitCount)")
                            .font(.title2.weight(.semibold))
                            .monospacedDigit()
                            .frame(minWidth: 26)
                            .contentTransition(.numericText(value: Double(calculator.splitCount)))
                            .accessibilityLabel("\(calculator.splitCount) people")

                        stepperButton("plus", label: "More people",
                                      disabled: calculator.splitCount >= TipCalculator.splitRange.upperBound) {
                            calculator.incrementSplit()
                        }
                    }
                }

                Spacer(minLength: 12)

                VStack(alignment: .trailing, spacing: 4) {
                    Text("Split total")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(Color.appAccent)

                    Text(calculator.perPersonAmount(roundUp: roundUp).moneyString(showSymbol: showCurrency))
                        .font(.system(size: 34, weight: .semibold))
                        .foregroundStyle(Color.appAccent)
                        .lineLimit(1)
                        .minimumScaleFactor(0.5)
                        .contentTransition(.numericText())
                }
                .accessibilityElement(children: .combine)
            }

            // Breakdown so the user can see where the split total comes from.
            HStack {
                summaryItem("Tip", calculator.tipAmount)
                Spacer()
                summaryItem("Total", calculator.totalAmount)
            }
            .font(.footnote)
        }
        .padding(18)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.appAccent.opacity(isDark ? 0.2 : 0.08))
        )
        .animation(.snappy, value: calculator.totalAmount)
        .animation(.snappy, value: calculator.splitCount)
    }

    private func stepperButton(_ symbol: String, label: String, disabled: Bool,
                               action: @escaping () -> Void) -> some View {
        Button {
            action()
            feedbackTrigger += 1
        } label: {
            Image(systemName: symbol)
                .font(.caption.weight(.bold))
                .frame(width: 30, height: 30)
                .background(Circle().fill(Color.appAccent.opacity(isDark ? 0.3 : 0.14)))
                .foregroundStyle(Color.appAccent)
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .opacity(disabled ? 0.4 : 1)
        .accessibilityLabel(label)
    }

    private func summaryItem(_ title: String, _ amount: Double) -> some View {
        HStack(spacing: 4) {
            Text(title)
                .foregroundStyle(.secondary)
            Text(amount.moneyString(showSymbol: showCurrency))
                .fontWeight(.medium)
                .contentTransition(.numericText())
        }
    }

    // MARK: - Helpers

    private func sectionLabel(_ text: String) -> some View {
        Text(text)
            .font(.subheadline.weight(.medium))
            .foregroundStyle(.secondary)
    }

    private func handleKey(_ key: KeypadKey) {
        withAnimation(.snappy(duration: 0.2)) {
            switch key {
            case .digit(let value): calculator.appendDigit(value)
            case .decimal: calculator.appendDecimalPoint()
            case .delete: calculator.deleteLast()
            }
        }
        feedbackTrigger += 1
    }

    private func clearBill() {
        withAnimation(.snappy) {
            calculator.clear()
        }
        feedbackTrigger += 1
    }
}

#Preview {
    TipCalculatorView()
}
