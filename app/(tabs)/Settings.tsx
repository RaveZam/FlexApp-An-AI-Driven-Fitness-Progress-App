import { signUp } from "@/auth/useAuth";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { TextInput, View } from "react-native";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ThemedView>
      <ThemedText>Settings</ThemedText>
      <View style={{ padding: 20 }}>
        <TextInput
          className="border-2 border-gray-300 rounded-md p-2 text-white"
          placeholder="Email"
          onChangeText={setEmail}
          style={{ marginBottom: 10 }}
          value={email}
        />
        <TextInput
          className="border-2 border-gray-300 rounded-md p-2 text-white"
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={{ marginBottom: 10 }}
        />
        <Button buttonText="Register" onPress={() => signUp(email, password)} />
      </View>
    </ThemedView>
  );
}
