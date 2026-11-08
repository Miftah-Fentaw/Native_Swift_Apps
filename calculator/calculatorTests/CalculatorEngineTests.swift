//
//  CalculatorEngineTests.swift
//  calculatorTests
//

import Foundation
import Testing
@testable import calculator

@MainActor
struct ExpressionEvaluatorTests {
    private let evaluator = ExpressionEvaluator(angleMode: .degrees)

    @Test func respectsPrecedence() throws {
        // 2 + 3 × 4 = 14
        let tokens: [ExpressionToken] = [.number("2"), .binary(.add), .number("3"), .binary(.multiply), .number("4")]
        #expect(try evaluator.evaluate(tokens) == 14)
    }

    @Test func powerIsRightAssociativeAndBindsTighterThanMinus() throws {
        // 2 ^ 3 ^ 2 = 512
        let power: [ExpressionToken] = [.number("2"), .binary(.power), .number("3"), .binary(.power), .number("2")]
        #expect(try evaluator.evaluate(power) == 512)

        // −2 ^ 2 = −4
        let negated: [ExpressionToken] = [.binary(.subtract), .number("2"), .binary(.power), .number("2")]
        #expect(try evaluator.evaluate(negated) == -4)
    }

    @Test func percentOfPreviousOperand() throws {
        // 200 + 10% = 220
        let tokens: [ExpressionToken] = [.number("200"), .binary(.add), .number("10"), .postfix(.percent)]
        #expect(try evaluator.evaluate(tokens) == 220)
    }

    @Test func modulo() throws {
        let tokens: [ExpressionToken] = [.number("17"), .binary(.modulo), .number("5")]
        #expect(try evaluator.evaluate(tokens) == 2)
    }

    @Test func autoClosesParentheses() throws {
        // sin(30 → 0.5
        let tokens: [ExpressionToken] = [.function(.sin), .number("30")]
        #expect(try evaluator.evaluate(tokens) == 0.5)
    }

    @Test func factorial() throws {
        let tokens: [ExpressionToken] = [.number("5"), .postfix(.factorial)]
        #expect(try evaluator.evaluate(tokens) == 120)
    }

    @Test func hidesFloatingPointNoise() throws {
        let tokens: [ExpressionToken] = [.number("0.1"), .binary(.add), .number("0.2")]
        #expect(try evaluator.evaluate(tokens) == 0.3)
    }

    @Test func reportsErrors() {
        #expect(throws: CalculationError.divisionByZero) {
            try evaluator.evaluate([.number("1"), .binary(.divide), .number("0")])
        }
        #expect(throws: CalculationError.domain) {
            try evaluator.evaluate([.function(.sqrt), .number("-4")])
        }
        #expect(throws: CalculationError.domain) {
            try evaluator.evaluate([.function(.tan), .number("90")])
        }
    }
}

@MainActor
struct CalculatorEngineTests {
    private func makeEngine() -> CalculatorEngine {
        let suite = "CalculatorEngineTests-\(UUID().uuidString)"
        return CalculatorEngine(defaults: UserDefaults(suiteName: suite) ?? .standard)
    }

    @Test func typesAndEvaluates() {
        let engine = makeEngine()
        [CalculatorKey.digit(1), .digit(2), .binary(.add), .digit(8), .equals].forEach(engine.press)

        #expect(engine.expressionText(grouping: false) == "20")
        #expect(engine.justEvaluated)
        #expect(engine.history.first?.result == "20")
    }

    @Test func replacesTrailingOperator() {
        let engine = makeEngine()
        [CalculatorKey.digit(5), .binary(.add), .binary(.multiply)].forEach(engine.press)
        #expect(engine.expressionText(grouping: false) == "5 × ")
    }

    @Test func implicitMultiplicationBeforeConstant() {
        let engine = makeEngine()
        [CalculatorKey.digit(2), .constant(.pi)].forEach(engine.press)
        #expect(engine.tokens == [.number("2"), .binary(.multiply), .constant(.pi)])
    }

    @Test func digitAfterResultStartsFresh() {
        let engine = makeEngine()
        [CalculatorKey.digit(2), .binary(.add), .digit(2), .equals, .digit(7)].forEach(engine.press)
        #expect(engine.expressionText(grouping: false) == "7")
    }

    @Test func operatorAfterResultContinues() {
        let engine = makeEngine()
        [CalculatorKey.digit(2), .binary(.add), .digit(2), .equals, .binary(.multiply), .digit(3), .equals]
            .forEach(engine.press)
        #expect(engine.expressionText(grouping: false) == "12")
    }

    @Test func backspaceAndGrouping() {
        let engine = makeEngine()
        [CalculatorKey.digit(1), .digit(2), .digit(3), .digit(4), .digit(5)].forEach(engine.press)
        #expect(engine.expressionText(grouping: true) == "12,345")

        engine.press(.backspace)
        #expect(engine.expressionText(grouping: false) == "1234")
    }

    @Test func showsErrorMessage() {
        let engine = makeEngine()
        [CalculatorKey.digit(1), .binary(.divide), .digit(0), .equals].forEach(engine.press)
        #expect(engine.errorMessage == CalculationError.divisionByZero.message)
    }

    @Test func memory() {
        let engine = makeEngine()
        [CalculatorKey.digit(4), .memoryAdd, .memoryAdd, .clear, .memoryRecall].forEach(engine.press)
        #expect(engine.memory == 8)
        #expect(engine.expressionText(grouping: false) == "8")
    }
}

@MainActor
struct NumberEntryTests {
    @Test func signAndDecimals() {
        var entry = NumberEntry(maxIntegerDigits: 5, maxFractionDigits: 2)
        entry.toggleSign()
        entry.appendDigit(3)
        entry.appendDecimalPoint()
        [1, 2, 9].forEach { entry.appendDigit($0) }
        #expect(entry.text == "-3.12")
        #expect(entry.value == -3.12)
    }
}
