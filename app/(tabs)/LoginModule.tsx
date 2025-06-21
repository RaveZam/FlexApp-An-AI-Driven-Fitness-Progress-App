import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async () => {
  //   const { error } = await signIn(email.trim(), password.trim());
  //   if (error) Alert.alert('Login Failed', error.message);
  //   else Alert.alert('Success', 'You are now logged in');
  // };

  return (
    <View className="flex-1 bg-[#0f0f0f] px-6 justify-center">
      <Text className="text-3xl font-bold text-white mb-8">Welcome Back</Text>

      <Text className="text-white mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        placeholderTextColor="#9CA3AF"
        className="bg-[#1c1c1c] text-white rounded-xl px-4 py-3 mb-4 border border-transparent focus:border-emerald-500"
      />

      <Text className="text-white mb-2">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        className="bg-[#1c1c1c] text-white rounded-xl px-4 py-3 mb-6 border border-transparent focus:border-emerald-500"
      />

      <TouchableOpacity
        className="bg-emerald-500 rounded-xl py-3"
        // onPress={handleLogin}
      >
        <Text className="text-center text-black font-semibold text-base">
          Login
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 mt-6">
        Don't have an account?{" "}
        <Text className="text-emerald-400">Register</Text>
      </Text>
    </View>
  );
}
