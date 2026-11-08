//
//  CalculatorEngine.swift
//  calculator
//

import Foundation
import Observation

/// Owns the expression being typed, the result, memory, and history for the calculator screen.
@Observable
final class CalculatorEngine {
    private(set) var tokens: [ExpressionToken] = []
    /// True right after "=", when the display shows a result instead of an expression.
    private(set) var justEvaluated = false
    /// The expression that produced the current result, shown above it.
    private(set) var lastExpression: String?
    private(set) var errorMessage: String?
    private(set) var memory: Double?
    private(set) var history: [HistoryEntry] = []

    var angleMode: AngleMode {
        didSet { defaults.set(angleMode.rawValue, forKey: SettingsKey.angleMode) }
    }

    static let maxDigits = 15
    static let historyLimit = 100

    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        self.angleMode = AngleMode(rawValue: defaults.string(forKey: SettingsKey.angleMode) ?? "") ?? .degrees
        self.history = Self.loadHistory(from: defaults)
    }

    // MARK: - Settings read at evaluation time

    private var fractionDigits: Int {
        defaults.object(forKey: SettingsKey.precision) as? Int ?? 10
    }

    private var usesGrouping: Bool {
        defaults.object(forKey: SettingsKey.grouping) as? Bool ?? true
    }

    private var evaluator: ExpressionEvaluator {
        ExpressionEvaluator(angleMode: angleMode)
    }

    // MARK: - Display

    /// The AC key turns into backspace while there is something to delete.
    var canBackspace: Bool {
        !tokens.isEmpty && !justEvaluated
    }

    func expressionText(grouping: Bool) -> String {
        tokens.isEmpty ? "0" : Self.displayText(for: tokens, grouping: grouping)
    }

    /// Live result while typing, or `nil` when there's nothing useful to show.
    func previewText(grouping: Bool) -> String? {
        guard !justEvaluated, errorMessage == nil else { return nil }
        let candidate = Self.trimmedForPreview(tokens)
        // A lone number would just repeat itself.
        if candidate.count <= 1 { return nil }
        guard let value = try? evaluator.evaluate(candidate) else { return nil }
        return NumberFormatting.display(value, maxFractionDigits: fractionDigits, grouping: grouping)
    }

    /// Value of what's on screen right now, used by memory and copy.
    var currentValue: Double? {
        let candidate = Self.trimmedForPreview(tokens)
        guard !candidate.isEmpty else { return nil }
        return try? evaluator.evaluate(candidate)
    }

    func copyableText() -> String? {
        guard let value = currentValue else { return nil }
        return NumberFormatting.raw(value, maxFractionDigits: fractionDigits)
    }

    static func displayText(for tokens: [ExpressionToken], grouping: Bool) -> String {
        var text = ""
        var previous: ExpressionToken?
        for token in tokens {
            switch token {
            case .number(let raw):
                text += NumberFormatting.display(raw, grouping: grouping)
            case .binary(.subtract) where isUnaryPosition(after: previous):
                text += "−"
            case .binary(.power):
                text += "^"
            case .binary(let op):
                text += " \(op.symbol) "
            case .postfix(let op):
                text += op.symbol
            case .constant(let constant):
                text += constant.symbol
            case .function(let function):
                text += function.symbol + "("
            case .openParen:
                text += "("
            case .closeParen:
                text += ")"
            }
            previous = token
        }
        return text
    }

    private static func isUnaryPosition(after token: ExpressionToken?) -> Bool {
        guard let token else { return true }
        switch token {
        case .binary, .openParen, .function: return true
        default: return false
        }
    }

    /// Drops trailing operators and open groups so "5 + 3 ×" previews as 8.
    private static func trimmedForPreview(_ tokens: [ExpressionToken]) -> [ExpressionToken] {
        var trimmed = tokens
        while let last = trimmed.last {
            switch last {
            case .binary, .openParen, .function:
                trimmed.removeLast()
            default:
                return trimmed
            }
        }
        return trimmed
    }

    // MARK: - Input

    func press(_ key: CalculatorKey) {
        if key != .clear {
            errorMessage = nil
        }

        switch key {
        case .digit(let digit): appendDigit(digit)
        case .decimal: appendDecimal()
        case .binary(let op): appendBinary(op)
        case .percent: appendPostfix(.percent)
        case .factorial: appendPostfix(.factorial)
        case .toggleSign: toggleSign()
        case .clear: clearAll()
        case .backspace: backspace()
        case .equals: evaluate()
        case .openParen:
            beginOperand()
            tokens.append(.openParen)
        case .closeParen:
            if openGroupCount > 0, tokens.last?.endsOperand == true {
                tokens.append(.closeParen)
            }
        case .function(let function): applyFunction(function)
        case .constant(let constant):
            beginOperand()
            tokens.append(.constant(constant))
        case .square: appendPower("2")
        case .cube: appendPower("3")
        case .reciprocal: appendPower("-1")
        case .exponential:
            beginOperand()
            tokens += [.constant(.e), .binary(.power), .openParen]
        case .powerOfTen:
            beginOperand()
            tokens += [.number("10"), .binary(.power), .openParen]
        case .random:
            insertNumber(raw: NumberFormatting.raw(Double.random(in: 0..<1), maxFractionDigits: 6))
        case .memoryClear:
            memory = nil
        case .memoryRecall:
            if let memory {
                insertNumber(raw: NumberFormatting.raw(memory, maxFractionDigits: fractionDigits))
            }
        case .memoryAdd:
            if let value = currentValue {
                memory = (memory ?? 0) + value
            }
        case .memorySubtract:
            if let value = currentValue {
                memory = (memory ?? 0) - value
            }
        }
    }

    /// Inserts a number (from history, memory, or the clipboard) as the current operand.
    func insertNumber(raw: String) {
        errorMessage = nil
        if justEvaluated || tokens.isEmpty {
            tokens = [.number(raw)]
            justEvaluated = false
            lastExpression = nil
        } else if case .number = tokens.last {
            tokens[tokens.count - 1] = .number(raw)
        } else {
            beginOperand()
            tokens.append(.number(raw))
        }
    }

    /// Pastes clipboard text if it is a plain number (thousands separators allowed).
    func paste(_ text: String) {
        let cleaned = text
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: ",", with: "")
            .replacingOccurrences(of: "−", with: "-")
        guard let value = Double(cleaned), value.isFinite else { return }
        insertNumber(raw: NumberFormatting.raw(value, maxFractionDigits: fractionDigits))
    }

    private var openGroupCount: Int {
        tokens.reduce(0) { count, token in
            if token.opensGroup { return count + 1 }
            if token == .closeParen { return count - 1 }
            return count
        }
    }

    /// Prepares for a new operand: starts fresh after a result,
    /// or inserts "×" after a finished operand (e.g. "2" then "π" → "2 × π").
    private func beginOperand() {
        if justEvaluated {
            tokens.removeAll()
            justEvaluated = false
            lastExpression = nil
        } else if tokens.last?.endsOperand == true {
            tokens.append(.binary(.multiply))
        }
    }

    private func appendDigit(_ digit: Int) {
        if justEvaluated {
            beginOperand()
        }

        if case .number(var text)? = tokens.last {
            // Results in scientific notation can't be extended by typing.
            guard !text.contains("E") else { return }
            guard text.filter(\.isNumber).count < Self.maxDigits else { return }

            if text == "0" {
                text = "\(digit)"
            } else if text == "-0" {
                text = "-\(digit)"
            } else {
                text += "\(digit)"
            }
            tokens[tokens.count - 1] = .number(text)
        } else {
            beginOperand()
            tokens.append(.number("\(digit)"))
        }
    }

    private func appendDecimal() {
        if justEvaluated {
            beginOperand()
        }

        if case .number(let text)? = tokens.last {
            guard !text.contains("."), !text.contains("E") else { return }
            tokens[tokens.count - 1] = .number(text + ".")
        } else {
            beginOperand()
            tokens.append(.number("0."))
        }
    }

    private func appendBinary(_ op: BinaryOperator) {
        // Operators continue from a previous result.
        justEvaluated = false
        lastExpression = nil

        guard let last = tokens.last else {
            tokens = op == .subtract ? [.binary(.subtract)] : [.number("0"), .binary(op)]
            return
        }

        switch last {
        case .binary(let previous):
            // Allow a negative right-hand side: "5 × −3".
            if op == .subtract && previous != .add && previous != .subtract {
                tokens.append(.binary(.subtract))
                return
            }
            // Otherwise replace the trailing operator(s) with the new one.
            tokens.removeLast()
            if case .binary? = tokens.last {
                tokens.removeLast()
            }
            if tokens.isEmpty || tokens.last?.opensGroup == true {
                if op == .subtract { tokens.append(.binary(.subtract)) }
                return
            }
            tokens.append(.binary(op))
        case .openParen, .function:
            if op == .subtract {
                tokens.append(.binary(.subtract))
            }
        default:
            tokens.append(.binary(op))
        }
    }

    private func appendPostfix(_ op: PostfixOperator) {
        justEvaluated = false
        lastExpression = nil
        guard tokens.last?.endsOperand == true else { return }
        tokens.append(.postfix(op))
    }

    private func appendPower(_ exponent: String) {
        justEvaluated = false
        lastExpression = nil
        guard tokens.last?.endsOperand == true else { return }
        tokens += [.binary(.power), .number(exponent)]
    }

    private func toggleSign() {
        justEvaluated = false
        lastExpression = nil

        if case .number(let text)? = tokens.last {
            let toggled = text.hasPrefix("-") ? String(text.dropFirst()) : "-" + text
            tokens[tokens.count - 1] = .number(toggled)
        } else if tokens.last == nil || tokens.last?.endsOperand == false {
            // Start a negative number that the next digit will fill in.
            tokens.append(.number("-0"))
        }
    }

    private func applyFunction(_ function: MathFunction) {
        // A function pressed right after "=" wraps the result: sin(result).
        if justEvaluated, case .number(let text)? = tokens.last {
            tokens = [.function(function), .number(text), .closeParen]
            justEvaluated = false
            lastExpression = nil
            return
        }
        beginOperand()
        tokens.append(.function(function))
    }

    private func backspace() {
        if justEvaluated {
            justEvaluated = false
            lastExpression = nil
        }
        guard let last = tokens.last else { return }

        if case .number(var text) = last, !text.contains("E") {
            text.removeLast()
            if text.isEmpty || text == "-" {
                tokens.removeLast()
            } else {
                tokens[tokens.count - 1] = .number(text)
            }
        } else {
            tokens.removeLast()
        }
    }

    private func clearAll() {
        tokens.removeAll()
        justEvaluated = false
        lastExpression = nil
        errorMessage = nil
    }

    private func evaluate() {
        guard !tokens.isEmpty, !justEvaluated else { return }

        do {
            let value = try evaluator.evaluate(tokens)
            let expression = Self.displayText(for: ExpressionEvaluator.balanced(tokens), grouping: usesGrouping)
            let result = NumberFormatting.raw(value, maxFractionDigits: fractionDigits)

            // "5 =" isn't worth keeping in history.
            let isTrivial = tokens.count == 1
            if !isTrivial {
                addHistory(HistoryEntry(expression: expression, result: result))
            }

            lastExpression = isTrivial ? nil : expression
            tokens = [.number(result)]
            justEvaluated = true
        } catch let error as CalculationError {
            errorMessage = error.message
        } catch {
            errorMessage = CalculationError.syntax.message
        }
    }

    // MARK: - History

    private func addHistory(_ entry: HistoryEntry) {
        history.insert(entry, at: 0)
        if history.count > Self.historyLimit {
            history.removeLast(history.count - Self.historyLimit)
        }
        saveHistory()
    }

    func deleteHistory(at offsets: IndexSet) {
        for index in offsets.sorted(by: >) {
            history.remove(at: index)
        }
        saveHistory()
    }

    func clearHistory() {
        history.removeAll()
        saveHistory()
    }

    private func saveHistory() {
        if let data = try? JSONEncoder().encode(history) {
            defaults.set(data, forKey: SettingsKey.history)
        }
    }

    private static func loadHistory(from defaults: UserDefaults) -> [HistoryEntry] {
        guard let data = defaults.data(forKey: SettingsKey.history),
              let entries = try? JSONDecoder().decode([HistoryEntry].self, from: data) else {
            return []
        }
        return entries
    }
}
