//
//  InsightsView.swift
//  Journal
//

import SwiftUI
import SwiftData
import Charts

/// Writing habits and mood trends computed from the user's entries.
struct InsightsView: View {
    @Query(sort: \JournalEntry.createdAt, order: .reverse) private var entries: [JournalEntry]

    @State private var range: TrendRange = .twoWeeks
    @State private var selectedDay: Date?

    private let calendar = Calendar.current

    enum TrendRange: Int, CaseIterable, Identifiable {
        case week = 7, twoWeeks = 14, month = 30
        var id: Int { rawValue }
        var title: String { "\(rawValue)D" }
    }

    /// Average mood score for one calendar day.
    struct DayMood: Identifiable {
        let day: Date
        let score: Double
        var id: Date { day }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Insights")
                        .font(.system(size: 44, weight: .bold))
                        .padding(.top, 8)

                    streakHero
                    statGrid
                    moodTrend
                    moodBreakdown
                    topTags
                }
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .scrollIndicators(.hidden)
            .background(Theme.background.ignoresSafeArea())
            .toolbarVisibility(.hidden, for: .navigationBar)
        }
    }

    // MARK: - Tiles

    private var streakHero: some View {
        HStack(alignment: .center, spacing: 18) {
            Text("🔥")
                .font(.system(size: 48))
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(currentStreak) day streak")
                    .font(.title.weight(.bold))
                    .foregroundStyle(.black)
                Text(currentStreak > 0 ? "Keep it going — write today!" : "Write today to start a new streak.")
                    .font(.subheadline)
                    .foregroundStyle(.black.opacity(0.65))
            }
            Spacer(minLength: 0)
        }
        .padding(22)
        .background(CardColor.lemon.color, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    private var statGrid: some View {
        Grid(horizontalSpacing: 14, verticalSpacing: 14) {
            GridRow {
                statTile(value: entries.count, label: "Entries", color: .peach)
                statTile(value: longestStreak, label: "Longest streak", color: .sky)
            }
            GridRow {
                statTile(value: entries.reduce(0) { $0 + $1.wordCount }, label: "Words written", color: .mint)
                statTile(value: entries.reduce(0) { $0 + $1.checklist.filter(\.isDone).count }, label: "Tasks done", color: .lavender)
            }
        }
    }

    private func statTile(value: Int, label: String, color: CardColor) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value, format: .number)
                .font(.system(size: 34, weight: .bold).monospacedDigit())
                .contentTransition(.numericText())
            Text(label)
                .font(.subheadline.weight(.medium))
                .opacity(0.65)
        }
        .foregroundStyle(.black)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(color.color, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    // MARK: - Charts

    private var moodTrend: some View {
        let data = dailyMoods
        let selected = selectedDay.flatMap { day in
            data.first { calendar.isDate($0.day, inSameDayAs: day) }
        }

        return VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Mood trend")
                        .font(.headline)
                    Group {
                        if let selected {
                            Text("\(selected.day.formatted(.dateTime.month().day())) · \(moodLabel(for: selected.score))")
                        } else {
                            Text("Average mood per day")
                        }
                    }
                    .font(.caption)
                    .foregroundStyle(Theme.secondaryText)
                }
                Spacer()
                Picker("Range", selection: $range) {
                    ForEach(TrendRange.allCases) { Text($0.title).tag($0) }
                }
                .pickerStyle(.segmented)
                .frame(width: 150)
            }

            if data.isEmpty {
                Text("Log a few entries to see your mood over time.")
                    .font(.subheadline)
                    .foregroundStyle(Theme.secondaryText)
                    .frame(maxWidth: .infinity, minHeight: 160)
            } else {
                Chart {
                    ForEach(data) { point in
                        LineMark(
                            x: .value("Day", point.day, unit: .day),
                            y: .value("Mood", point.score)
                        )
                        .interpolationMethod(.monotone)
                        .lineStyle(StrokeStyle(lineWidth: 2))
                        .foregroundStyle(Theme.text)

                        PointMark(
                            x: .value("Day", point.day, unit: .day),
                            y: .value("Mood", point.score)
                        )
                        .symbolSize(64)
                        .foregroundStyle(Theme.text)
                    }
                    if let selected {
                        RuleMark(x: .value("Day", selected.day, unit: .day))
                            .foregroundStyle(Theme.text.opacity(0.3))
                            .lineStyle(StrokeStyle(lineWidth: 1))
                    }
                }
                .chartYScale(domain: 1...5)
                .chartYAxis {
                    AxisMarks(position: .leading, values: [1, 3, 5]) { value in
                        AxisGridLine().foregroundStyle(Theme.separator)
                        AxisValueLabel {
                            if let score = value.as(Int.self) {
                                Text(score == 5 ? "🤩" : score == 3 ? "😌" : "😔")
                            }
                        }
                    }
                }
                .chartXAxis {
                    AxisMarks(values: .stride(by: .day, count: range == .month ? 7 : 3)) { _ in
                        AxisValueLabel(format: .dateTime.month(.abbreviated).day())
                            .foregroundStyle(Theme.secondaryText)
                    }
                }
                .chartXSelection(value: $selectedDay)
                .frame(height: 180)
                .accessibilityLabel("Mood trend for the last \(range.rawValue) days")
            }
        }
        .padding(20)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
    }

    private var moodBreakdown: some View {
        let counts = Mood.allCases.map { mood in
            (mood: mood, count: entries.filter { $0.mood == mood }.count)
        }

        return VStack(alignment: .leading, spacing: 16) {
            Text("How you've been feeling")
                .font(.headline)

            Chart(counts, id: \.mood) { item in
                BarMark(
                    x: .value("Mood", "\(item.mood.emoji) \(item.mood.label)"),
                    y: .value("Entries", item.count),
                    width: .ratio(0.55)
                )
                .clipShape(UnevenRoundedRectangle(topLeadingRadius: 4, topTrailingRadius: 4))
                .foregroundStyle(Theme.text.opacity(0.85))
                .annotation(position: .top) {
                    if item.count > 0 {
                        Text(item.count, format: .number)
                            .font(.caption2.weight(.semibold))
                            .foregroundStyle(Theme.secondaryText)
                    }
                }
            }
            .chartYAxis(.hidden)
            .chartXAxis {
                AxisMarks { _ in
                    AxisValueLabel()
                        .font(.caption2)
                        .foregroundStyle(Theme.secondaryText)
                }
            }
            .frame(height: 170)
        }
        .padding(20)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
    }

    @ViewBuilder
    private var topTags: some View {
        let tags = tagCounts

        if !tags.isEmpty {
            VStack(alignment: .leading, spacing: 14) {
                Text("Top tags")
                    .font(.headline)
                ForEach(tags, id: \.tag) { item in
                    HStack {
                        Text("#\(item.tag)")
                            .font(.subheadline.weight(.medium))
                        Spacer()
                        Text(item.count, format: .number)
                            .font(.subheadline.monospacedDigit())
                            .foregroundStyle(Theme.secondaryText)
                    }
                }
            }
            .padding(20)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        }
    }

    // MARK: - Calculations

    /// The six most used tags, most frequent first.
    private var tagCounts: [(tag: String, count: Int)] {
        var counts: [String: Int] = [:]
        for tag in entries.flatMap(\.tags) {
            counts[tag, default: 0] += 1
        }
        let sorted = counts.sorted { lhs, rhs in
            lhs.value == rhs.value ? lhs.key < rhs.key : lhs.value > rhs.value
        }
        return sorted.prefix(6).map { (tag: $0.key, count: $0.value) }
    }

    private var writingDays: Set<Date> { JournalStats.writingDays(entries) }
    private var currentStreak: Int { JournalStats.currentStreak(entries) }
    private var longestStreak: Int { JournalStats.longestStreak(entries) }

    private var dailyMoods: [DayMood] {
        let start = calendar.date(byAdding: .day, value: -(range.rawValue - 1), to: calendar.startOfDay(for: .now)) ?? .now
        let recent = entries.filter { $0.createdAt >= start }
        return Dictionary(grouping: recent) { calendar.startOfDay(for: $0.createdAt) }
            .map { day, items in
                DayMood(day: day, score: Double(items.reduce(0) { $0 + $1.mood.score }) / Double(items.count))
            }
            .sorted { $0.day < $1.day }
    }

    private func moodLabel(for score: Double) -> String {
        let nearest = Mood.allCases.min { abs(Double($0.score) - score) < abs(Double($1.score) - score) } ?? .calm
        return "\(nearest.emoji) \(score.formatted(.number.precision(.fractionLength(1))))"
    }
}

#Preview {
    InsightsView()
        .modelContainer(PreviewContainer.shared)
}
