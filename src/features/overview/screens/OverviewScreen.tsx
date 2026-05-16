import { SafeAreaView, Text, View } from "react-native";

export default function OverviewScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#9ca3af", fontSize: 16 }}>Progress coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
