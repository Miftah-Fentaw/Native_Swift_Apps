//
//  EntryEditorView.swift
//  Journal
//

import SwiftUI
import SwiftData
import PhotosUI

/// Create or edit an entry. Changes are kept in local state and only written
/// to the model when the user taps Save, so Cancel truly discards them.
struct EntryEditorView: View {
    let entry: JournalEntry?
    var prompt: String?
    /// Day to file a new entry under (e.g. from the calendar). Keeps the current time of day.
    var initialDate: Date?

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    @State private var title = ""
    @State private var bodyText = ""
    @State private var date = Date.now
    @State private var mood: Mood = .calm
    @State private var color: CardColor = .sky
    @State private var checklist: [ChecklistItem] = []
    @State private var tags: [String] = []
    @State private var photoData: Data?

    @State private var newItemText = ""
    @State private var newTagText = ""
    @State private var photoItem: PhotosPickerItem?
    @State private var didLoad = false
    @FocusState private var focus: Field?

    private enum Field { case title, body, item, tag }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    if let prompt, entry == nil {
                        Label(prompt, systemImage: "sparkles")
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(.black.opacity(0.6))
                    }

                    TextField("Title", text: $title, axis: .vertical)
                        .font(.system(size: 34, weight: .bold))
                        .focused($focus, equals: .title)
                        .submitLabel(.next)
                        .onSubmit { focus = .body }

                    moodPicker
                    colorPicker

                    section("Your thoughts") {
                        TextField("Write freely…", text: $bodyText, axis: .vertical)
                            .lineLimit(6...)
                            .lineSpacing(4)
                            .focused($focus, equals: .body)
                    }

                    checklistEditor
                    photoSection
                    tagsEditor

