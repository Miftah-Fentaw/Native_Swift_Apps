//
//  KeypadView.swift
//  calculator
//

import SwiftUI

/// A key on the numeric keypad.
enum KeypadKey: Hashable {
    case digit(Int)
    case decimal
    case delete

    var accessibilityLabel: String {
        switch self {
        case .digit(let value): "\(value)"
        case .decimal: "Decimal point"
        case .delete: "Delete"
        }
    }
}

/// Full-width numeric keypad with hairline separators.
struct KeypadView: View {
    var onKey: (KeypadKey) -> Void
    var onClear: () -> Void

    private let rows: [[KeypadKey]] = [
        [.digit(1), .digit(2), .digit(3)],
        [.digit(4), .digit(5), .digit(6)],
        [.digit(7), .digit(8), .digit(9)],
        [.decimal, .digit(0), .delete]
    ]

    var body: some View {
        VStack(spacing: 0) {
            ForEach(rows.indices, id: \.self) { rowIndex in
                Divider()
                HStack(spacing: 0) {
                    ForEach(rows[rowIndex], id: \.self) { key in
                        if key != rows[rowIndex].first {
                            Divider()
                        }
                        keyButton(key)
                    }
                }
            }
        }
        .background(Color.primary.opacity(0.03).ignoresSafeArea(edges: .bottom))
    }

    @ViewBuilder
    private func keyButton(_ key: KeypadKey) -> some View {
        Button {
            onKey(key)
        } label: {
            label(for: key)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .contentShape(Rectangle())
        }
        .buttonStyle(KeypadButtonStyle())
        .accessibilityLabel(key.accessibilityLabel)
        // Long-pressing delete clears the whole bill.
        .simultaneousGesture(
            LongPressGesture(minimumDuration: 0.5).onEnded { _ in
                if key == .delete { onClear() }
            }
        )
        .accessibilityAction(named: "Clear") {
            if key == .delete { onClear() }
        }
    }

    @ViewBuilder
    private func label(for key: KeypadKey) -> some View {
        switch key {
        case .digit(let value):
            Text("\(value)")
                .font(.title2)
        case .decimal:
            Text(".")
                .font(.title2.weight(.semibold))
        case .delete:
            Image(systemName: "delete.left")
                .font(.title3)
                .foregroundStyle(.secondary)
        }
    }
}

/// Subtle press highlight for keypad keys.
private struct KeypadButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.primary)
            .background(Color.primary.opacity(configuration.isPressed ? 0.08 : 0))
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

#Preview {
    KeypadView(onKey: { _ in }, onClear: {})
        .frame(height: 300)
}
