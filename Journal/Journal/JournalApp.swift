//
//  JournalApp.swift
//  Journal
//
//  Created by Miftah on 11/8/26.
//

import SwiftUI
import SwiftData

@main
struct JournalApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: JournalEntry.self)
    }
}
