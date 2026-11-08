//
//  HomeView.swift
//  Journal
//

import SwiftUI
import SwiftData

enum EntryFilter: String, CaseIterable, Identifiable {
    case all, favorites, bookmarked, checklists, photos

    var id: String { rawValue }

    var title: String {
        switch self {
        case .all: "All"
        case .favorites: "Favorites"
        case .bookmarked: "Bookmarked"
        case .checklists: "Checklists"
        case .photos: "Photos"
        }
    }

    func matches(_ entry: JournalEntry) -> Bool {
        switch self {
        case .all: true
        case .favorites: entry.isFavorite
        case .bookmarked: entry.isBookmarked
        case .checklists: !entry.checklist.isEmpty
        case .photos: entry.photoData != nil
        }
    }
}

enum EntrySort: String, CaseIterable, Identifiable {
    case newest, oldest, recentlyEdited

    var id: String { rawValue }

    var title: String {
        switch self {
        case .newest: "Newest first"
        case .oldest: "Oldest first"
        case .recentlyEdited: "Recently edited"
        }
    }
}

/// Request to open the editor, either for a new entry or an existing one.
struct EditorRequest: Identifiable {
    let id = UUID()
    var entry: JournalEntry?
    var prompt: String?
    var date: Date?
}

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \JournalEntry.createdAt, order: .reverse) private var entries: [JournalEntry]

    @AppStorage("userName") private var userName = ""
    @AppStorage("avatarData") private var avatarData: Data?

    @State private var filter: EntryFilter = .all
    @State private var sort: EntrySort = .newest
    @State private var editorRequest: EditorRequest?
    @State private var path: [JournalEntry] = []
    @State private var isShowingProfile = false

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header
                    Text("My Journal")
                        .font(.system(size: 52, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .padding(.top, 4)
                    filterBar
                    if filter == .all {
                        DailyPromptCard { prompt in
                            editorRequest = EditorRequest(prompt: prompt)
                        }
                    }
                    grid
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 120)
            }
            .scrollIndicators(.hidden)
            .background(Theme.background.ignoresSafeArea())
            .overlay(alignment: .bottomTrailing) { newEntryButton }
            .toolbarVisibility(.hidden, for: .navigationBar)
            .navigationDestination(for: JournalEntry.self) { entry in
                EntryDetailView(entry: entry) { editorRequest = EditorRequest(entry: $0) }
            }
            .sheet(item: $editorRequest) { request in
                EntryEditorView(entry: request.entry, prompt: request.prompt)
            }
            .sheet(isPresented: $isShowingProfile) {
                ProfileView()
            }
        }
    }

    // MARK: - Sections

    private var header: some View {
        HStack(spacing: 14) {
            // Avatar and greeting open profile management.
            Button {
                isShowingProfile = true
            } label: {
                HStack(spacing: 14) {
                    AvatarView(data: avatarData, name: userName, size: 64)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Hi, \(userName.isEmpty ? "there" : userName)")
                            .font(.title2.weight(.semibold))
                            .foregroundStyle(Theme.text)
                        Text(Date.now, format: .dateTime.weekday(.wide).month().day())
                            .font(.subheadline)
                            .foregroundStyle(Theme.secondaryText)
                    }
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Profile")
            .accessibilityHint("Edit your name, photo and goals")
            Spacer()
            Menu {
                Picker("Sort", selection: $sort) {
                    ForEach(EntrySort.allCases) { Text($0.title).tag($0) }
                }
                Divider()
                Button("Profile", systemImage: "person.crop.circle") {
                    isShowingProfile = true
                }
                Button("New Entry", systemImage: "square.and.pencil") {
                    editorRequest = EditorRequest()
                }
            } label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(Theme.text)
                    .frame(width: 56, height: 56)
                    .background(Theme.fill, in: Circle())
            }
            .accessibilityLabel("Options")
        }
        .padding(.top, 8)
    }

    private var filterBar: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 10) {
                ForEach(EntryFilter.allCases) { option in
                    FilterChip(
                        title: option == .all ? "All (\(entries.count))" : option.title,
                        isSelected: filter == option
                    ) {
                        filter = option
                    }
                }
            }
            .padding(.horizontal, 24)
        }
        .scrollIndicators(.hidden)
        .padding(.horizontal, -24)
    }

    @ViewBuilder
    private var grid: some View {
        let visible = sortedEntries.filter(filter.matches)
        if visible.isEmpty {
            EmptyStateView(
                systemImage: "book.closed",
                title: "Nothing here yet",
                message: "Tap + to capture a thought, a plan or a memory."
            )
            .foregroundStyle(Theme.text)
            .frame(maxWidth: .infinity)
            .padding(.top, 40)
        } else {
            MasonryLayout(columns: 2, spacing: 16) {
                ForEach(visible) { entry in
                    let wide = isWide(entry)
                    NavigationLink(value: entry) {
                        EntryCard(entry: entry, isWide: wide)
                    }
                    .buttonStyle(.plain)
                    .contextMenu { contextMenu(for: entry) }
                    .masonrySpan(wide)
                }
            }
            .animation(.snappy, value: visible.map(\.id))
        }
    }

    private var newEntryButton: some View {
        Button {
            editorRequest = EditorRequest()
        } label: {
            Image(systemName: "plus")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(Theme.textInverse)
                .frame(width: 64, height: 64)
                .background(Theme.text, in: Circle())
                .shadow(color: .black.opacity(0.25), radius: 12, y: 6)
        }
        .padding(24)
        .accessibilityLabel("New entry")
    }

    @ViewBuilder
    private func contextMenu(for entry: JournalEntry) -> some View {
        Button(entry.isFavorite ? "Unfavorite" : "Favorite", systemImage: entry.isFavorite ? "heart.slash" : "heart") {
            entry.isFavorite.toggle()
        }
        Button(entry.isBookmarked ? "Remove Bookmark" : "Bookmark", systemImage: entry.isBookmarked ? "bookmark.slash" : "bookmark") {
            entry.isBookmarked.toggle()
        }
        Button("Edit", systemImage: "pencil") {
            editorRequest = EditorRequest(entry: entry)
        }
        Divider()
        Button("Delete", systemImage: "trash", role: .destructive) {
            withAnimation { modelContext.delete(entry) }
        }
    }

    // MARK: - Helpers

    private var sortedEntries: [JournalEntry] {
        switch sort {
        case .newest: entries
        case .oldest: entries.reversed()
        case .recentlyEdited: entries.sorted { $0.updatedAt > $1.updatedAt }
        }
    }

    /// Long text-only entries read better across the full width, like the
    /// "Tax payment" card in the design.
    private func isWide(_ entry: JournalEntry) -> Bool {
        entry.photoData == nil && entry.body.count > 120
    }
}

#Preview {
    HomeView()
        .modelContainer(PreviewContainer.shared)
}
