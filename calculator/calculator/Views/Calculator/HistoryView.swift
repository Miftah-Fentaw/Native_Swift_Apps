//
//  HistoryView.swift
//  calculator
//

import SwiftUI

/// Past calculations. Tapping one inserts its result into the calculator.
struct HistoryView: View {
    @Environment(CalculatorEngine.self) private var engine
    @Environment(\.dismiss) private var dismiss
    @AppStorage(SettingsKey.grouping) private var grouping = true

    @State private var isConfirmingClear = false

    var body: some View {
        NavigationStack {
            Group {
                if engine.history.isEmpty {
                    ContentUnavailableView(
                        "No History",
                        systemImage: "clock",
                        description: Text("Calculations you finish with = appear here.")
                    )
                } else {
                    list
                }
            }
            .navigationTitle("History")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Clear", role: .destructive) {
                        isConfirmingClear = true
                    }
                    .disabled(engine.history.isEmpty)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .confirmationDialog("Clear all history?", isPresented: $isConfirmingClear,
                                titleVisibility: .visible) {
                Button("Clear History", role: .destructive) {
                    withAnimation { engine.clearHistory() }
                }
            }
        }
        .tint(.appAccent)
    }

    private var list: some View {
        List {
            ForEach(engine.history) { entry in
                Button {
                    engine.insertNumber(raw: entry.result)
                    dismiss()
                } label: {
                    row(for: entry)
                }
                .buttonStyle(.plain)
                .contextMenu {
                    Button("Copy Result", systemImage: "doc.on.doc") {
                        UIPasteboard.general.string = entry.result
                    }
                    Button("Copy Expression", systemImage: "text.quote") {
                        UIPasteboard.general.string = entry.expression
                    }
                }
            }
            .onDelete { offsets in
                engine.deleteHistory(at: offsets)
            }
        }
        .listStyle(.plain)
    }

    private func row(for entry: HistoryEntry) -> some View {
        VStack(alignment: .trailing, spacing: 4) {
            Text(entry.expression)
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.trailing)
            Text("= " + NumberFormatting.display(entry.result, grouping: grouping))
                .font(.title2.weight(.medium))
            Text(entry.date, format: .relative(presentation: .named))
                .font(.caption2)
                .foregroundStyle(.tertiary)
        }
        .frame(maxWidth: .infinity, alignment: .trailing)
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        .accessibilityHint("Inserts the result into the calculator")
    }
}

#Preview {
    HistoryView()
        .environment(CalculatorEngine())
}
