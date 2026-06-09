import ActivityKit
import SwiftUI
import WidgetKit

private let accent = Color(red: 0.063, green: 0.725, blue: 0.506) // #10b981

@available(iOS 16.2, *)
struct RestActivityLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: RestActivityAttributes.self) { context in
      // Lock screen / banner presentation.
      LockScreenView(context: context)
        .padding(16)
        .activityBackgroundTint(Color.black.opacity(0.85))
        .activitySystemActionForegroundColor(accent)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Label("Resting", systemImage: "dumbbell.fill")
            .foregroundStyle(accent)
            .font(.caption)
        }
        DynamicIslandExpandedRegion(.trailing) {
          countdown(context: context)
            .font(.system(size: 22, weight: .bold, design: .rounded))
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
      } compactLeading: {
        Image(systemName: "dumbbell.fill").foregroundStyle(accent)
      } compactTrailing: {
        countdown(context: context)
          .font(.system(size: 14, weight: .semibold, design: .rounded))
          .foregroundStyle(.white)
          .frame(width: 44)
      } minimal: {
        Image(systemName: "dumbbell.fill").foregroundStyle(accent)
      }
      .widgetURL(URL(string: "flexapp://"))
    }
  }
}

@available(iOS 16.2, *)
private struct LockScreenView: View {
  let context: ActivityViewContext<RestActivityAttributes>

  var body: some View {
    HStack(spacing: 14) {
      Image(systemName: "dumbbell.fill")
        .font(.title2)
        .foregroundStyle(accent)
      VStack(alignment: .leading, spacing: 2) {
        Text(context.attributes.title)
          .font(.caption)
          .fontWeight(.semibold)
          .foregroundStyle(.white.opacity(0.6))
        Text("Prepare for next set")
          .font(.caption2)
          .foregroundStyle(.white.opacity(0.35))
      }
      Spacer()
      countdown(context: context)
        .font(.system(size: 34, weight: .bold, design: .rounded))
        .foregroundStyle(.white)
        .monospacedDigit()
    }
  }
}

// Self-ticking countdown rendered by the system from the end date.
@available(iOS 16.2, *)
@ViewBuilder
private func countdown(context: ActivityViewContext<RestActivityAttributes>) -> some View {
  Text(timerInterval: Date.now...context.state.endsAt, countsDown: true)
    .multilineTextAlignment(.trailing)
}