                    section("Date") {
                        DatePicker("Entry date", selection: $date)
                            .labelsHidden()
                    }
                }
                .foregroundStyle(.black)
                .padding(24)
            }
            .scrollDismissesKeyboard(.interactively)
            .background(color.color.ignoresSafeArea())
            .animation(.easeInOut(duration: 0.25), value: color)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel", systemImage: "xmark") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save", systemImage: "checkmark", action: save)
                        .disabled(!canSave)
                }
            }
            .navigationTitle(entry == nil ? "New Entry" : "Edit Entry")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear(perform: load)
            .toolbarColorScheme(.light, for: .navigationBar)
            .onChange(of: photoItem) { _, item in
                Task { await loadPhoto(from: item) }
            }
        }
        .environment(\.colorScheme, .light)
    }

    // MARK: - Sections

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.footnote.weight(.semibold))
                .textCase(.uppercase)
                .foregroundStyle(.black.opacity(0.5))
            content()
        }
    }

    private var moodPicker: some View {
        section("How are you feeling?") {
            HStack(spacing: 8) {
                ForEach(Mood.allCases) { option in
                    Button {
                        withAnimation(.snappy) { mood = option }
                    } label: {
                        VStack(spacing: 4) {
                            Text(option.emoji)
                                .font(.system(size: 28))
                            Text(option.label)
                                .font(.caption2.weight(.medium))
                                .lineLimit(1)
                                .minimumScaleFactor(0.8)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(mood == option ? Color.black.opacity(0.12) : Color.black.opacity(0.04))
                        )
                        .scaleEffect(mood == option ? 1.05 : 1)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(option.label)
                    .accessibilityAddTraits(mood == option ? .isSelected : [])
                }
            }
        }
    }

    private var colorPicker: some View {
        section("Card color") {
            HStack(spacing: 12) {
                ForEach(CardColor.allCases) { option in
                    Button {
                        color = option
                    } label: {
                        Circle()
                            .fill(option.color)
                            .frame(width: 36, height: 36)
                            .overlay {
                                Circle().strokeBorder(.black.opacity(color == option ? 0.9 : 0.15), lineWidth: color == option ? 2.5 : 1)
                            }
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(option.rawValue.capitalized)
                    .accessibilityAddTraits(color == option ? .isSelected : [])
                }
            }
        }
    }

    private var checklistEditor: some View {
        section("Checklist") {
            VStack(spacing: 8) {
                ForEach($checklist) { $item in
                    HStack(spacing: 10) {
                        Button {
                            item.isDone.toggle()
                        } label: {
                            Image(systemName: item.isDone ? "largecircle.fill.circle" : "circle")
                                .font(.title3)
                        }
                        .buttonStyle(.plain)
                        TextField("Item", text: $item.text)
                        Button {
                            withAnimation { checklist.removeAll { $0.id == item.id } }
                        } label: {
                            Image(systemName: "minus.circle.fill")
                                .foregroundStyle(.black.opacity(0.35))
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Remove \(item.text)")
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(.black.opacity(0.06), in: Capsule())
                }

                HStack(spacing: 10) {
                    Image(systemName: "plus.circle")
                        .font(.title3)
                        .foregroundStyle(.black.opacity(0.5))
                    TextField("Add an item", text: $newItemText)
                        .focused($focus, equals: .item)
                        .submitLabel(.next)
                        .onSubmit(addItem)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(.black.opacity(0.03), in: Capsule())
            }
        }
    }

    private var photoSection: some View {
        section("Photo") {
            if let photoData, let image = UIImage(data: photoData) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(height: 200)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                    .overlay(alignment: .topTrailing) {
                        Button {
                            withAnimation { self.photoData = nil }
                        } label: {
                            Image(systemName: "xmark")
                                .font(.footnote.weight(.bold))
                                .foregroundStyle(.white)
                                .frame(width: 30, height: 30)
                                .background(.black.opacity(0.6), in: Circle())
                        }
                        .padding(10)
                        .accessibilityLabel("Remove photo")
                    }
            } else {
                PhotosPicker(selection: $photoItem, matching: .images) {
                    Label("Add a photo", systemImage: "camera")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 28)
                        .background {
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .strokeBorder(.black.opacity(0.2), style: StrokeStyle(lineWidth: 1.5, dash: [6, 5]))
                        }
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var tagsEditor: some View {
        section("Tags") {
            VStack(alignment: .leading, spacing: 10) {
                if !tags.isEmpty {
                    ScrollView(.horizontal) {
                        HStack(spacing: 6) {
                            ForEach(tags, id: \.self) { tag in
                                Button {
                                    withAnimation { tags.removeAll { $0 == tag } }
                                } label: {
                                    HStack(spacing: 4) {
                                        Text("#\(tag)")
                                        Image(systemName: "xmark")
                                            .font(.caption2.weight(.bold))
                                    }
                                    .font(.caption.weight(.semibold))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(.black.opacity(0.08), in: Capsule())
                                }
                                .buttonStyle(.plain)
                                .accessibilityLabel("Remove tag \(tag)")
                            }
                        }
                    }
                    .scrollIndicators(.hidden)
                }
                TextField("Add a tag", text: $newTagText)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .focused($focus, equals: .tag)
                    .submitLabel(.done)
                    .onSubmit(addTag)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(.black.opacity(0.03), in: Capsule())
            }
        }
    }

    // MARK: - Actions

    private var canSave: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty
            || !bodyText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            || !checklist.isEmpty
            || photoData != nil
    }

    private func load() {
        guard !didLoad else { return }
        didLoad = true
        if let entry {
            title = entry.title
            bodyText = entry.body
            date = entry.createdAt
            mood = entry.mood
            color = entry.color
            checklist = entry.checklist
            tags = entry.tags
            photoData = entry.photoData
        } else {
            color = CardColor.allCases.randomElement() ?? .sky
            if let initialDate, !Calendar.current.isDateInToday(initialDate) {
                let time = Calendar.current.dateComponents([.hour, .minute], from: .now)
                date = Calendar.current.date(
                    bySettingHour: time.hour ?? 12, minute: time.minute ?? 0, second: 0, of: initialDate
                ) ?? initialDate
            }
            focus = .title
        }
    }

    private func addItem() {
        let text = newItemText.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        withAnimation(.snappy) { checklist.append(ChecklistItem(text: text)) }
        newItemText = ""
        focus = .item
    }

    private func addTag() {
        let tag = newTagText
            .trimmingCharacters(in: .whitespaces)
            .trimmingCharacters(in: CharacterSet(charactersIn: "#"))
            .lowercased()
        guard !tag.isEmpty, !tags.contains(tag) else {
            newTagText = ""
            return
        }
        withAnimation { tags.append(tag) }
        newTagText = ""
        focus = .tag
    }

    private func loadPhoto(from item: PhotosPickerItem?) async {
        guard let item, let data = try? await item.loadTransferable(type: Data.self) else { return }
        withAnimation { photoData = ImageProcessing.compressed(data) }
        photoItem = nil
    }

    private func save() {
        // Pick up any text still sitting in the "add" fields.
        addItem()
        addTag()
        let cleanChecklist = checklist.filter { !$0.text.trimmingCharacters(in: .whitespaces).isEmpty }

        let target = entry ?? JournalEntry()
        target.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        target.body = bodyText.trimmingCharacters(in: .whitespacesAndNewlines)
        target.createdAt = date
        target.updatedAt = .now
        target.mood = mood
        target.color = color
        target.checklist = cleanChecklist
        target.tags = tags
        target.photoData = photoData

        if entry == nil {
            modelContext.insert(target)
        }
        dismiss()
    }
}

#Preview {
    EntryEditorView(entry: nil, prompt: "What made you smile today?")
        .modelContainer(PreviewContainer.shared)
}
