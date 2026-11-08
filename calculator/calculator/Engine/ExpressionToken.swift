//
//  ExpressionToken.swift
//  calculator
//

import Foundation

/// Infix operators. `subtract` doubles as unary minus when it starts an operand.
enum BinaryOperator: Hashable {
    case add
    case subtract
    case multiply
    case divide
    case modulo
    case power

    var symbol: String {
        switch self {
        case .add: "+"
        case .subtract: "−"
        case .multiply: "×"
        case .divide: "÷"
        case .modulo: "mod"
        case .power: "^"
        }
    }
}

/// Operators written after their operand.
enum PostfixOperator: Hashable {
    case percent
    case factorial

    var symbol: String {
        switch self {
        case .percent: "%"
        case .factorial: "!"
        }
    }
}

enum MathConstant: Hashable {
    case pi
    case e

    var symbol: String {
        switch self {
        case .pi: "π"
        case .e: "e"
        }
    }

    var value: Double {
        switch self {
        case .pi: Double.pi
        case .e: exp(1)
        }
    }
}

/// Single-argument functions. In an expression they carry their own opening parenthesis.
enum MathFunction: Hashable {
    case sin, cos, tan
    case asin, acos, atan
    case ln, log
    case sqrt, cbrt
    case abs

    var symbol: String {
        switch self {
        case .sin: "sin"
        case .cos: "cos"
        case .tan: "tan"
        case .asin: "sin⁻¹"
        case .acos: "cos⁻¹"
        case .atan: "tan⁻¹"
        case .ln: "ln"
        case .log: "log"
        case .sqrt: "√"
        case .cbrt: "∛"
        case .abs: "abs"
        }
    }
}

/// One element of the expression being typed.
enum ExpressionToken: Hashable {
    /// Raw number text such as "12.5", "-3" or "1.2E20".
    case number(String)
    case binary(BinaryOperator)
    case postfix(PostfixOperator)
    case constant(MathConstant)
    /// A function call such as "sin(" — opens a group closed by `closeParen`.
    case function(MathFunction)
    case openParen
    case closeParen

    /// True when the token completes an operand, so an operator may follow it.
    var endsOperand: Bool {
        switch self {
        case .number, .constant, .closeParen, .postfix: true
        default: false
        }
    }

    /// True when the token opens a parenthesized group.
    var opensGroup: Bool {
        switch self {
        case .openParen, .function: true
        default: false
        }
    }
}

/// Every input the calculator keypad can send to the engine.
enum CalculatorKey: Hashable {
    case digit(Int)
    case decimal
    case binary(BinaryOperator)
    case percent
    case factorial
    case toggleSign
    case clear
    case backspace
    case equals
    case openParen
    case closeParen
    case function(MathFunction)
    case constant(MathConstant)
    case square
    case cube
    case reciprocal
    case exponential
    case powerOfTen
    case random
    case memoryClear
    case memoryRecall
    case memoryAdd
    case memorySubtract
}
