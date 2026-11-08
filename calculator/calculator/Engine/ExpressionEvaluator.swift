//
//  ExpressionEvaluator.swift
//  calculator
//

import Foundation

enum AngleMode: String, CaseIterable, Identifiable {
    case degrees
    case radians

    var id: String { rawValue }

    var title: String {
        switch self {
        case .degrees: "Deg"
        case .radians: "Rad"
        }
    }
}

enum CalculationError: Error, Equatable {
    case syntax
    case divisionByZero
    case domain
    case overflow

    var message: String {
        switch self {
        case .syntax: "Invalid expression"
        case .divisionByZero: "Can't divide by zero"
        case .domain: "Undefined"
        case .overflow: "Number too large"
        }
    }
}

/// Evaluates a token list with standard precedence:
/// parentheses → postfix (!, %) → power (right-assoc) → unary minus → × ÷ mod → + −
struct ExpressionEvaluator {
    var angleMode: AngleMode = .degrees

    func evaluate(_ tokens: [ExpressionToken]) throws -> Double {
        guard !tokens.isEmpty else { throw CalculationError.syntax }

        var parser = Parser(tokens: Self.balanced(tokens), angleMode: angleMode)
        let result = try parser.parseExpression().value

        guard parser.isAtEnd else { throw CalculationError.syntax }
        guard !result.isNaN else { throw CalculationError.domain }
        guard result.isFinite else { throw CalculationError.overflow }
        return Self.cleaned(result)
    }

    /// Appends any missing closing parentheses so "sin(30" evaluates like "sin(30)".
    static func balanced(_ tokens: [ExpressionToken]) -> [ExpressionToken] {
        let depth = tokens.reduce(0) { depth, token in
            if token.opensGroup { return depth + 1 }
            if token == .closeParen { return depth - 1 }
            return depth
        }
        return tokens + Array(repeating: .closeParen, count: max(depth, 0))
    }

    /// Rounds to 12 significant digits to hide binary floating-point noise (0.1 + 0.2).
    static func cleaned(_ value: Double) -> Double {
        let rounded = Double(String(format: "%.12g", value)) ?? value
        return rounded == 0 ? 0 : rounded
    }
}

// MARK: - Recursive-descent parser

private struct Operand {
    var value: Double
    /// Set when the operand ended in "%", so "a + b%" can mean "a plus b% of a".
    var isPercent = false
}

private struct Parser {
    let tokens: [ExpressionToken]
    let angleMode: AngleMode
    var index = 0

    var isAtEnd: Bool { index >= tokens.count }

    private var current: ExpressionToken? {
        isAtEnd ? nil : tokens[index]
    }

    // expression := term (("+" | "−") term)*
    mutating func parseExpression() throws -> Operand {
        var lhs = try parseTerm()
        while case .binary(let op)? = current, op == .add || op == .subtract {
            index += 1
            let rhs = try parseTerm()
            // "200 + 10%" adds 10% of 200, like a desk calculator.
            let amount = rhs.isPercent ? lhs.value * rhs.value : rhs.value
            lhs = Operand(value: op == .add ? lhs.value + amount : lhs.value - amount)
        }
        return lhs
    }

    // term := unary (("×" | "÷" | "mod") unary)*
    mutating func parseTerm() throws -> Operand {
        var lhs = try parseUnary()
        while case .binary(let op)? = current, op == .multiply || op == .divide || op == .modulo {
            index += 1
            let rhs = try parseUnary().value
            switch op {
            case .multiply:
                lhs = Operand(value: lhs.value * rhs)
            case .divide:
                guard rhs != 0 else { throw CalculationError.divisionByZero }
                lhs = Operand(value: lhs.value / rhs)
            default:
                guard rhs != 0 else { throw CalculationError.divisionByZero }
                lhs = Operand(value: lhs.value.truncatingRemainder(dividingBy: rhs))
            }
        }
        return lhs
    }

    // unary := ("−" | "+") unary | power
    mutating func parseUnary() throws -> Operand {
        if case .binary(.subtract)? = current {
            index += 1
            let operand = try parseUnary()
            return Operand(value: -operand.value, isPercent: operand.isPercent)
        }
        if case .binary(.add)? = current {
            index += 1
            return try parseUnary()
        }
        return try parsePower()
    }

