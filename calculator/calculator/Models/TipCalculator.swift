//
//  TipCalculator.swift
//  calculator
//

import Foundation
import Observation

/// Holds the bill input and computes the tip, total, and per-person split.
@Observable
final class TipCalculator {
    private var entry = NumberEntry(maxIntegerDigits: 7, maxFractionDigits: 2)
    var tipPercent: Int
    private(set) var splitCount: Int = 1

    static let splitRange = 1...50

    init(tipPercent: Int = 10) {
        self.tipPercent = tipPercent
    }

    /// Raw text typed on the keypad (e.g. "120.5"). Empty means no input yet.
    var billInput: String { entry.text }

    // MARK: - Computed values

    var billAmount: Double { entry.value }

    var tipAmount: Double {
        billAmount * Double(tipPercent) / 100
    }

    var totalAmount: Double {
        billAmount + tipAmount
    }

    /// Amount each person pays. When `roundUp` is true, rounds up to the next whole unit.
    func perPersonAmount(roundUp: Bool = false) -> Double {
        let share = totalAmount / Double(splitCount)
        return roundUp ? share.rounded(.up) : share
    }

    // MARK: - Keypad input

    func appendDigit(_ digit: Int) {
        entry.appendDigit(digit)
    }

    func appendDecimalPoint() {
        entry.appendDecimalPoint()
    }

    func deleteLast() {
        entry.deleteLast()
    }

    func clear() {
        entry.clear()
    }

    // MARK: - Split

    func incrementSplit() {
        splitCount = min(splitCount + 1, Self.splitRange.upperBound)
    }

    func decrementSplit() {
        splitCount = max(splitCount - 1, Self.splitRange.lowerBound)
    }

    func reset(tipPercent: Int) {
        entry.clear()
        splitCount = 1
        self.tipPercent = tipPercent
    }
}
