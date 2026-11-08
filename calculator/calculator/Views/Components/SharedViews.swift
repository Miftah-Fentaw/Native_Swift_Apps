//
//  SharedViews.swift
//  calculator
//

import SwiftUI

/// Thin accent-colored text cursor that blinks.
struct BlinkingCursor: View {
    var height: CGFloat = 38
    @State private var isVisible = true

    var body: some View {
        RoundedRectangle(cornerRadius: 1)
            .fill(Color.appAccent)
            .frame(width: 2.5, height: height)
            .opacity(isVisible ? 1 : 0)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.55).repeatForever()) {
                    isVisible = false
                }
            }
            .accessibilityHidden(true)
    }
}

/// Round, quiet icon button used in headers. `isActive` tints it with the accent.
struct IconButtonStyle: ButtonStyle {
    var isActive = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 18, weight: .regular))
            .foregroundStyle(isActive ? Color.appAccent : Color.primary)
            .frame(width: 40, height: 40)
            .background(
                Circle().fill(
                    isActive
                        ? Color.appAccent.opacity(0.15)
                        : Color.primary.opacity(configuration.isPressed ? 0.1 : 0)
                )
            )
            .contentShape(Circle())
    }
}

/// Capsule chip used for tip presets and converter categories.
struct ChipButton: View {
    let title: String
    var systemImage: String?
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let systemImage {
                    Image(systemName: systemImage)
                        .font(.caption)
                }
                Text(title)
            }
            .font(.subheadline.weight(.medium))
            .padding(.horizontal, 14)
            .padding(.vertical, 7)
            .foregroundStyle(isSelected ? Color(.systemBackground) : Color.primary)
            .background(
                Capsule().fill(isSelected ? Color.appAccent : Color.primary.opacity(0.06))
            )
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}
