//
//  OnboardingView.swift
//  Journal
//

import SwiftUI

/// First-launch welcome flow: a few intro pages, then asks for the user's name.
struct OnboardingView: View {
    @AppStorage("userName") private var userName = ""
    @AppStorage("hasOnboarded") private var hasOnboarded = false

    @State private var page = 0
    @State private var name = ""
    @FocusState private var nameFocused: Bool

    private struct Page {
        let emoji: String
        let title: String
        let message: String
        let color: CardColor
    }

    private let pages = [
        Page(emoji: "📓", title: "Your space\nto think", message: "Capture thoughts, plans and memories on beautiful cards.", color: .peach),
        Page(emoji: "✅", title: "Plans and\nchecklists", message: "Turn any entry into a checklist and tick things off as you go.", color: .lemon),
        Page(emoji: "📈", title: "Know yourself\nbetter", message: "Track your mood and build a daily writing streak.", color: .sky)
    ]

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 0) {
                TabView(selection: $page) {
                    ForEach(pages.indices, id: \.self) { index in
                        pageView(pages[index]).tag(index)
                    }
                    namePage.tag(pages.count)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                HStack {
                    HStack(spacing: 6) {
                        ForEach(0...pages.count, id: \.self) { index in
                            Capsule()
                                .fill(Theme.text.opacity(index == page ? 1 : 0.3))
                                .frame(width: index == page ? 24 : 8, height: 8)
                        }
                    }
                    .animation(.snappy, value: page)
                    .accessibilityHidden(true)

                    Spacer()

                    Button(action: next) {
                        HStack(spacing: 8) {
                            Text(page == pages.count ? "Let's go" : "Next")
                            Image(systemName: "arrow.right")
                        }
                        .font(.headline)
                        .foregroundStyle(Theme.textInverse)
                        .padding(.horizontal, 26)
                        .padding(.vertical, 16)
                        .background(Theme.text, in: Capsule())
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 28)
                .padding(.bottom, 24)
            }
        }
        .foregroundStyle(Theme.text)
    }

    private func pageView(_ page: Page) -> some View {
        VStack(alignment: .leading, spacing: 24) {
            Spacer()
            Text(page.emoji)
                .font(.system(size: 80))
                .frame(width: 160, height: 160)
                .background(page.color.color, in: RoundedRectangle(cornerRadius: 44, style: .continuous))
                .rotationEffect(.degrees(-6))
                .accessibilityHidden(true)
            Text(page.title)
                .font(.system(size: 46, weight: .bold))
            Text(page.message)
                .font(.title3)
                .foregroundStyle(Theme.secondaryText)
            Spacer()
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 28)
    }

    private var namePage: some View {
        VStack(alignment: .leading, spacing: 24) {
            Spacer()
            Text("What should\nwe call you?")
                .font(.system(size: 46, weight: .bold))
            TextField("", text: $name, prompt: Text("Your name").foregroundStyle(Theme.text.opacity(0.35)))
                .font(.title.weight(.semibold))
                .textContentType(.givenName)
                .submitLabel(.done)
                .focused($nameFocused)
                .onSubmit(next)
                .padding(.vertical, 12)
                .overlay(alignment: .bottom) {
                    Rectangle().fill(Theme.text.opacity(0.4)).frame(height: 1.5)
                }
            Spacer()
            Spacer()
        }
        .padding(.horizontal, 28)
        .onAppear {
            name = userName
            nameFocused = true
        }
    }

    private func next() {
        if page < pages.count {
            withAnimation(.snappy) { page += 1 }
        } else {
            let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmed.isEmpty { userName = trimmed }
            withAnimation { hasOnboarded = true }
        }
    }
}

#Preview {
    OnboardingView()
}
