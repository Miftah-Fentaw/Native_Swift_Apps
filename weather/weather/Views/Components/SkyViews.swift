//
//  SkyViews.swift
//  weather
//

import SwiftUI

/// Blue sky gradient that fades into the app background.
struct SkyBackground: View {
    var body: some View {
        LinearGradient(
            stops: [
                .init(color: Theme.skyTop, location: 0),
                .init(color: Theme.skyMiddle, location: 0.28),
                .init(color: Theme.background, location: 0.55)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()
    }
}

/// Glowing sun illustration.
struct SunView: View {
    var size: CGFloat = 56

    var body: some View {
        Circle()
            .fill(
                RadialGradient(
                    colors: [Color(red: 1, green: 0.85, blue: 0.35), Color(red: 1, green: 0.66, blue: 0.15)],
                    center: .init(x: 0.4, y: 0.35),
                    startRadius: 0,
                    endRadius: size * 0.6
                )
            )
            .frame(width: size, height: size)
            .shadow(color: Color(red: 1, green: 0.8, blue: 0.3).opacity(0.8), radius: size * 0.35)
            .accessibilityHidden(true)
    }
}

/// Soft decorative cloud.
struct CloudView: View {
    var width: CGFloat = 70

    var body: some View {
        Image(systemName: "cloud.fill")
            .font(.system(size: width))
            .foregroundStyle(.white.opacity(0.85))
            .blur(radius: 1.5)
            .accessibilityHidden(true)
    }
}

/// Dashed arc showing the sun's progress between sunrise and sunset.
struct SunArc: View {
    /// 0 = sunrise, 1 = sunset.
    var progress: Double

    var body: some View {
        GeometryReader { proxy in
            let rect = CGRect(origin: .zero, size: proxy.size)
            let point = ArcShape.point(at: progress, in: rect)
            ZStack(alignment: .topLeading) {
                ArcShape()
                    .stroke(.white.opacity(0.8), style: StrokeStyle(lineWidth: 1.5, lineCap: .round, dash: [4, 5]))
                Circle()
                    .fill(.white)
                    .frame(width: 18, height: 18)
                    .shadow(color: .white, radius: 6)
                    .position(point)
            }
        }
        .accessibilityHidden(true)
    }
}

/// Quadratic curve from bottom-left to bottom-right whose apex touches the top of the rect.
struct ArcShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addQuadCurve(to: CGPoint(x: rect.maxX, y: rect.maxY), control: Self.control(in: rect))
        return path
    }

    /// The control point sits one height above the rect so the curve's apex is at `minY`.
    private static func control(in rect: CGRect) -> CGPoint {
        CGPoint(x: rect.midX, y: rect.minY - rect.height)
    }

    /// Point on the quadratic Bézier at parameter `t`.
    static func point(at t: Double, in rect: CGRect) -> CGPoint {
        let start = CGPoint(x: rect.minX, y: rect.maxY)
        let end = CGPoint(x: rect.maxX, y: rect.maxY)
        let control = control(in: rect)
        let u = 1 - t
        return CGPoint(
            x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
            y: u * u * start.y + 2 * u * t * control.y + t * t * end.y
        )
    }
}
