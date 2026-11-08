//
//  JournalStats.swift
//  Journal
//

import Foundation

/// Writing-habit calculations shared by the Insights and Profile screens.
enum JournalStats {
    private static var calendar: Calendar { .current }

    static func writingDays(_ entries: [JournalEntry]) -> Set<Date> {
        Set(entries.map { calendar.startOfDay(for: $0.createdAt) })
    }

    /// Consecutive days with at least one entry, ending today (or yesterday,
    /// so the streak isn't shown as broken before the user has written today).
    static func currentStreak(_ entries: [JournalEntry]) -> Int {
        let days = writingDays(entries)
        var day = calendar.startOfDay(for: .now)
        if !days.contains(day) {
            guard let yesterday = calendar.date(byAdding: .day, value: -1, to: day), days.contains(yesterday) else { return 0 }
            day = yesterday
        }
        var streak = 0
        while days.contains(day) {
            streak += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: day) else { break }
            day = previous
        }
        return streak
    }

    static func longestStreak(_ entries: [JournalEntry]) -> Int {
        let days = writingDays(entries).sorted()
        var longest = 0
        var current = 0
        var previous: Date?
        for day in days {
            if let previous, calendar.date(byAdding: .day, value: 1, to: previous) == day {
                current += 1
            } else {
                current = 1
            }
            longest = max(longest, current)
            previous = day
        }
        return longest
    }

    /// Entries written in the current calendar week.
    static func entriesThisWeek(_ entries: [JournalEntry]) -> Int {
        entries.filter { calendar.isDate($0.createdAt, equalTo: .now, toGranularity: .weekOfYear) }.count
    }

    /// The mood logged most often, if any entries exist.
    static func topMood(_ entries: [JournalEntry]) -> Mood? {
        let counts = Dictionary(grouping: entries, by: \.mood).mapValues(\.count)
        return counts.max { $0.value == $1.value ? $0.key.score < $1.key.score : $0.value < $1.value }?.key
    }
}
