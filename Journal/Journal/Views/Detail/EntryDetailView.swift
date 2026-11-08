//
//  EntryDetailView.swift
//  Journal
//

import SwiftUI
import SwiftData
import PhotosUI

/// Full-page reading view for an entry, with quick actions in a floating bar.
struct EntryDetailView: View {
    @Bindable var entry: JournalEntry
    /// Opens the editor for an existing entry, or for a new one when `nil`.
    let onEdit: (JournalEntry?) -> Void

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    @State private var continueText = ""
    @State private var newItemText = ""
    @State private var isAddingItem = false
    @State private var photoItem: PhotosPickerItem?
    @State private var isConfirmingDelete = false
    @FocusState private var focus: Field?

    private enum Field { case continueWriting, newItem }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                header

                Text(entry.displayTitle)
                    .font(.system(size: 40, weight: .bold))
                    .lineSpacing(2)
                    .padding(.top, 12)

                metadata

                if let data = entry.photoData, let image = UIImage(data: data) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: 280)
                        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
                        .contextMenu {
                            Button("Remove Photo", systemImage: "trash", role: .destructive) {
                                withAnimation { entry.photoData = nil }
                            }
                        }
                }

                if !entry.body.isEmpty {
                    Text(entry.body)
                        .font(.body)
                        .lineSpacing(5)
                        .foregroundStyle(.black.opacity(0.85))
                        .textSelection(.enabled)
                }

                checklist

                continueField
            }
            .foregroundStyle(.black)
            .padding(.horizontal, 28)
            .padding(.bottom, 140)
        }
        .scrollIndicators(.hidden)
        .scrollDismissesKeyboard(.interactively)
        .background(entry.color.color.ignoresSafeArea())
        .overlay(alignment: .bottom) { actionBar }
        .toolbarVisibility(.hidden, for: .navigationBar)
        .toolbarVisibility(.hidden, for: .tabBar)
        // Pastel pages read as paper in both themes, like the reference design.
        .environment(\.colorScheme, .light)
        .onChange(of: photoItem) { _, item in
            Task { await loadPhoto(from: item) }
        }
        .confirmationDialog("Delete this entry?", isPresented: $isConfirmingDelete, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                modelContext.delete(entry)
                dismiss()
            }
        } message: {
            Text("This can't be undone.")
        }
    }

    // MARK: - Sections

    private var header: some View {
        HStack {
            CircleIconButton(systemImage: "chevron.left") { dismiss() }
                .accessibilityLabel("Back")
            Spacer()
            Menu {
                Button(entry.isFavorite ? "Unfavorite" : "Favorite", systemImage: entry.isFavorite ? "heart.fill" : "heart") {
                    entry.isFavorite.toggle()
                }
                Button(entry.isBookmarked ? "Remove Bookmark" : "Bookmark", systemImage: entry.isBookmarked ? "bookmark.fill" : "bookmark") {
                    entry.isBookmarked.toggle()
                }
                Menu("Color", systemImage: "paintpalette") {
                    ForEach(CardColor.allCases) { color in
                        Button(color.rawValue.capitalized) {
                            withAnimation { entry.color = color }
                        }
                    }
                }
                ShareLink(item: shareText, subject: Text(entry.displayTitle)) {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
                Divider()
                Button("Delete", systemImage: "trash", role: .destructive) {
                    isConfirmingDelete = true
                }
            } label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(.black)
                    .frame(width: 52, height: 52)
                    .background(Theme.paperButton, in: Circle())
            }
            .accessibilityLabel("More")
        }
        .padding(.top, 8)
    }

    private var metadata: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Label {
                    Text(entry.createdAt, format: .dateTime.weekday(.abbreviated).month().day().hour().minute())
                } icon: {
                    Image(systemName: "calendar")
                }
                Text("·")
                Text("\(entry.mood.emoji) \(entry.mood.label)")
                if entry.isFavorite {
                    Image(systemName: "heart.fill")
                }
            }
            .font(.footnote.weight(.medium))
            .foregroundStyle(.black.opacity(0.55))

            if !entry.tags.isEmpty {
                ScrollView(.horizontal) {
                    HStack(spacing: 6) {
                        ForEach(entry.tags, id: \.self) { tag in
                            Text("#\(tag)")
                                .font(.caption.weight(.semibold))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(.black.opacity(0.07), in: Capsule())
                        }
                    }
                }
                .scrollIndicators(.hidden)
            }
        }
    }

    @ViewBuilder
    private var checklist: some View {
        if !entry.checklist.isEmpty || isAddingItem {
            VStack(alignment: .leading, spacing: 10) {
                if !entry.checklist.isEmpty {
                    HStack {
                        Text("Checklist")
                            .font(.headline)
                        Spacer()
                        Text("\(entry.checklist.filter(\.isDone).count)/\(entry.checklist.count)")
                            .font(.subheadline.monospacedDigit())
                            .foregroundStyle(.black.opacity(0.5))
                    }
                }
                ForEach(entry.checklist) { item in
                    ChecklistPill(item: item, background: .black.opacity(0.06), font: .body) {
                        withAnimation(.snappy) { entry.toggleChecklistItem(item) }
                    }
                    .contextMenu {
                        Button("Delete", systemImage: "trash", role: .destructive) {
                            withAnimation { entry.checklist.removeAll { $0.id == item.id } }
                        }
                    }
                }
                if isAddingItem {
                    HStack(spacing: 10) {
                        Circle().strokeBorder(.black.opacity(0.4), lineWidth: 1.5)
                            .frame(width: 20, height: 20)
                        TextField("New item", text: $newItemText)
                            .focused($focus, equals: .newItem)
                            .submitLabel(.next)
                            .onSubmit(addItem)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .background(.black.opacity(0.04), in: Capsule())
                }
            }
        }
    }

    /// The "Tap here to continue" field from the design — text is appended to the body.
    private var continueField: some View {
        HStack(alignment: .firstTextBaseline, spacing: 10) {
            Capsule()
                .fill(.black)
                .frame(width: 2, height: 22)
            TextField("Tap here to continue", text: $continueText, axis: .vertical)
                .focused($focus, equals: .continueWriting)
                .foregroundStyle(.black)
            if !continueText.isEmpty {
                Button("Add", action: appendText)
                    .font(.subheadline.weight(.semibold))
                    .buttonStyle(.plain)
            }
        }
        .padding(.top, 8)
    }

    private var actionBar: some View {
        HStack(spacing: 10) {
            PhotosPicker(selection: $photoItem, matching: .images) {
                actionIcon("camera")
            }
            .accessibilityLabel("Add photo")

            Button { onEdit(entry) } label: { actionIcon("pencil") }
                .accessibilityLabel("Edit")

            ShareLink(item: shareText, subject: Text(entry.displayTitle)) {
                actionIcon("paperclip")
            }
            .accessibilityLabel("Share")

            Button {
                withAnimation(.snappy) { isAddingItem = true }
                focus = .newItem
            } label: { actionIcon("list.bullet") }
                .accessibilityLabel("Add checklist item")

            Button { onEdit(nil) } label: {
                Image(systemName: "plus")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundStyle(.white)
                    .frame(width: 64, height: 64)
                    .background(.black, in: Circle())
            }
            .accessibilityLabel("New entry")
        }
        .buttonStyle(.plain)
        .padding(6)
        .background(.black.opacity(0.07), in: Capsule())
        .background(.ultraThinMaterial, in: Capsule())
        .padding(.bottom, 12)
    }

    private func actionIcon(_ name: String) -> some View {
        Image(systemName: name)
            .font(.system(size: 20, weight: .medium))
            .foregroundStyle(.black)
            .frame(width: 56, height: 56)
            .background(.black.opacity(0.06), in: Circle())
    }

    // MARK: - Actions

    private var shareText: String {
        var parts = [entry.displayTitle]
        if !entry.body.isEmpty { parts.append(entry.body) }
        if !entry.checklist.isEmpty {
            parts.append(entry.checklist.map { "\($0.isDone ? "☑︎" : "☐") \($0.text)" }.joined(separator: "\n"))
        }
        return parts.joined(separator: "\n\n")
    }

    private func appendText() {
        let text = continueText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        entry.body = entry.body.isEmpty ? text : entry.body + "\n\n" + text
        entry.updatedAt = .now
        continueText = ""
        focus = nil
    }

    private func addItem() {
        let text = newItemText.trimmingCharacters(in: .whitespacesAndNewlines)
        if text.isEmpty {
            withAnimation { isAddingItem = false }
            return
        }
        withAnimation(.snappy) {
            entry.checklist.append(ChecklistItem(text: text))
        }
        entry.updatedAt = .now
        newItemText = ""
        focus = .newItem
    }

    private func loadPhoto(from item: PhotosPickerItem?) async {
        guard let item, let data = try? await item.loadTransferable(type: Data.self) else { return }
        withAnimation {
            entry.photoData = ImageProcessing.compressed(data)
            entry.updatedAt = .now
        }
        photoItem = nil
    }
}

#Preview {
    NavigationStack {
        EntryDetailView(entry: SampleData.makeEntries()[2]) { _ in }
    }
    .modelContainer(PreviewContainer.shared)
}
