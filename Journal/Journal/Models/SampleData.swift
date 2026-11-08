//
//  SampleData.swift
//  Journal
//

import Foundation
import SwiftData

enum SampleData {
    /// Inserts a few entries on first launch so the app doesn't start empty.
    static func seedIfNeeded(in context: ModelContext) {
        let count = (try? context.fetchCount(FetchDescriptor<JournalEntry>())) ?? 0
        guard count == 0 else { return }
        for entry in makeEntries() {
            context.insert(entry)
        }
        try? context.save()
    }

    static func makeEntries() -> [JournalEntry] {
        let calendar = Calendar.current
        func daysAgo(_ days: Int, hour: Int = 9) -> Date {
            let day = calendar.date(byAdding: .day, value: -days, to: .now) ?? .now
            return calendar.date(bySettingHour: hour, minute: 15, second: 0, of: day) ?? day
        }

        return [
            JournalEntry(
                title: "Buy honey 100% original",
                body: "Buy the new brand honey for my family, here's the pic.",
                createdAt: daysAgo(0, hour: 8),
                color: .peach,
                mood: .happy,
                isFavorite: true,
                tags: ["errands"]
            ),
            JournalEntry(
                title: "Plan for the today",
                createdAt: daysAgo(0, hour: 7),
                color: .lemon,
                mood: .calm,
                checklist: [
                    ChecklistItem(text: "Buy food", isDone: true),
                    ChecklistItem(text: "GYM"),
                    ChecklistItem(text: "Meeting")
                ],
                tags: ["plan"]
            ),
            JournalEntry(
                title: "Tax payment before the end of march",
                body: """
                This is a reminder note, so as not to forget to pay taxes before the end of march. Don't miss it, you could be fined!

                List of assets that must be reported to the government, whether in the form of cash savings. That is mandatory for filing the tax payment to the government.
                """,
                createdAt: daysAgo(1),
                color: .sky,
                mood: .anxious,
                isBookmarked: true,
                checklist: [
                    ChecklistItem(text: "Savings account statements"),
                    ChecklistItem(text: "Car registration"),
                    ChecklistItem(text: "Rental income receipts")
                ],
                tags: ["finance", "important"]
            ),
            JournalEntry(
                title: "Password WiFi gelato cafe near the station",
                body: "Wifi indoor: they reset the wifi password every 4 weeks, ask the barista.\n\nThis is a gentle reminder.",
                createdAt: daysAgo(2, hour: 16),
                color: .sand,
                mood: .joyful,
                isBookmarked: true
            ),
            JournalEntry(
                title: "Morning pages",
                body: "Woke up before the alarm for the first time this week. The light through the window was soft and gold. I want to keep this slow pace — coffee, ten minutes of reading, no phone.",
                createdAt: daysAgo(3, hour: 6),
                color: .mint,
                mood: .calm,
                isFavorite: true,
                tags: ["morning", "gratitude"]
            ),
            JournalEntry(
                title: "Rough day at work",
                body: "Deadline moved up again. Felt drained by the afternoon. Note to self: take a real lunch break tomorrow and go for a walk.",
                createdAt: daysAgo(5, hour: 21),
                color: .lavender,
                mood: .tired,
                tags: ["work"]
            ),
            JournalEntry(
                title: "Three good things",
                createdAt: daysAgo(6, hour: 22),
                color: .rose,
                mood: .joyful,
                isFavorite: true,
                checklist: [
                    ChecklistItem(text: "Called mom", isDone: true),
                    ChecklistItem(text: "Finished my book", isDone: true),
                    ChecklistItem(text: "Cooked a new recipe", isDone: true)
                ],
                tags: ["gratitude"]
            )
        ]
    }
}
