import axios from "axios";
import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

import "../../global.css";

export default function Performance() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  async function sendMessage() {
    if (!input.trim()) {
      return;
    }

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nousresearch/deephermes-3-mistral-24b-preview:free",
        messages: newMessages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
      }
    );
    console.log(response);
    const reply = response.data.choices[0].message.content;
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  }

  return (
    <View className="flex-1 items-center justify-center  p-4">
      <Text className="text-white text-2xl">Talk To Mistral</Text>
      <ScrollView>
        {messages.map((message, index) => {
          return (
            <View className="text-white flex flex-row" key={index}>
              <Text className="text-white">
                {message.role === "user" ? "You: " : "Mistral: "}
              </Text>
              <Text className="text-white">{message.content}</Text>
            </View>
          );
        })}
      </ScrollView>
      <TextInput
        value={input}
        onChangeText={(e) => setInput(e)}
        placeholder="Type Something..."
        className="p-4 w-full text-lg border-b focus:outline-none border-white mt-4 text-white"
      />

      <Button title="send" onPress={sendMessage} />
    </View>
  );
}
