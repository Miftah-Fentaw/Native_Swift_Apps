//
//  CalculatorView.swift
//  calculator
//

import SwiftUI

/// Standard and scientific calculator.
struct CalculatorView: View {
    @Environment(CalculatorEngine.self) private var engine

    @AppStorage(SettingsKey.showScientific) private var showScientific = false
    @AppStorage(SettingsKey.grouping) private var grouping = true
    @AppStorage(SettingsKey.liveResult) private var showsLiveResult = true
    @AppStorage(SettingsKey.haptics) private var hapticsEnabled = true

    /// When on, scientific keys show their inverse functions (sin⁻¹, eˣ, …).
    @State private var isSecondActive = false
    /// Bumped on every key press so a haptic can fire.
    @State private var feedbackTrigger = 0

    var body: some View {
        GeometryReader { proxy in
            // Key grids always span the full width; only their height adapts to the screen.
            let height = proxy.size.height
            let basicHeight = showScientific ? height * 0.46 : min(height * 0.64, proxy.size.width * 1.3)
            let scientificHeight = height * 0.25

            VStack(spacing: 10) {
                display

                if showScientific {
                    keyGrid(scientificRows, spacing: 6, font: .callout.weight(.medium), cornerRadius: 12)
                        .frame(height: scientificHeight)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                keyGrid(basicRows, spacing: 8, font: .title.weight(.regular), cornerRadius: 20)
                    .frame(height: basicHeight)
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.horizontal, 8)
        .padding(.bottom, 8)
        .sensoryFeedback(trigger: feedbackTrigger) { _, _ in
            hapticsEnabled ? .selection : nil
        }
    }

    // MARK: - Display

    private var display: some View {
        VStack(alignment: .trailing, spacing: 6) {
            HStack(spacing: 8) {
                if engine.memory != nil {
                    indicator("M")
                }
                indicator(engine.angleMode == .degrees ? "DEG" : "RAD")

                Spacer()

                Button(showScientific ? "Hide scientific keys" : "Show scientific keys",
                       systemImage: "function") {
                    withAnimation(.snappy) {
                        showScientific.toggle()
                    }
                    feedbackTrigger += 1
                }
                .labelStyle(.iconOnly)
                .buttonStyle(IconButtonStyle(isActive: showScientific))
            }

            Spacer(minLength: 0)

            if engine.justEvaluated, let lastExpression = engine.lastExpression {
                Text(lastExpression + " =")
                    .font(.title3)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
                    .minimumScaleFactor(0.5)
                    .multilineTextAlignment(.trailing)
                    .transition(.opacity)
            }

            mainLine

            if showsLiveResult, let preview = engine.previewText(grouping: grouping) {
                Text("= " + preview)
                    .font(.title2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
                    .contentTransition(.numericText())
                    .transition(.opacity)
            }
        }
        .padding(.horizontal, 8)
        .frame(maxWidth: .infinity, minHeight: 110, maxHeight: .infinity, alignment: .bottomTrailing)
        .contentShape(Rectangle())
        // Swiping across the display deletes the last character.
        .gesture(
            DragGesture(minimumDistance: 30).onEnded { value in
                if abs(value.translation.width) > 40 && abs(value.translation.height) < 40 {
                    press(.backspace)
                }
            }
        )
        .contextMenu {
            Button("Copy", systemImage: "doc.on.doc") {
                if let text = engine.copyableText() {
                    UIPasteboard.general.string = text
                }
            }
            Button("Paste", systemImage: "doc.on.clipboard") {
                if let text = UIPasteboard.general.string {
                    withAnimation(.snappy) { engine.paste(text) }
                }
            }
        }
        .animation(.snappy(duration: 0.2), value: engine.justEvaluated)
    }

    private var mainLine: some View {
        Group {
            if let error = engine.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
            } else {
                Text(engine.expressionText(grouping: grouping))
                    .contentTransition(.numericText())
            }
        }
        .font(.system(size: showScientific ? 48 : 64, weight: .light))
        .lineLimit(2)
        .minimumScaleFactor(0.3)
        .multilineTextAlignment(.trailing)
        .accessibilityAddTraits(.updatesFrequently)
    }

    private func indicator(_ text: String) -> some View {
        Text(text)
            .font(.caption2.weight(.semibold))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(Capsule().fill(Color.primary.opacity(0.06)))
    }

    // MARK: - Keys

    private var basicRows: [[CalculatorKeySpec]] {
        [
            [clearKey,
             key("mod", "Modulo", .binary(.modulo), role: .function),
             key("%", "Percent", .percent, role: .function),
             key("÷", "Divide", .binary(.divide), role: .operation)],
            [digit(7), digit(8), digit(9),
             key("×", "Multiply", .binary(.multiply), role: .operation)],
            [digit(4), digit(5), digit(6),
             key("−", "Subtract", .binary(.subtract), role: .operation)],
            [digit(1), digit(2), digit(3),
             key("+", "Add", .binary(.add), role: .operation)],
            [key("±", "Change sign", .toggleSign, role: .function),
             digit(0),
             key(".", "Decimal point", .decimal, role: .number),
             key("=", "Equals", .equals, role: .equals)]
        ]
    }

    /// Backspace while typing (long-press clears all); AC once there's nothing to delete.
    private var clearKey: CalculatorKeySpec {
        if engine.canBackspace {
            return CalculatorKeySpec(
                id: "clear", title: "⌫", systemImage: "delete.left",
                accessibilityLabel: "Delete", role: .function,
                action: { press(.backspace) },
                longPressAction: { press(.clear) }
            )
        }
        return CalculatorKeySpec(id: "clear", title: "AC", accessibilityLabel: "All clear",
                                 role: .function) {
            press(.clear)
        }
    }

    private var scientificRows: [[CalculatorKeySpec]] {
        let second = isSecondActive
        let isDegrees = engine.angleMode == .degrees
        return [
            [CalculatorKeySpec(id: "2nd", title: "2nd", accessibilityLabel: "Second functions",
                               role: .scientific, isHighlighted: second) {
                 isSecondActive.toggle()
                 feedbackTrigger += 1
             },
             CalculatorKeySpec(id: "angle", title: isDegrees ? "Deg" : "Rad",
                               accessibilityLabel: isDegrees ? "Degrees, switch to radians" : "Radians, switch to degrees",
                               role: .scientific) {
                 engine.angleMode = isDegrees ? .radians : .degrees
                 feedbackTrigger += 1
             },
             key("(", "Open parenthesis", .openParen),
             key(")", "Close parenthesis", .closeParen),
             key("x!", "Factorial", .factorial),
             key("π", "Pi", .constant(.pi))],
            [second ? key("sin⁻¹", "Inverse sine", .function(.asin)) : key("sin", "Sine", .function(.sin)),
             second ? key("cos⁻¹", "Inverse cosine", .function(.acos)) : key("cos", "Cosine", .function(.cos)),
             second ? key("tan⁻¹", "Inverse tangent", .function(.atan)) : key("tan", "Tangent", .function(.tan)),
             second ? key("eˣ", "e to the power of x", .exponential) : key("ln", "Natural logarithm", .function(.ln)),
             second ? key("10ˣ", "10 to the power of x", .powerOfTen) : key("log", "Logarithm base 10", .function(.log)),
             key("e", "Euler's number", .constant(.e))],
            [second ? key("x³", "Cube", .cube) : key("x²", "Square", .square),
             key("xʸ", "Power", .binary(.power)),
             second ? key("∛x", "Cube root", .function(.cbrt)) : key("√x", "Square root", .function(.sqrt)),
             key("1/x", "Reciprocal", .reciprocal),
             key("|x|", "Absolute value", .function(.abs)),
             key("Rand", "Random number", .random)],
            [key("MC", "Memory clear", .memoryClear),
             key("MR", "Memory recall", .memoryRecall),
             key("M+", "Memory add", .memoryAdd),
             key("M−", "Memory subtract", .memorySubtract)]
        ]
    }

    private func digit(_ value: Int) -> CalculatorKeySpec {
        key("\(value)", "\(value)", .digit(value), role: .number)
    }

    private func key(_ title: String, _ label: String, _ calculatorKey: CalculatorKey,
                     role: CalculatorKeyRole = .scientific) -> CalculatorKeySpec {
        CalculatorKeySpec(id: title, title: title, accessibilityLabel: label, role: role) {
            press(calculatorKey)
        }
    }

    private func keyGrid(_ rows: [[CalculatorKeySpec]], spacing: CGFloat, font: Font,
                         cornerRadius: CGFloat) -> some View {
        VStack(spacing: spacing) {
            ForEach(rows.indices, id: \.self) { rowIndex in
                HStack(spacing: spacing) {
                    ForEach(rows[rowIndex]) { spec in
                        CalculatorKeyButton(spec: spec, font: font, cornerRadius: cornerRadius)
                    }
                }
            }
        }
    }

    private func press(_ key: CalculatorKey) {
        withAnimation(.snappy(duration: 0.2)) {
            engine.press(key)
        }
        feedbackTrigger += 1
    }
}

#Preview {
    CalculatorView()
        .environment(CalculatorEngine())
}
