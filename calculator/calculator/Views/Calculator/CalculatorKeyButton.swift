//
//  CalculatorKeyButton.swift
//  calculator
//

import SwiftUI

/// Visual role of a calculator key, which decides its colors.
enum CalculatorKeyRole {
    case number
    case function
    case operation
    case equals
    case scientific
}

/// Everything needed to draw and handle one key.
struct CalculatorKeySpec: Identifiable {
    let id: String
    let title: String
    var systemImage: String?
    let accessibilityLabel: String
    let role: CalculatorKeyRole
    var isHighlighted = false
    let action: () -> Void
    var longPressAction: (() -> Void)?
}

struct CalculatorKeyButton: View {
    let spec: CalculatorKeySpec
    let font: Font
    let cornerRadius: CGFloat

    var body: some View {
        Button(action: spec.action) {
            label
                .font(font)
                .lineLimit(1)
                .minimumScaleFactor(0.6)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .foregroundStyle(foreground)
                .background(
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(background)
                )
                .contentShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
        }
        .buttonStyle(PressableKeyStyle())
        .simultaneousGesture(
            LongPressGesture(minimumDuration: 0.5).onEnded { _ in
                spec.longPressAction?()
            }
        )
        .accessibilityLabel(spec.accessibilityLabel)
        .accessibilityAddTraits(spec.isHighlighted ? .isSelected : [])
    }

    @ViewBuilder
    private var label: some View {
        if let systemImage = spec.systemImage {
            Image(systemName: systemImage)
        } else {
            Text(spec.title)
        }
    }

    private var foreground: Color {
        if spec.isHighlighted { return .appAccent }
        switch spec.role {
        case .number, .function, .scientific: return .primary
        case .operation: return .appAccent
        case .equals: return Color(.systemBackground)
        }
    }

    private var background: Color {
        if spec.isHighlighted { return Color.appAccent.opacity(0.2) }
        switch spec.role {
        case .number: return Color.primary.opacity(0.06)
        case .function: return Color.primary.opacity(0.12)
        case .scientific: return Color.primary.opacity(0.05)
        case .operation: return Color.appAccent.opacity(0.15)
        case .equals: return .appAccent
        }
    }
}

/// Slight shrink and fade while a key is held down.
private struct PressableKeyStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1)
            .opacity(configuration.isPressed ? 0.7 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}
