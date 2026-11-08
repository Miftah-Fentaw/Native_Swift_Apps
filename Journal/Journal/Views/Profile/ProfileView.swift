//
//  ProfileView.swift
//  Journal
//

import SwiftUI
import SwiftData
import PhotosUI

/// Profile management: photo, name, bio, weekly writing goal and a summary of
/// the user's journaling habits. Opened from the avatar on the home screen.
struct ProfileView: View {
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \JournalEntry.createdAt) private var entries: [JournalEntry]

    @AppStorage("userName") private var userName = ""
    @AppStorage("avatarData") private var avatarData: Data?
    @AppStorage("userBio") private var userBio = ""
    @AppStorage("weeklyGoal") private var weeklyGoal = 5

    @State private var avatarItem: PhotosPickerItem?
    @State private var isShowingPhotoPicker = false
    @State private var isConfirmingReset = false
    @FocusState private var focus: Field?

    private enum Field { case name, bio }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    avatarSection
                    detailsCard
                    statsGrid
                    goalCard
                    resetButton
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .scrollDismissesKeyboard(.interactively)
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done", systemImage: "checkmark") { dismiss() }
                }
            }
            .photosPicker(isPresented: $isShowingPhotoPicker, selection: $avatarItem, matching: .images)
            .onChange(of: avatarItem) { _, item in
                Task { await loadAvatar(from: item) }
            }
            .confirmationDialog("Reset your profile?", isPresented: $isConfirmingReset, titleVisibility: .visible) {
                Button("Reset Profile", role: .destructive, action: resetProfile)
            } message: {
                Text("Your name, photo, bio and goal will be cleared. Your entries are kept.")
            }
        }
    }

    // MARK: - Sections

    private var avatarSection: some View {
        VStack(spacing: 14) {
            Menu {
                Button("Choose Photo", systemImage: "photo.on.rectangle") {
                    isShowingPhotoPicker = true
                }
                if avatarData != nil {
                    Button("Remove Photo", systemImage: "trash", role: .destructive) {
                        withAnimation { avatarData = nil }
                    }
                }
            } label: {
                AvatarView(data: avatarData, name: userName, size: 120)
                    .overlay(alignment: .bottomTrailing) {
                        Image(systemName: "camera.fill")
                            .font(.footnote)
                            .foregroundStyle(Theme.textInverse)
                            .frame(width: 36, height: 36)
                            .background(Theme.text, in: Circle())
                            .overlay { Circle().strokeBorder(Theme.background, lineWidth: 3) }
                    }
            }
            .accessibilityLabel("Change profile photo")

            VStack(spacing: 4) {
                Text(userName.isEmpty ? "Your name" : userName)
                    .font(.title.weight(.bold))
                    .foregroundStyle(userName.isEmpty ? Theme.secondaryText : Theme.text)
                Text("Journaling since \(memberSince.formatted(.dateTime.month(.wide).year()))")
                    .font(.subheadline)
                    .foregroundStyle(Theme.secondaryText)
            }
        }
        .padding(.top, 12)
    }

    private var detailsCard: some View {
        VStack(alignment: .leading, spacing: 18) {
            field("Name") {
                TextField("What should we call you?", text: $userName)
                    .textContentType(.givenName)
                    .submitLabel(.next)
                    .focused($focus, equals: .name)
                    .onSubmit { focus = .bio }
            }
            Divider().overlay(Theme.separator)
            field("About me") {
                TextField("Why do you journal?", text: $userBio, axis: .vertical)
                    .lineLimit(2...5)
                    .focused($focus, equals: .bio)
            }
        }
        .padding(20)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous)
                .strokeBorder(Theme.separator)
        }
    }

    private func field<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.caption.weight(.semibold))
                .textCase(.uppercase)
                .foregroundStyle(Theme.secondaryText)
            content()
                .font(.body)
                .foregroundStyle(Theme.text)
        }
    }

    private var statsGrid: some View {
        Grid(horizontalSpacing: 12, verticalSpacing: 12) {
            GridRow {
                statTile(value: "\(entries.count)", label: "Entries", color: .peach)
                statTile(value: "\(JournalStats.currentStreak(entries))", label: "Day streak", color: .lemon)
            }
            GridRow {
                statTile(value: "\(JournalStats.longestStreak(entries))", label: "Best streak", color: .sky)
                statTile(value: topMoodText, label: "Most felt", color: .lavender)
            }
        }
    }

    private func statTile(value: String, label: String, color: CardColor) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value)
                .font(.system(size: 28, weight: .bold).monospacedDigit())
                .lineLimit(1)
                .minimumScaleFactor(0.6)
            Text(label)
                .font(.subheadline.weight(.medium))
                .opacity(0.65)
        }
        .foregroundStyle(.black)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(color.color, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    private var goalCard: some View {
        let done = JournalStats.entriesThisWeek(entries)

        return VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 20) {
                goalRing(done: done)
                VStack(alignment: .leading, spacing: 6) {
                    Text("Weekly goal")
                        .font(.headline)
                    Text(done >= weeklyGoal ? "Goal reached — nice work! 🎉" : "\(weeklyGoal - done) more to go this week")
                        .font(.subheadline)
                        .foregroundStyle(Theme.secondaryText)
                }
                Spacer(minLength: 0)
            }
            Divider().overlay(Theme.separator)
            Stepper(value: $weeklyGoal, in: 1...14) {
                Text("\(weeklyGoal) entries per week")
                    .font(.subheadline.weight(.medium))
            }
        }
        .foregroundStyle(Theme.text)
        .padding(20)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous)
                .strokeBorder(Theme.separator)
        }
    }

    private func goalRing(done: Int) -> some View {
        let progress = min(Double(done) / Double(max(weeklyGoal, 1)), 1)

        return ZStack {
            Circle()
                .stroke(Theme.separator, lineWidth: 10)
            Circle()
                .trim(from: 0, to: progress)
                .stroke(CardColor.mint.color, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.snappy, value: progress)
            VStack(spacing: 0) {
                Text("\(done)")
                    .font(.title2.weight(.bold).monospacedDigit())
                Text("of \(weeklyGoal)")
                    .font(.caption2)
                    .foregroundStyle(Theme.secondaryText)
            }
        }
        .frame(width: 88, height: 88)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(done) of \(weeklyGoal) entries this week")
    }

    private var resetButton: some View {
        Button(role: .destructive) {
            isConfirmingReset = true
        } label: {
            Text("Reset Profile")
                .font(.subheadline.weight(.semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .buttonStyle(.plain)
        .foregroundStyle(.red)
    }

    // MARK: - Helpers

    private var memberSince: Date {
        entries.first?.createdAt ?? .now
    }

    private var topMoodText: String {
        JournalStats.topMood(entries).map { "\($0.emoji) \($0.label)" } ?? "—"
    }

    private func loadAvatar(from item: PhotosPickerItem?) async {
        guard let item, let data = try? await item.loadTransferable(type: Data.self) else { return }
        withAnimation { avatarData = ImageProcessing.compressed(data, maxDimension: 400) }
        avatarItem = nil
    }

    private func resetProfile() {
        withAnimation {
            userName = ""
            avatarData = nil
            userBio = ""
            weeklyGoal = 5
        }
    }
}

#Preview {
    ProfileView()
        .modelContainer(PreviewContainer.shared)
}
