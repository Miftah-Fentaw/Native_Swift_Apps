//
//  SettingsView.swift
//  Journal
//

import SwiftUI
import SwiftData
import PhotosUI
import UserNotifications

struct SettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \JournalEntry.createdAt) private var entries: [JournalEntry]

    @AppStorage("userName") private var userName = ""
    @AppStorage("avatarData") private var avatarData: Data?
    @AppStorage("appLockEnabled") private var appLockEnabled = false
    @AppStorage("reminderEnabled") private var reminderEnabled = false
    @AppStorage("reminderTime") private var reminderTime = Self.defaultReminderTime
    @AppStorage("hasOnboarded") private var hasOnboarded = true
    @AppStorage("appearance") private var appearance: AppAppearance = .system

    @State private var avatarItem: PhotosPickerItem?
    @State private var isConfirmingErase = false
    @State private var notificationsDenied = false

    /// 9 PM today, stored as a time interval so it fits in AppStorage.
    static var defaultReminderTime: Double {
        let date = Calendar.current.date(bySettingHour: 21, minute: 0, second: 0, of: .now) ?? .now
        return date.timeIntervalSinceReferenceDate
    }

    var body: some View {
        NavigationStack {
            Form {
                profileSection
                appearanceSection
                remindersSection
                privacySection
                dataSection
                aboutSection
            }
            .scrollContentBackground(.hidden)
            .background(Theme.groupedBackground.ignoresSafeArea())
            .navigationTitle("Settings")
            .onChange(of: avatarItem) { _, item in
                Task {
                    guard let item, let data = try? await item.loadTransferable(type: Data.self) else { return }
                    avatarData = ImageProcessing.compressed(data, maxDimension: 400)
                    avatarItem = nil
                }
            }
            .confirmationDialog("Erase all entries?", isPresented: $isConfirmingErase, titleVisibility: .visible) {
                Button("Erase \(entries.count) Entries", role: .destructive) {
                    try? modelContext.delete(model: JournalEntry.self)
                }
            } message: {
                Text("This permanently deletes everything in your journal.")
            }
        }
    }

    // MARK: - Sections

    private var profileSection: some View {
        Section {
            HStack(spacing: 16) {
                PhotosPicker(selection: $avatarItem, matching: .images) {
                    AvatarView(data: avatarData, name: userName, size: 72)
                        .overlay(alignment: .bottomTrailing) {
                            Image(systemName: "camera.fill")
                                .font(.caption2)
                                .foregroundStyle(.white)
                                .padding(6)
                                .background(.black, in: Circle())
                        }
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Change profile photo")

                VStack(alignment: .leading, spacing: 4) {
                    TextField("Your name", text: $userName)
                        .font(.title3.weight(.semibold))
                        .textContentType(.givenName)
                    Text("\(entries.count) entries since \(firstEntryDate.formatted(.dateTime.month(.wide).year()))")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.vertical, 6)
            if avatarData != nil {
                Button("Remove Photo", role: .destructive) { avatarData = nil }
            }
        }
    }

    private var appearanceSection: some View {
        Section("Appearance") {
            HStack(spacing: 12) {
                ForEach(AppAppearance.allCases) { option in
                    AppearanceTile(option: option, isSelected: appearance == option) {
                        withAnimation(.easeInOut) { appearance = option }
                    }
                }
            }
            .padding(.vertical, 6)
        }
    }

    private var remindersSection: some View {
        Section {
            Toggle("Daily reminder", systemImage: "bell.badge", isOn: $reminderEnabled)
            if reminderEnabled {
                DatePicker(
                    "Time",
                    selection: Binding(
                        get: { Date(timeIntervalSinceReferenceDate: reminderTime) },
                        set: { reminderTime = $0.timeIntervalSinceReferenceDate }
                    ),
                    displayedComponents: .hourAndMinute
                )
            }
        } header: {
            Text("Reminders")
        } footer: {
            if notificationsDenied {
                Text("Notifications are turned off for Journal. Enable them in the Settings app.")
            } else {
                Text("A gentle nudge to write every day.")
            }
        }
        .onChange(of: reminderEnabled) { Task { await updateReminder() } }
        .onChange(of: reminderTime) { Task { await updateReminder() } }
    }

    private var privacySection: some View {
        Section {
            Toggle("Lock with Face ID", systemImage: "faceid", isOn: $appLockEnabled)
        } header: {
            Text("Privacy")
        } footer: {
            Text("Your journal stays on this device. Locking requires Face ID or your passcode to open the app.")
        }
    }

    private var dataSection: some View {
        Section("Your data") {
            ShareLink(item: exportText, subject: Text("My Journal"), preview: SharePreview("My Journal")) {
                Label("Export as Text", systemImage: "square.and.arrow.up")
            }
            .disabled(entries.isEmpty)
            Button("Add Sample Entries", systemImage: "wand.and.stars") {
                SampleData.makeEntries().forEach { modelContext.insert($0) }
            }
            Button("Erase All Entries", systemImage: "trash", role: .destructive) {
                isConfirmingErase = true
            }
            .disabled(entries.isEmpty)
        }
    }

    private var aboutSection: some View {
        Section("About") {
            Button("Show Welcome Screen", systemImage: "sparkles") { hasOnboarded = false }
            LabeledContent("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
        }
    }

    // MARK: - Helpers

    private var firstEntryDate: Date {
        entries.first?.createdAt ?? .now
    }

    private var exportText: String {
        entries.map { entry in
            var lines = [
                "# \(entry.displayTitle)",
                "\(entry.createdAt.formatted(date: .complete, time: .shortened)) · \(entry.mood.emoji) \(entry.mood.label)"
            ]
            if !entry.body.isEmpty { lines.append(entry.body) }
            lines += entry.checklist.map { "- [\($0.isDone ? "x" : " ")] \($0.text)" }
            if !entry.tags.isEmpty { lines.append(entry.tags.map { "#\($0)" }.joined(separator: " ")) }
            return lines.joined(separator: "\n\n")
        }
        .joined(separator: "\n\n---\n\n")
    }

    private func updateReminder() async {
        let center = UNUserNotificationCenter.current()
        let identifier = "daily-journal-reminder"
        center.removePendingNotificationRequests(withIdentifiers: [identifier])
        guard reminderEnabled else { return }

        let granted = (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
        guard granted else {
            notificationsDenied = true
            reminderEnabled = false
            return
        }
        notificationsDenied = false

        let content = UNMutableNotificationContent()
        content.title = "Time to journal ✍️"
        content.body = DailyPromptCard.prompts.randomElement() ?? "How was your day?"
        content.sound = .default

        let time = Calendar.current.dateComponents([.hour, .minute], from: Date(timeIntervalSinceReferenceDate: reminderTime))
        let trigger = UNCalendarNotificationTrigger(dateMatching: time, repeats: true)
        try? await center.add(UNNotificationRequest(identifier: identifier, content: content, trigger: trigger))
    }
}

/// A mini mock-up of the home screen in a given appearance.
private struct AppearanceTile: View {
    let option: AppAppearance
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                preview
                    .frame(height: 96)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .strokeBorder(isSelected ? Color.accentColor : Theme.separator, lineWidth: isSelected ? 2.5 : 1)
                    }
                Label(option.title, systemImage: option.systemImage)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(isSelected ? Theme.text : Theme.secondaryText)
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(option.title)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }

    @ViewBuilder
    private var preview: some View {
        switch option {
        case .light: miniHome(scheme: .light)
        case .dark: miniHome(scheme: .dark)
        case .system:
            // Half light, half dark.
            HStack(spacing: 0) {
                miniHome(scheme: .light)
                miniHome(scheme: .dark)
            }
        }
    }

    private func miniHome(scheme: ColorScheme) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Capsule().fill(Theme.text).frame(width: 28, height: 5)
            HStack(alignment: .top, spacing: 4) {
                RoundedRectangle(cornerRadius: 5).fill(CardColor.peach.color).frame(height: 30)
                RoundedRectangle(cornerRadius: 5).fill(CardColor.lemon.color).frame(height: 40)
            }
            RoundedRectangle(cornerRadius: 5).fill(CardColor.sky.color).frame(height: 18)
            Spacer(minLength: 0)
        }
        .padding(8)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(Theme.background)
        .environment(\.colorScheme, scheme)
    }
}

#Preview {
    SettingsView()
        .modelContainer(PreviewContainer.shared)
}
