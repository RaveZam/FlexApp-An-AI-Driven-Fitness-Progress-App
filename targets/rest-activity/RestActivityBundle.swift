import SwiftUI
import WidgetKit

@main
struct RestActivityBundle: WidgetBundle {
  var body: some Widget {
    if #available(iOS 16.2, *) {
      RestActivityLiveActivity()
    }
  }
}
