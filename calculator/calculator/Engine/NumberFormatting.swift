//
//  NumberFormatting.swift
//  calculator
//

import Foundation

/// Converts numbers between the raw form stored in expressions and the form shown on screen.
enum NumberFormatting {
    /// Raw, parseable text: no grouping, "." decimal, ASCII "-", and "E" exponent for huge/tiny values.
    static func raw(_ value: Double, maxFractionDigits: Int) -> String {
        guard value != 0 else { return "0" }

        let magnitude = abs(value)
        if magnitude >= 1e15 || magnitude < 1e-9 {
            // e.g. "1.23456789E+15" → "1.23456789E15"
            return String(format: "%.9G", value).replacingOccurrences(of: "E+", with: "E")
        }

        return value.formatted(
            .number
                .precision(.fractionLength(0...max(maxFractionDigits, 0)))
                .grouping(.never)
                .locale(Locale(identifier: "en_US_POSIX"))
        )
    }

    /// Display text for a raw number, with optional thousands separators and a typographic minus.
    /// Keeps in-progress input such as "12." or "0.50" exactly as typed.
    static func display(_ raw: String, grouping: Bool) -> String {
        var body = raw
        var sign = ""
        if body.hasPrefix("-") {
            sign = "−"
            body.removeFirst()
        }

        var exponent = ""
        if let exponentIndex = body.firstIndex(of: "E") {
            exponent = String(body[exponentIndex...]).replacingOccurrences(of: "-", with: "−")
            body = String(body[..<exponentIndex])
        }

        let parts = body.split(separator: ".", maxSplits: 1, omittingEmptySubsequences: false)
        var integerPart = parts.first.map(String.init) ?? ""
        if grouping {
            integerPart = grouped(integerPart)
        }

        var result = sign + integerPart
        if parts.count == 2 {
            result += "." + parts[1]
        }
        return result + exponent
    }

    static func display(_ value: Double, maxFractionDigits: Int, grouping: Bool) -> String {
        display(raw(value, maxFractionDigits: maxFractionDigits), grouping: grouping)
    }

    /// Inserts "," every three digits from the right.
    private static func grouped(_ digits: String) -> String {
        var output: [Character] = []
        for (offset, character) in digits.reversed().enumerated() {
            if offset > 0 && offset % 3 == 0 {
                output.append(",")
            }
            output.append(character)
        }
        return String(output.reversed())
    }
}
