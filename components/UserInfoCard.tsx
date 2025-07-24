import Fontisto from "@expo/vector-icons/Fontisto";
import { Image, Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function UserInfoCard() {
  const sampleUsername = "Runielle Raven";
  return (
    <ThemedView className="flex-row p-4 pt-8">
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
        <Text className="text-mutedText">Welcome Back!</Text>
        <ThemedText className="text-lg text-whiteText font-medium ">
          {sampleUsername}!
        </ThemedText>
      </ThemedView>
      <View className="ml-auto m-4">
        <Fontisto name="bell" size={24} color="white" />
      </View>
    </ThemedView>
  );
}
