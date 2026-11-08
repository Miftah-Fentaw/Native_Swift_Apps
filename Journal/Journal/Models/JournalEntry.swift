//
//  JournalEntry.swift
//  Journal
//

import Foundation
import SwiftData

/// A single item in an entry's checklist (e.g. "Buy food").
nonisolated struct ChecklistItem: Codable, Hashable, Identifiable, Sendable {
    var id = UUID()
    var text: String
    var isDone = false
}

/// A journal entry. Entries can mix free text, a checklist and a photo.
@Model
final class JournalEntry {
    var id: UUID = UUID()
    var title: String = ""
    var body: String = ""
    var createdAt: Date = Date.now
    var updatedAt: Date = Date.now
    var colorRaw: String = CardColor.sky.rawValue
    var moodRaw: String = Mood.calm.rawValue
    var isFavorite: Bool = false
    var isBookmarked: Bool = false
    var checklist: [ChecklistItem] = []
    var tags: [String] = []

    /// Photos can be large, so let SwiftData keep them outside the database file.
    @Attribute(.externalStorage) var photoData: Data?

    init(
        title: String = "",
        body: String = "",
        createdAt: Date = .now,
        color: CardColor = .sky,
        mood: Mood = .calm,
        isFavorite: Bool = false,
        isBookmarked: Bool = false,
        checklist: [ChecklistItem] = [],
        tags: [String] = [],
        photoData: Data? = nil
    ) {
        self.title = title
        self.body = body
        self.createdAt = createdAt
        self.updatedAt = createdAt
        self.colorRaw = color.rawValue
        self.moodRaw = mood.rawValue
        self.isFavorite = isFavorite
        self.isBookmarked = isBookmarked
        self.checklist = checklist
        self.tags = tags
        self.photoData = photoData
    }

    var color: CardColor {
        get { CardColor(rawValue: colorRaw) ?? .sky }
        set { colorRaw = newValue.rawValue }
    }

    var mood: Mood {
        get { Mood(rawValue: moodRaw) ?? .calm }
        set { moodRaw = newValue.rawValue }
    }

    var displayTitle: String {
        title.isEmpty ? "Untitled" : title
    }

    var wordCount: Int {
        body.split { $0.isWhitespace || $0.isNewline }.count
    }

    func toggleChecklistItem(_ item: ChecklistItem) {
        guard let index = checklist.firstIndex(where: { $0.id == item.id }) else { return }
        checklist[index].isDone.toggle()
        updatedAt = .now
    }
}