    // power := postfix ("^" unary)?   — right-associative, and -2^2 = -4
    mutating func parsePower() throws -> Operand {
        let base = try parsePostfix()
        guard case .binary(.power)? = current else { return base }
        index += 1
        let exponent = try parseUnary()
        return Operand(value: pow(base.value, exponent.value))
    }

    // postfix := primary ("!" | "%")*
    mutating func parsePostfix() throws -> Operand {
        var operand = try parsePrimary()
        while case .postfix(let op)? = current {
            index += 1
            switch op {
            case .percent:
                operand = Operand(value: operand.value / 100, isPercent: true)
            case .factorial:
                operand = Operand(value: try factorial(operand.value))
            }
        }
        return operand
    }

    // primary := number | constant | "(" expression ")" | function expression ")"
    mutating func parsePrimary() throws -> Operand {
        guard let token = current else { throw CalculationError.syntax }
        index += 1

        switch token {
        case .number(let text):
            // "5." is a valid in-progress entry; treat it as "5.0".
            guard let value = Double(text) ?? Double(text + "0") else {
                throw CalculationError.syntax
            }
            return Operand(value: value)
        case .constant(let constant):
            return Operand(value: constant.value)
        case .openParen:
            return Operand(value: try parseGroup())
        case .function(let function):
            let argument = try parseGroup()
            return Operand(value: try apply(function, to: argument))
        default:
            throw CalculationError.syntax
        }
    }

    /// Parses the inside of a group and consumes its closing parenthesis.
    mutating func parseGroup() throws -> Double {
        let value = try parseExpression().value
        guard case .closeParen? = current else { throw CalculationError.syntax }
        index += 1
        return value
    }

    // MARK: - Math helpers

    func apply(_ function: MathFunction, to x: Double) throws -> Double {
        switch function {
        case .sin:
            return snapped(Foundation.sin(toRadians(x)))
        case .cos:
            return snapped(Foundation.cos(toRadians(x)))
        case .tan:
            let angle = toRadians(x)
            // tan(90°) and friends are undefined.
            guard Swift.abs(Foundation.cos(angle)) > 1e-12 else { throw CalculationError.domain }
            return snapped(Foundation.tan(angle))
        case .asin:
            guard (-1...1).contains(x) else { throw CalculationError.domain }
            return fromRadians(Foundation.asin(x))
        case .acos:
            guard (-1...1).contains(x) else { throw CalculationError.domain }
            return fromRadians(Foundation.acos(x))
        case .atan:
            return fromRadians(Foundation.atan(x))
        case .ln:
            guard x > 0 else { throw CalculationError.domain }
            return Foundation.log(x)
        case .log:
            guard x > 0 else { throw CalculationError.domain }
            return Foundation.log10(x)
        case .sqrt:
            guard x >= 0 else { throw CalculationError.domain }
            return x.squareRoot()
        case .cbrt:
            return Foundation.cbrt(x)
        case .abs:
            return Swift.abs(x)
        }
    }

    /// Integer factorial, or Γ(x + 1) for non-integers.
    func factorial(_ x: Double) throws -> Double {
        if x < 0 && x == x.rounded() { throw CalculationError.domain }
        guard x <= 170 else { throw CalculationError.overflow }

        if x == x.rounded() {
            var result = 1.0
            if x >= 2 {
                for i in 2...Int(x) {
                    result *= Double(i)
                }
            }
            return result
        }

        let gamma = tgamma(x + 1)
        guard gamma.isFinite else { throw CalculationError.overflow }
        return gamma
    }

    func toRadians(_ x: Double) -> Double {
        angleMode == .degrees ? x * .pi / 180 : x
    }

    func fromRadians(_ x: Double) -> Double {
        angleMode == .degrees ? x * 180 / .pi : x
    }

    /// Turns values like sin(180°) = 1.2e-16 into a clean 0.
    func snapped(_ value: Double) -> Double {
        Swift.abs(value) < 1e-12 ? 0 : value
    }
}
