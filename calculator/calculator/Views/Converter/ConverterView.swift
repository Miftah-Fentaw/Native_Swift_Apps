//
//  ConverterView.swift
//  calculator
//

import SwiftUI

/// Unit converter for length, weight, temperature, and more.
struct ConverterView: View {
    @Environment(\.colorScheme) private var colorScheme

    @AppStorage(SettingsKey.haptics) private var hapticsEnabled = true
    @AppStorage(SettingsKey.grouping) private var grouping = true

    @State private var category = ConversionCategory.all[0]
    @State private var fromIndex = 0
    @State private var toIndex = 1
    @State private var entry = NumberEntry(maxIntegerDigits: 12, maxFractionDigits: 6)
    @State private var feedbackTrigger = 0

    private static let resultFractionDigits = 6

    var body: some View {
        VStack(spacing: 0) {
            categoryPicker
                .padding(.top, 8)

            VStack(spacing: 10) {
                fromCard
                swapButton
                toCard

                Text(rateDescription)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .padding(.top, 4)
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)

            Spacer(minLength: 12)

            KeypadView(onKey: handleKey, onClear: clearEntry)
                .frame(height: 290)
        }
        .sensoryFeedback(trigger: feedbackTrigger) { _, _ in
            hapticsEnabled ? .selection : nil
        }
    }

    private var isDark: Bool {
        colorScheme == .dark
    }

    // Indices are clamped so a stale index can never crash after switching categories.
    private var fromUnit: UnitOption {
        category.units[min(fromIndex, category.units.count - 1)]
    }

    private var toUnit: UnitOption {
        category.units[min(toIndex, category.units.count - 1)]
    }

    private var result: Double {
        category.convert(entry.value, from: fromUnit, to: toUnit)
    }

    private var rateDescription: String {
        let rate = category.convert(1, from: fromUnit, to: toUnit)
        let formatted = NumberFormatting.display(rate, maxFractionDigits: Self.resultFractionDigits, grouping: grouping)
        return "1 \(fromUnit.symbol) = \(formatted) \(toUnit.symbol)"
    }

    // MARK: - Category

    private var categoryPicker: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                ForEach(ConversionCategory.all) { option in
                    ChipButton(title: option.title, systemImage: option.systemImage,
                               isSelected: option == category) {
                        select(option)
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .scrollIndicators(.hidden)
    }

    private func select(_ option: ConversionCategory) {
        guard option != category else { return }
        withAnimation(.snappy) {
            category = option
            fromIndex = 0
            toIndex = 1
            if !option.allowsNegative && entry.text.hasPrefix("-") {
                entry.toggleSign()
            }
        }
        feedbackTrigger += 1
    }

    // MARK: - Cards

    private var fromCard: some View {
        card(title: "From", selection: $fromIndex, isResult: false) {
            HStack(spacing: 2) {
                if entry.isEmpty {
                    BlinkingCursor(height: 34)
                    Text("0")
                        .foregroundStyle(.tertiary)
                } else {
                    Text(NumberFormatting.display(entry.text, grouping: grouping))
                        .contentTransition(.numericText())
                    BlinkingCursor(height: 34)
                }

                Spacer(minLength: 8)

                if category.allowsNegative {
                    Button("Change sign", systemImage: "plus.forwardslash.minus") {
                        withAnimation(.snappy) { entry.toggleSign() }
                        feedbackTrigger += 1
                    }
                    .labelStyle(.iconOnly)
                    .buttonStyle(IconButtonStyle())
                }
            }
        }
    }

    private var toCard: some View {
        card(title: "To", selection: $toIndex, isResult: true) {
            Text(NumberFormatting.display(result, maxFractionDigits: Self.resultFractionDigits, grouping: grouping))
                .foregroundStyle(Color.appAccent)
                .contentTransition(.numericText())
                .frame(maxWidth: .infinity, alignment: .leading)
                .contextMenu {
                    Button("Copy", systemImage: "doc.on.doc") {
                        UIPasteboard.general.string = NumberFormatting.raw(result, maxFractionDigits: Self.resultFractionDigits)
                    }
                }
        }
    }

    private func card<Content: View>(title: String, selection: Binding<Int>, isResult: Bool,
                                     @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(isResult ? Color.appAccent : Color.secondary)

                Spacer()

                Picker(title + " unit", selection: selection) {
                    ForEach(category.units.indices, id: \.self) { index in
                        Text(category.units[index].name).tag(index)
                    }
                }
                .pickerStyle(.menu)
                .tint(isResult ? .appAccent : .primary)
            }

            content()
                .font(.system(size: 36, weight: .semibold))
                .lineLimit(1)
                .minimumScaleFactor(0.4)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(isResult ? Color.appAccent.opacity(isDark ? 0.2 : 0.08) : Color.primary.opacity(0.04))
        )
        .animation(.snappy, value: result)
    }

    private var swapButton: some View {
        Button("Swap units", systemImage: "arrow.up.arrow.down") {
            withAnimation(.snappy) {
                let previousFrom = fromIndex
                fromIndex = toIndex
                toIndex = previousFrom
            }
            feedbackTrigger += 1
        }
        .labelStyle(.iconOnly)
        .buttonStyle(IconButtonStyle(isActive: true))
    }

    // MARK: - Input

    private func handleKey(_ key: KeypadKey) {
        withAnimation(.snappy(duration: 0.2)) {
            switch key {
            case .digit(let value): entry.appendDigit(value)
            case .decimal: entry.appendDecimalPoint()
            case .delete: entry.deleteLast()
            }
        }
        feedbackTrigger += 1
    }

    private func clearEntry() {
        withAnimation(.snappy) {
            entry.clear()
        }
        feedbackTrigger += 1
    }
}

#Preview {
    ConverterView()
}
