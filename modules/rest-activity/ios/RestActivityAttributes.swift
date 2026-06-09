import ActivityKit
import Foundation

// Must stay structurally identical to the copy in
// ios/RestActivityWidget/RestActivityAttributes.swift. This copy is compiled
// into the module (which requests the Activity); the widget copy renders it.
// ActivityKit matches the two by type name across the separate Swift modules.
struct RestActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var endsAt: Date
  }

  var title: String
}
