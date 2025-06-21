import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   const handleRegister = async () => {
  //     const { error } = await signUp(email.trim(), password.trim());
  //     if (error) Alert.alert('Signup Failed', error.message);
  //     else Alert.alert('Success', 'Please check your email to confirm');
  //   };

  return (
    <View className="flex-1 bg-[#0f0f0f] px-6 justify-center">
      <Text className="text-3xl font-bold text-white mb-8">Create Account</Text>

      <Text className="text-white mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
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

      <TouchableOpacity className="bg-emerald-500 rounded-xl py-3">
        <Text className="text-center text-black font-semibold text-base">
          Register
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 mt-6">
        Already have an account? <Text className="text-emerald-400">Login</Text>
      </Text>
    </View>
  );
}
