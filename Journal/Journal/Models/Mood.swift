//
//  Mood.swift
//  Journal
//

import SwiftUI

enum Mood: String, CaseIterable, Identifiable, Codable {
    case joyful, happy, calm, tired, sad, anxious

    var id: String { rawValue }

    var emoji: String {
        switch self {
        case .joyful: "🤩"
        case .happy: "😊"
        case .calm: "😌"
        case .tired: "😴"
        case .sad: "😔"
        case .anxious: "😰"
        }
    }

    var label: String { rawValue.capitalized }

    /// Higher is better; used for the mood trend chart.
    var score: Int {
        switch self {
        case .joyful: 5
        case .happy: 4
        case .calm: 3
        case .tired: 2
        case .anxious: 2
        case .sad: 1
        }
    }

    var tint: Color {
        switch self {
        case .joyful: Color(red: 0.98, green: 0.75, blue: 0.25)
        case .happy: Color(red: 0.55, green: 0.82, blue: 0.45)
        case .calm: Color(red: 0.45, green: 0.75, blue: 0.85)
        case .tired: Color(red: 0.65, green: 0.6, blue: 0.85)
        case .sad: Color(red: 0.45, green: 0.55, blue: 0.8)
        case .anxious: Color(red: 0.93, green: 0.55, blue: 0.5)
        }
    }
}
