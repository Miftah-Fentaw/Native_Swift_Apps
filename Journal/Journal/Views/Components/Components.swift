//
//  Components.swift
//  Journal
//

import SwiftUI
import SwiftData

/// Round profile picture, falling back to the user's initial.
struct AvatarView: View {
    let data: Data?
    let name: String
    var size: CGFloat = 56

    var body: some View {
        Group {
            if let data, let image = UIImage(data: data) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
            } else {
                ZStack {
                    LinearGradient(
                        colors: [CardColor.peach.color, CardColor.lemon.color],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    Text(initial)
                        .font(.system(size: size * 0.42, weight: .bold))
                        .foregroundStyle(.black)
                }
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .accessibilityHidden(true)
    }

    private var initial: String {
        name.first.map { String($0).uppercased() } ?? "☺︎"
    }
}

struct EmptyStateView: View {
    let systemImage: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: systemImage)
                .font(.system(size: 44))
                .opacity(0.6)
            Text(title)
                .font(.title3.weight(.semibold))
            Text(message)
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .opacity(0.6)
        }
        .padding()
    }
}

/// A rotating writing prompt shown at the top of the home screen.
struct DailyPromptCard: View {
    let onWrite: (String) -> Void

    static let prompts = [
        "What made you smile today?",
        "Name three things you're grateful for.",
        "What's one thing you'd like to let go of?",
        "Describe a small win from this week.",
        "Who made a difference to your day, and how?",
        "What would make tomorrow great?",
        "What are you looking forward to?",
        "Write a letter to your future self.",
        "What did you learn about yourself recently?",
        "Where do you feel most at peace?"
    ]

    @State private var index = Calendar.current.ordinality(of: .day, in: .year, for: .now) ?? 0

    private var prompt: String {
        Self.prompts[index % Self.prompts.count]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Label("Today's prompt", systemImage: "sparkles")
                    .font(.caption.weight(.semibold))
                    .textCase(.uppercase)
                    .foregroundStyle(Theme.secondaryText)
                Spacer()
                Button {
                    withAnimation(.snappy) { index += 1 }
                } label: {
                    Image(systemName: "arrow.triangle.2.circlepath")
                        .foregroundStyle(Theme.secondaryText)
                }
                .accessibilityLabel("Another prompt")
            }

            Text(prompt)
                .font(.title3.weight(.semibold))
                .foregroundStyle(Theme.text)
                .contentTransition(.opacity)
                .id(prompt)

            Button {
                onWrite(prompt)
            } label: {
                HStack {
                    Text("Start writing")
                    Image(systemName: "arrow.right")
                }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Theme.textInverse)
                .padding(.horizontal, 18)
                .padding(.vertical, 10)
                .background(Theme.text, in: Capsule())
            }
            .buttonStyle(.plain)
        }
        .padding(22)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.cardRadius, style: .continuous)
                .strokeBorder(Theme.separator)
        }
    }
}

/// In-memory container with sample data for SwiftUI previews.
enum PreviewContainer {
    static let shared: ModelContainer = {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        // Force unwrap is acceptable here: previews can't recover from a broken container.
        let container = try! ModelContainer(for: JournalEntry.self, configurations: config)
        SampleData.seedIfNeeded(in: container.mainContext)
        return container
    }()
}

enum ImageProcessing {
    /// Downsizes picked photos so entries stay light in storage.
    static func compressed(_ data: Data, maxDimension: CGFloat = 1600) -> Data {
        guard let image = UIImage(data: data) else { return data }
        let longest = max(image.size.width, image.size.height)
        guard longest > maxDimension else { return image.jpegData(compressionQuality: 0.8) ?? data }
        let scale = maxDimension / longest
        let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)
        let resized = image.preparingThumbnail(of: size) ?? image
        return resized.jpegData(compressionQuality: 0.8) ?? data
    }
}
