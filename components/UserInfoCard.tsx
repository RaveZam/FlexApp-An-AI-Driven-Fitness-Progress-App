import { Colors } from "@/constants";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function UserInfoCard() {
  return (
    <ThemedView borderToken="border" className="flex-row items-center p-4">
      <ThemedView colorToken="background" className="flex-row items-center ">
        <Image
          style={{ width: 48, height: 48 }}
          source={{
            uri: "https://res.cloudinary.com/dcdgu2fxc/image/upload/v1755495758/FlexLifeLogo-removebg-preview_n678qi.png",
          }}
          className="w-12 h-12 rounded-md"
        />
        <ThemedText style={{ fontSize: 28, color: Colors.light.text }}>
          FlexLife
        </ThemedText>
      </ThemedView>

      <ThemedView
        className="ml-auto flex-row gap-1 items-center"
        colorToken="background"
      >
        <ThemedView className="m-4">
          <Fontisto name="bell" size={20} color={Colors.light.text} />
        </ThemedView>

        <Image
          style={{ width: 36, height: 36 }}
          source={{
            uri: "https://res.cloudinary.com/dcdgu2fxc/image/upload/v1755494500/pfp_l6k1di.jpg",
          }}
          className="w-12 h-12 rounded-full"
        />
      </ThemedView>
    </ThemedView>
  );
}
{
}
{
  /* <ThemedView colorToken="background" className="ml-4">
        <Text className="text-mutedText">Welcome Back!</Text>
        <ThemedText className="text-lg text-whiteText font-medium ">
          {sampleUsername}!
        </ThemedText>
      </ThemedView> */
}
