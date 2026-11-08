//
//  CalendarView.swift
//  Journal
//

import SwiftUI
import SwiftData

/// Month grid showing which days have entries, plus the entries for the selected day.
struct CalendarView: View {
    @Query(sort: \JournalEntry.createdAt, order: .reverse) private var entries: [JournalEntry]

    @State private var month = Calendar.current.dateInterval(of: .month, for: .now)?.start ?? .now
    @State private var selectedDay = Calendar.current.startOfDay(for: .now)
    @State private var editorRequest: EditorRequest?

    private let calendar = Calendar.current

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Calendar")
                        .font(.system(size: 44, weight: .bold))
                        .padding(.top, 8)

                    monthCard
                    dayEntries
                }
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .scrollIndicators(.hidden)
            .background(Theme.groupedBackground.ignoresSafeArea())
            .toolbarVisibility(.hidden, for: .navigationBar)
            .navigationDestination(for: JournalEntry.self) { entry in
                EntryDetailView(entry: entry) { editorRequest = EditorRequest(entry: $0) }
            }
            .sheet(item: $editorRequest) { request in
                EntryEditorView(entry: request.entry, prompt: request.prompt, initialDate: request.date)
            }
        }
    }

    // MARK: - Month grid

    private var monthCard: some View {
        let grouped = entriesByDay
        return VStack(spacing: 18) {
            HStack {
                Text(month, format: .dateTime.month(.wide).year())
                    .font(.title3.weight(.bold))
                    .contentTransition(.numericText())
                Spacer()
                CircleIconButton(systemImage: "chevron.left", foreground: Theme.text, background: Theme.fill, size: 40) { shiftMonth(by: -1) }
                    .accessibilityLabel("Previous month")
                CircleIconButton(systemImage: "chevron.right", foreground: Theme.text, background: Theme.fill, size: 40) { shiftMonth(by: 1) }
                    .accessibilityLabel("Next month")
            }

            let columns = Array(repeating: GridItem(.flexible(), spacing: 4), count: 7)
            LazyVGrid(columns: columns, spacing: 8) {
                ForEach(Array(weekdaySymbols.enumerated()), id: \.offset) { _, symbol in
                    Text(symbol)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(Theme.secondaryText)
                }
                ForEach(Array(monthDays.enumerated()), id: \.offset) { _, day in
                    if let day {
                        dayCell(day, entries: grouped[day] ?? [])
                    } else {
                        Color.clear.frame(height: 44)
                    }
                }
            }

            HStack(spacing: 16) {
                stat(value: entriesThisMonth.count, label: "entries")
                stat(value: Set(entriesThisMonth.map { calendar.startOfDay(for: $0.createdAt) }).count, label: "days written")
                Spacer()
                if !calendar.isDate(month, equalTo: .now, toGranularity: .month) {
                    Button("Today") {
                        withAnimation(.snappy) {
                            month = calendar.dateInterval(of: .month, for: .now)?.start ?? .now
                            selectedDay = calendar.startOfDay(for: .now)
                        }
                    }
                    .font(.subheadline.weight(.semibold))
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(20)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
    }

    private func dayCell(_ day: Date, entries dayEntries: [JournalEntry]) -> some View {
        let isSelected = calendar.isDate(day, inSameDayAs: selectedDay)
        let isToday = calendar.isDateInToday(day)

        return Button {
            withAnimation(.snappy) { selectedDay = day }
        } label: {
            VStack(spacing: 3) {
                Text(day, format: .dateTime.day())
                    .font(.callout.weight(isToday || isSelected ? .bold : .regular))
                    .foregroundStyle(isSelected ? Theme.textInverse : Theme.text)
                HStack(spacing: 2) {
                    ForEach(dayEntries.prefix(3)) { entry in
                        Circle()
                            .fill(isSelected ? Theme.textInverse : entry.mood.tint)
                            .frame(width: 5, height: 5)
                    }
                }
                .frame(height: 5)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 44)
            .background {
                if isSelected {
                    Circle().fill(Theme.text).frame(width: 44, height: 44)
                } else if isToday {
                    Circle().strokeBorder(Theme.text, lineWidth: 1.5).frame(width: 44, height: 44)
                }
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(day, format: .dateTime.month().day()))
        .accessibilityValue("\(dayEntries.count) entries")
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }

    private func stat(value: Int, label: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(value, format: .number)
                .font(.headline.monospacedDigit())
            Text(label)
                .font(.caption)
                .foregroundStyle(Theme.secondaryText)
        }
    }

    // MARK: - Selected day

    @ViewBuilder
    private var dayEntries: some View {
        let items = entries.filter { calendar.isDate($0.createdAt, inSameDayAs: selectedDay) }
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text(selectedDay, format: .dateTime.weekday(.wide).month().day())
                    .font(.title3.weight(.bold))
                Spacer()
                Button {
                    editorRequest = EditorRequest(date: selectedDay)
                } label: {
                    Image(systemName: "plus")
                        .font(.headline)
                        .foregroundStyle(Theme.textInverse)
                        .frame(width: 40, height: 40)
                        .background(Theme.text, in: Circle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel("New entry")
            }

            if items.isEmpty {
                EmptyStateView(
                    systemImage: "moon.zzz",
                    title: "A quiet day",
                    message: "No entries on this day."
                )
                .frame(maxWidth: .infinity)
            } else {
                ForEach(items) { entry in
                    NavigationLink(value: entry) {
                        EntryCard(entry: entry, isWide: true)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Date helpers

    private var weekdaySymbols: [String] {
        let symbols = calendar.veryShortStandaloneWeekdaySymbols
        let first = calendar.firstWeekday - 1
        return Array(symbols[first...] + symbols[..<first])
    }

    /// Days of the visible month, padded with `nil` so the first day lines up
    /// under the correct weekday column.
    private var monthDays: [Date?] {
        guard let range = calendar.range(of: .day, in: .month, for: month) else { return [] }
        let weekday = calendar.component(.weekday, from: month)
        let leading = (weekday - calendar.firstWeekday + 7) % 7
        let days = range.compactMap { calendar.date(byAdding: .day, value: $0 - 1, to: month) }
        return Array(repeating: nil, count: leading) + days
    }

    private var entriesByDay: [Date: [JournalEntry]] {
        Dictionary(grouping: entries) { calendar.startOfDay(for: $0.createdAt) }
    }

    private var entriesThisMonth: [JournalEntry] {
        entries.filter { calendar.isDate($0.createdAt, equalTo: month, toGranularity: .month) }
    }

    private func shiftMonth(by value: Int) {
        guard let next = calendar.date(byAdding: .month, value: value, to: month) else { return }
        withAnimation(.snappy) { month = next }
    }
}

#Preview {
    CalendarView()
        .modelContainer(PreviewContainer.shared)
}
