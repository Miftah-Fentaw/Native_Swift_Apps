//
//  EntryCard.swift
//  Journal
//

import SwiftUI

/// The pastel card shown on the home grid. Adapts to the entry's content:
/// photo entries show the image, checklist entries show tappable pills.
struct EntryCard: View {
    let entry: JournalEntry
    var isWide = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .top) {
                Text(entry.displayTitle)
                    .font(.system(isWide ? .title3 : .headline, weight: .bold))
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 4)
                if entry.isFavorite {
                    Image(systemName: "heart.fill")
                        .font(.caption)
                        .foregroundStyle(.black.opacity(0.55))
                }
            }

            if !entry.body.isEmpty {
                Text(entry.body)
                    .font(.subheadline)
                    .foregroundStyle(.black.opacity(0.75))
                    .lineLimit(isWide ? 4 : 5)
                    .multilineTextAlignment(.leading)
            }

            if !entry.checklist.isEmpty {
                VStack(spacing: 8) {
                    ForEach(entry.checklist.prefix(isWide ? 3 : 4)) { item in
                        ChecklistPill(item: item, background: entry.color.accent) {
                            withAnimation(.snappy) { entry.toggleChecklistItem(item) }
                        }
                    }
                }
            }

            if let data = entry.photoData, let image = UIImage(data: data) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(height: isWide ? 160 : 130)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            }

            HStack(spacing: 6) {
                Text(entry.mood.emoji)
                Text(entry.createdAt, format: .dateTime.month(.abbreviated).day())
                    .font(.caption.weight(.medium))
                    .foregroundStyle(.black.opacity(0.5))
                Spacer()
                if entry.isBookmarked {
                    Image(systemName: "bookmark.fill")
                        .font(.caption)
                        .foregroundStyle(.black.opacity(0.55))
                }
            }
            .padding(.top, 2)
        }
        .foregroundStyle(.black)
        .padding(isWide ? 24 : 20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(entry.color.color, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        .contentShape(RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        // Lifts pale cards off the light background; invisible on dark.
        .shadow(color: .black.opacity(0.06), radius: 10, y: 4)
        .accessibilityElement(children: .combine)
    }
}

/// Rounded pill with a radio-style indicator, as in "Plan for the today".
struct ChecklistPill: View {
    let item: ChecklistItem
    var background: Color = .black.opacity(0.06)
    var font: Font = .footnote
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                ZStack {
                    Circle().strokeBorder(.black, lineWidth: 1.5)
                    if item.isDone {
                        Circle().fill(.black).padding(4)
                    }
                }
                .frame(width: 20, height: 20)

                Text(item.text)
                    .font(font)
                    .strikethrough(item.isDone, color: .black.opacity(0.5))
                    .foregroundStyle(.black.opacity(item.isDone ? 0.55 : 0.9))
                    .lineLimit(1)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(background, in: Capsule())
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(item.text)
        .accessibilityValue(item.isDone ? "Done" : "Not done")
        .accessibilityAddTraits(.isButton)
    }
}
