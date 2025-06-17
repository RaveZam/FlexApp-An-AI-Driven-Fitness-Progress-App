import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function EditWorkoutCard({ workout }: { workout: any }) {
  return (
    <View className="border-b border-[#202020] m-4 p-4 rounded-2xl">
      <View className="flex-row rounded-2xl items-center bg-[#191818] overflow-hidden cursor-pointer mb-4">
        <Image
          source={{ uri: workout.workout_image }}
          style={{
            width: 160,
            height: 80,
          }}
          resizeMode="cover"
        />

        <View className="w-2/3 items-center">
          <ThemedText style={{ fontSize: 18 }}>
            {workout.workout_name}
          </ThemedText>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="w-2/5  justify-center">
          <ThemedText className="text-center mb-4">Sets</ThemedText>
          <View className="flex-row  items-center justify-between bg-[#202020] rounded-full p-2 px-4">
            <TouchableOpacity className=" rounded-full ">
              <Entypo name="minus" size={24} color="#BFFA00" />
            </TouchableOpacity>

            <Text className="text-[#BFFA00] text-lg"> 2 </Text>

            <TouchableOpacity className="rounded-full ">
              <AntDesign name="plus" size={24} color="#BFFA00" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-3/6   justify-center">
          <ThemedText className="text-center mb-4">Reps</ThemedText>
          <View className="flex-row  items-center justify-between bg-[#202020] rounded-full p-2 px-4">
            <TouchableOpacity className=" rounded-full ">
              <Entypo name="minus" size={24} color="#BFFA00" />
            </TouchableOpacity>

            <Text className="text-[#BFFA00]  text-lg"> 10-12 </Text>

            <TouchableOpacity className="rounded-full ">
              <AntDesign name="plus" size={24} color="#BFFA00" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
