import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput, View } from "react-native";

export default function SearchComponent({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <View className="text-[#E6E6E6] p-4 px-8 m-4 mt-16 bg-[#202020] rounded-full flex-row items-center  ">
      <Fontisto name="search" size={32} color="#E6E6E6" />
      <TextInput
        className="mx-4 flex-1  focus:outline-none"
        placeholder="Search workouts..."
        onChangeText={setSearchQuery}
        underlineColorAndroid="transparent"
        value={searchQuery}
      />
      <Ionicons className="ml-auto" name="filter" size={32} color="#E6E6E6" />
    </View>
  );
}
