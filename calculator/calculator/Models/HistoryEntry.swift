//
//  HistoryEntry.swift
//  calculator
//

import Foundation

/// A finished calculation shown in the history list.
struct HistoryEntry: Identifiable, Codable, Hashable {
    let id: UUID
    /// The expression as it was displayed, e.g. "12 × (3 + 4)".
    let expression: String
    /// The raw result text, e.g. "84" — can be re-inserted into a new expression.
    let result: String
    let date: Date

    init(id: UUID = UUID(), expression: String, result: String, date: Date = .now) {
        self.id = id
        self.expression = expression
        self.result = result
        self.date = date
    }
}
