//
//  TipCalculatorTests.swift
//  calculatorTests
//

import Testing
@testable import calculator

struct TipCalculatorTests {
    @Test func computesTipAndSplit() {
        let calc = TipCalculator(tipPercent: 20)
        [1, 0, 0].forEach(calc.appendDigit)
        calc.incrementSplit()
        calc.incrementSplit()

        #expect(calc.billAmount == 100)
        #expect(calc.tipAmount == 20)
        #expect(calc.totalAmount == 120)
        #expect(calc.perPersonAmount() == 40)
    }

    @Test func roundsUpSplit() {
        let calc = TipCalculator(tipPercent: 0)
        [1, 0].forEach(calc.appendDigit)
        calc.incrementSplit()
        calc.incrementSplit()

        #expect(calc.perPersonAmount(roundUp: true) == 4)
    }

    @Test func limitsDecimalsAndLeadingZero() {
        let calc = TipCalculator()
        calc.appendDigit(0)
        calc.appendDigit(5)
        #expect(calc.billInput == "5")

        calc.appendDecimalPoint()
        calc.appendDecimalPoint()
        [1, 2, 3].forEach(calc.appendDigit)
        #expect(calc.billInput == "5.12")

        calc.deleteLast()
        #expect(calc.billInput == "5.1")
    }

    @Test func decimalOnEmptyInputAddsLeadingZero() {
        let calc = TipCalculator()
        calc.appendDecimalPoint()
        #expect(calc.billInput == "0.")
    }

    @Test func splitStaysInRange() {
        let calc = TipCalculator()
        calc.decrementSplit()
        #expect(calc.splitCount == 1)
    }
}
