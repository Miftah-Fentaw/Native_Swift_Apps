//
//  NumberEntry.swift
//  calculator
//

import Foundation

/// Text typed on a simple numeric keypad, with digit limits. Shared by the tip and converter screens.
struct NumberEntry: Equatable {
    private(set) var text = ""
    let maxIntegerDigits: Int
    let maxFractionDigits: Int

    init(maxIntegerDigits: Int = 7, maxFractionDigits: Int = 2) {
        self.maxIntegerDigits = maxIntegerDigits
        self.maxFractionDigits = maxFractionDigits
    }

    var isEmpty: Bool { text.isEmpty }

    var value: Double {
        Double(text) ?? Double(text + "0") ?? 0
    }

    mutating func appendDigit(_ digit: Int) {
        guard (0...9).contains(digit) else { return }

        let isNegative = text.hasPrefix("-")
        let body = isNegative ? String(text.dropFirst()) : text
        let parts = body.split(separator: ".", omittingEmptySubsequences: false)

        if parts.count == 2 {
            guard parts[1].count < maxFractionDigits else { return }
            text.append(String(digit))
            return
        }

        // Replace a lone leading zero instead of producing "05".
        if body == "0" {
            text = (isNegative ? "-" : "") + String(digit)
            return
        }

        guard body.count < maxIntegerDigits else { return }
        text.append(String(digit))
    }

    mutating func appendDecimalPoint() {
        guard maxFractionDigits > 0, !text.contains(".") else { return }
        text += (text.isEmpty || text == "-") ? "0." : "."
    }

    mutating func deleteLast() {
        guard !text.isEmpty else { return }
        text.removeLast()
        if text == "-" {
            text = ""
        }
    }

    mutating func toggleSign() {
        if text.hasPrefix("-") {
            text.removeFirst()
        } else {
            text = "-" + (text.isEmpty ? "0" : text)
        }
    }

    mutating func clear() {
        text = ""
    }
}
