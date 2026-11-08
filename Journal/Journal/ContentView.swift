//
//  ContentView.swift
//  Journal
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI
import SwiftData
import LocalAuthentication

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.scenePhase) private var scenePhase

    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @AppStorage("appLockEnabled") private var appLockEnabled = false
    @AppStorage("didSeedSampleData") private var didSeedSampleData = false
    @AppStorage("appearance") private var appearance: AppAppearance = .system

    @State private var isUnlocked = false
    @State private var isAuthenticating = false

    var body: some View {
        ZStack {
            if !hasOnboarded {
                OnboardingView()
                    .transition(.opacity)
            } else {
                MainTabView()
                    .transition(.opacity)
            }

            if appLockEnabled && !isUnlocked && hasOnboarded {
                LockView(onUnlock: authenticate)
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut, value: hasOnboarded)
        .animation(.easeInOut, value: isUnlocked)
        .preferredColorScheme(appearance.colorScheme)
        .task {
            // Seed once, so erasing everything later doesn't bring the samples back.
            if !didSeedSampleData {
                SampleData.seedIfNeeded(in: modelContext)
                didSeedSampleData = true
            }
            if appLockEnabled { authenticate() }
        }
        .onChange(of: scenePhase) { _, phase in
            // Re-lock whenever the app leaves the foreground.
            if phase == .background { isUnlocked = false }
            if phase == .active, appLockEnabled, !isUnlocked { authenticate() }
        }
    }

    private func authenticate() {
        // Launch and scene activation can both ask to unlock; only prompt once.
        guard !isAuthenticating, !isUnlocked else { return }
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            // No biometrics or passcode set up — don't lock the user out.
            isUnlocked = true
            return
        }
        isAuthenticating = true
        Task {
            defer { isAuthenticating = false }
            let success = (try? await context.evaluatePolicy(
                .deviceOwnerAuthentication,
                localizedReason: "Unlock your journal"
            )) ?? false
            isUnlocked = success
        }
    }
}

struct MainTabView: View {
    var body: some View {
        TabView {
            Tab("Journal", systemImage: "book.pages") {
                HomeView()
            }
            Tab("Calendar", systemImage: "calendar") {
                CalendarView()
            }
            Tab("Insights", systemImage: "chart.line.uptrend.xyaxis") {
                InsightsView()
            }
            Tab("Settings", systemImage: "gearshape") {
                SettingsView()
            }
            Tab(role: .search) {
                SearchView()
            }
        }
        .tabBarMinimizeBehavior(.onScrollDown)
    }
}

struct LockView: View {
    let onUnlock: () -> Void

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            VStack(spacing: 24) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 44))
                    .foregroundStyle(.black)
                    .frame(width: 110, height: 110)
                    .background(CardColor.lemon.color, in: RoundedRectangle(cornerRadius: 32, style: .continuous))
                Text("Journal is locked")
                    .font(.title.weight(.bold))
                    .foregroundStyle(Theme.text)
                Button(action: onUnlock) {
                    Label("Unlock", systemImage: "faceid")
                        .font(.headline)
                        .foregroundStyle(Theme.textInverse)
                        .padding(.horizontal, 28)
                        .padding(.vertical, 14)
                        .background(Theme.text, in: Capsule())
                }
                .buttonStyle(.plain)
            }
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(PreviewContainer.shared)
}
