import ActivityKit
import ExpoModulesCore

public class RestActivityModule: Module {
  // Held as Any? because Activity<…> is gated behind iOS 16.2 availability.
  private var currentActivity: Any?

  public func definition() -> ModuleDefinition {
    Name("RestActivity")

    Function("isSupported") { () -> Bool in
      if #available(iOS 16.2, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      }
      return false
    }

    Function("start") { (endsAtMs: Double, title: String) in
      guard #available(iOS 16.2, *) else { return }
      self.startActivity(endsAtMs: endsAtMs, title: title)
    }

    Function("update") { (endsAtMs: Double) in
      guard #available(iOS 16.2, *) else { return }
      self.updateActivity(endsAtMs: endsAtMs)
    }

    Function("end") {
      guard #available(iOS 16.2, *) else { return }
      self.endActivity()
    }
  }

  @available(iOS 16.2, *)
  private func startActivity(endsAtMs: Double, title: String) {
    // Only one rest timer at a time.
    endActivity()
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }

    let endsAt = Date(timeIntervalSince1970: endsAtMs / 1000)
    let attributes = RestActivityAttributes(title: title)
    let content = ActivityContent(
      state: RestActivityAttributes.ContentState(endsAt: endsAt),
      staleDate: endsAt
    )

    do {
      currentActivity = try Activity.request(
        attributes: attributes,
        content: content,
        pushType: nil
      )
    } catch {
      NSLog("RestActivity start failed: \(error.localizedDescription)")
    }
  }

  @available(iOS 16.2, *)
  private func updateActivity(endsAtMs: Double) {
    guard let activity = currentActivity as? Activity<RestActivityAttributes> else { return }
    let endsAt = Date(timeIntervalSince1970: endsAtMs / 1000)
    let content = ActivityContent(
      state: RestActivityAttributes.ContentState(endsAt: endsAt),
      staleDate: endsAt
    )
    Task { await activity.update(content) }
  }

  @available(iOS 16.2, *)
  private func endActivity() {
    guard let activity = currentActivity as? Activity<RestActivityAttributes> else { return }
    currentActivity = nil
    Task { await activity.end(nil, dismissalPolicy: .immediate) }
  }
}
