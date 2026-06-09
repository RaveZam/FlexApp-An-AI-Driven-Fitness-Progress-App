import ActivityKit
import Foundation

// Shared between the app target (to start/update/end the Activity from the
// Expo module) and the widget extension (to render it). Add this file's
// target membership to BOTH "flexapp" and "RestActivityWidget".
struct RestActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    // Absolute end time of the rest period. iOS renders the live countdown
    // from this date, so no per-second updates are needed.
    var endsAt: Date
  }

  // Static label shown for the whole life of the activity.
  var title: String
}
