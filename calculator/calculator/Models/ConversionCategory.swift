//
//  ConversionCategory.swift
//  calculator
//

import Foundation

/// A unit the converter can show, with a friendly name.
struct UnitOption: Identifiable, Hashable {
    let name: String
    let symbol: String
    let unit: Dimension

    var id: String { name }

    static func == (lhs: UnitOption, rhs: UnitOption) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

/// A group of mutually convertible units, such as length or temperature.
struct ConversionCategory: Identifiable, Hashable {
    let id: String
    let title: String
    let systemImage: String
    let units: [UnitOption]
    var allowsNegative = false

    static func == (lhs: ConversionCategory, rhs: ConversionCategory) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }

    func convert(_ value: Double, from source: UnitOption, to target: UnitOption) -> Double {
        Measurement(value: value, unit: source.unit).converted(to: target.unit).value
    }

    static var all: [ConversionCategory] {
        [length, mass, temperature, volume, area, speed, time, data]
    }

    private static var length: ConversionCategory {
        ConversionCategory(id: "length", title: "Length", systemImage: "ruler", units: [
            UnitOption(name: "Meters", symbol: "m", unit: UnitLength.meters),
            UnitOption(name: "Kilometers", symbol: "km", unit: UnitLength.kilometers),
            UnitOption(name: "Centimeters", symbol: "cm", unit: UnitLength.centimeters),
            UnitOption(name: "Millimeters", symbol: "mm", unit: UnitLength.millimeters),
            UnitOption(name: "Miles", symbol: "mi", unit: UnitLength.miles),
            UnitOption(name: "Yards", symbol: "yd", unit: UnitLength.yards),
            UnitOption(name: "Feet", symbol: "ft", unit: UnitLength.feet),
            UnitOption(name: "Inches", symbol: "in", unit: UnitLength.inches),
            UnitOption(name: "Nautical miles", symbol: "nmi", unit: UnitLength.nauticalMiles)
        ])
    }

    private static var mass: ConversionCategory {
        ConversionCategory(id: "mass", title: "Weight", systemImage: "scalemass", units: [
            UnitOption(name: "Kilograms", symbol: "kg", unit: UnitMass.kilograms),
            UnitOption(name: "Grams", symbol: "g", unit: UnitMass.grams),
            UnitOption(name: "Milligrams", symbol: "mg", unit: UnitMass.milligrams),
            UnitOption(name: "Metric tons", symbol: "t", unit: UnitMass.metricTons),
            UnitOption(name: "Pounds", symbol: "lb", unit: UnitMass.pounds),
            UnitOption(name: "Ounces", symbol: "oz", unit: UnitMass.ounces),
            UnitOption(name: "Stones", symbol: "st", unit: UnitMass.stones)
        ])
    }

    private static var temperature: ConversionCategory {
        ConversionCategory(id: "temperature", title: "Temperature", systemImage: "thermometer.medium", units: [
            UnitOption(name: "Celsius", symbol: "°C", unit: UnitTemperature.celsius),
            UnitOption(name: "Fahrenheit", symbol: "°F", unit: UnitTemperature.fahrenheit),
            UnitOption(name: "Kelvin", symbol: "K", unit: UnitTemperature.kelvin)
        ], allowsNegative: true)
    }

    private static var volume: ConversionCategory {
        ConversionCategory(id: "volume", title: "Volume", systemImage: "drop", units: [
            UnitOption(name: "Liters", symbol: "L", unit: UnitVolume.liters),
            UnitOption(name: "Milliliters", symbol: "mL", unit: UnitVolume.milliliters),
            UnitOption(name: "Cubic meters", symbol: "m³", unit: UnitVolume.cubicMeters),
            UnitOption(name: "Gallons (US)", symbol: "gal", unit: UnitVolume.gallons),
            UnitOption(name: "Quarts (US)", symbol: "qt", unit: UnitVolume.quarts),
            UnitOption(name: "Pints (US)", symbol: "pt", unit: UnitVolume.pints),
            UnitOption(name: "Cups", symbol: "cup", unit: UnitVolume.cups),
            UnitOption(name: "Fluid ounces", symbol: "fl oz", unit: UnitVolume.fluidOunces),
            UnitOption(name: "Tablespoons", symbol: "tbsp", unit: UnitVolume.tablespoons),
            UnitOption(name: "Teaspoons", symbol: "tsp", unit: UnitVolume.teaspoons)
        ])
    }

    private static var area: ConversionCategory {
        ConversionCategory(id: "area", title: "Area", systemImage: "square.dashed", units: [
            UnitOption(name: "Square meters", symbol: "m²", unit: UnitArea.squareMeters),
            UnitOption(name: "Square kilometers", symbol: "km²", unit: UnitArea.squareKilometers),
            UnitOption(name: "Square feet", symbol: "ft²", unit: UnitArea.squareFeet),
            UnitOption(name: "Square miles", symbol: "mi²", unit: UnitArea.squareMiles),
            UnitOption(name: "Acres", symbol: "ac", unit: UnitArea.acres),
            UnitOption(name: "Hectares", symbol: "ha", unit: UnitArea.hectares)
        ])
    }

    private static var speed: ConversionCategory {
        ConversionCategory(id: "speed", title: "Speed", systemImage: "speedometer", units: [
            UnitOption(name: "Kilometers/hour", symbol: "km/h", unit: UnitSpeed.kilometersPerHour),
            UnitOption(name: "Meters/second", symbol: "m/s", unit: UnitSpeed.metersPerSecond),
            UnitOption(name: "Miles/hour", symbol: "mph", unit: UnitSpeed.milesPerHour),
            UnitOption(name: "Knots", symbol: "kn", unit: UnitSpeed.knots)
        ])
    }

    private static var time: ConversionCategory {
        // Foundation has no day/week units, so define them from seconds.
        let days = UnitDuration(symbol: "d", converter: UnitConverterLinear(coefficient: 86_400))
        let weeks = UnitDuration(symbol: "wk", converter: UnitConverterLinear(coefficient: 604_800))
        return ConversionCategory(id: "time", title: "Time", systemImage: "clock", units: [
            UnitOption(name: "Seconds", symbol: "s", unit: UnitDuration.seconds),
            UnitOption(name: "Milliseconds", symbol: "ms", unit: UnitDuration.milliseconds),
            UnitOption(name: "Minutes", symbol: "min", unit: UnitDuration.minutes),
            UnitOption(name: "Hours", symbol: "h", unit: UnitDuration.hours),
            UnitOption(name: "Days", symbol: "d", unit: days),
            UnitOption(name: "Weeks", symbol: "wk", unit: weeks)
        ])
    }

    private static var data: ConversionCategory {
        ConversionCategory(id: "data", title: "Data", systemImage: "externaldrive", units: [
            UnitOption(name: "Bytes", symbol: "B", unit: UnitInformationStorage.bytes),
            UnitOption(name: "Bits", symbol: "bit", unit: UnitInformationStorage.bits),
            UnitOption(name: "Kilobytes", symbol: "KB", unit: UnitInformationStorage.kilobytes),
            UnitOption(name: "Megabytes", symbol: "MB", unit: UnitInformationStorage.megabytes),
            UnitOption(name: "Gigabytes", symbol: "GB", unit: UnitInformationStorage.gigabytes),
            UnitOption(name: "Terabytes", symbol: "TB", unit: UnitInformationStorage.terabytes)
        ])
    }
}
