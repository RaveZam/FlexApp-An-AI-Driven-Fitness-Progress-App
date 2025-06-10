import { Image, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function UserInfoCard() {
  const sampleUsername = "Runielle Raven";
  return (
    <ThemedView className="flex-row items-center p-4 pt-8">
      <View>
        <Image
          style={{ width: 48, height: 48 }}
          source={{
            uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
          className="w-12 h-12 rounded-full"
        />
      </View>
      <ThemedView className="ml-4">
        <ThemedText className="opacity-80">Welcome Back!</ThemedText>
        <ThemedText className="text-lg font-semibold ">
          {sampleUsername}!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
