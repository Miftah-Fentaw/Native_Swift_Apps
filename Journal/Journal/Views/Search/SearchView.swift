//
//  SearchView.swift
//  Journal
//

import SwiftUI
import SwiftData

/// Full-text search across titles, bodies, checklist items and tags,
/// with optional mood filtering.
struct SearchView: View {
    @Query(sort: \JournalEntry.createdAt, order: .reverse) private var entries: [JournalEntry]

    @State private var query = ""
    @State private var mood: Mood?
    @State private var editorRequest: EditorRequest?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    moodFilter

                    if results.isEmpty {
                        EmptyStateView(
                            systemImage: "magnifyingglass",
                            title: query.isEmpty && mood == nil ? "Search your journal" : "No matches",
                            message: query.isEmpty && mood == nil
                                ? "Find entries by words, tags or checklist items."
                                : "Try a different word or mood."
                        )
                        .frame(maxWidth: .infinity)
                        .padding(.top, 40)
                    } else {
                        Text("\(results.count) \(results.count == 1 ? "entry" : "entries")")
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(Theme.secondaryText)
                        ForEach(results) { entry in
                            NavigationLink(value: entry) {
                                EntryCard(entry: entry, isWide: true)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .scrollDismissesKeyboard(.immediately)
            .background(Theme.groupedBackground.ignoresSafeArea())
            .navigationTitle("Search")
            .searchable(text: $query, prompt: "Titles, notes, #tags")
            .navigationDestination(for: JournalEntry.self) { entry in
                EntryDetailView(entry: entry) { editorRequest = EditorRequest(entry: $0) }
            }
            .sheet(item: $editorRequest) { request in
                EntryEditorView(entry: request.entry, prompt: request.prompt)
            }
        }
    }

    private var moodFilter: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                FilterChip(title: "Any mood", isSelected: mood == nil) { mood = nil }
                ForEach(Mood.allCases) { option in
                    FilterChip(title: "\(option.emoji) \(option.label)", isSelected: mood == option) {
                        mood = mood == option ? nil : option
                    }
                }
            }
            .padding(.horizontal, 24)
        }
        .scrollIndicators(.hidden)
        .padding(.horizontal, -24)
    }

    private var results: [JournalEntry] {
        let terms = query
            .lowercased()
            .split(separator: " ")
            .map { $0.trimmingCharacters(in: CharacterSet(charactersIn: "#")) }
            .filter { !$0.isEmpty }

        guard !terms.isEmpty || mood != nil else { return [] }

        return entries.filter { entry in
            if let mood, entry.mood != mood { return false }
            let haystack = ([entry.title, entry.body] + entry.checklist.map(\.text) + entry.tags)
                .joined(separator: " ")
                .lowercased()
            // Every term must appear somewhere in the entry.
            return terms.allSatisfy { haystack.contains($0) }
        }
    }
}

#Preview {
    SearchView()
        .modelContainer(PreviewContainer.shared)
}
