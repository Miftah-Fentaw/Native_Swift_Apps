//
//  MasonryLayout.swift
//  Journal
//

import SwiftUI

/// Places subviews into columns, always adding the next view to the shortest
/// column. Subviews can opt into spanning every column with `.masonrySpan()`.
struct MasonryLayout: Layout {
    var columns: Int = 2
    var spacing: CGFloat = 16

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? 360
        let frames = computeFrames(width: width, subviews: subviews)
        let height = frames.map(\.maxY).max() ?? 0
        return CGSize(width: width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let frames = computeFrames(width: bounds.width, subviews: subviews)
        for (subview, frame) in zip(subviews, frames) {
            subview.place(
                at: CGPoint(x: bounds.minX + frame.minX, y: bounds.minY + frame.minY),
                proposal: ProposedViewSize(frame.size)
            )
        }
    }

    private func computeFrames(width: CGFloat, subviews: Subviews) -> [CGRect] {
        let columnWidth = (width - spacing * CGFloat(columns - 1)) / CGFloat(columns)
        var heights = Array(repeating: CGFloat(0), count: columns)
        var frames: [CGRect] = []

        for subview in subviews {
            if subview[MasonrySpanKey.self] {
                // Full-width view starts below the tallest column.
                let top = heights.max() ?? 0
                let size = subview.sizeThatFits(ProposedViewSize(width: width, height: nil))
                frames.append(CGRect(x: 0, y: top, width: width, height: size.height))
                heights = Array(repeating: top + size.height + spacing, count: columns)
            } else {
                let column = heights.indices.min { heights[$0] < heights[$1] } ?? 0
                let size = subview.sizeThatFits(ProposedViewSize(width: columnWidth, height: nil))
                let x = CGFloat(column) * (columnWidth + spacing)
                frames.append(CGRect(x: x, y: heights[column], width: columnWidth, height: size.height))
                heights[column] += size.height + spacing
            }
        }
        return frames
    }
}

nonisolated private struct MasonrySpanKey: LayoutValueKey {
    static let defaultValue = false
}

extension View {
    /// Makes this view span all columns of a `MasonryLayout`.
    func masonrySpan(_ spans: Bool = true) -> some View {
        layoutValue(key: MasonrySpanKey.self, value: spans)
    }
}
