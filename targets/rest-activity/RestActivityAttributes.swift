import ActivityKit
import Foundation

// Must stay byte-for-byte identical to the copy compiled into the app target
// (modules/rest-activity/ios/RestActivityAttributes.swift). ActivityKit matches
// the activity between app and widget by this struct's shape.
struct RestActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    // Absolute end time of the rest period. iOS renders the live countdown
    // from this date, so no per-second updates are needed.
    var endsAt: Date
  }

  // Static label shown for the whole life of the activity.
  var title: String
}
