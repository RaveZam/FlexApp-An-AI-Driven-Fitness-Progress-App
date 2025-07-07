import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  iconName?: keyof typeof AntDesign.glyphMap;
  iconColor?: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: "default" | "cancel" | "destructive";
  }>;
}

const Popup: React.FC<PopupProps> = ({
  isVisible,
  onClose,
  iconName,
  iconColor = "#FFFFFF",
  message,
  buttons,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {iconName && (
            <AntDesign
              name={iconName}
              size={56}
              color={iconColor}
              style={styles.icon}
            />
          )}
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "destructive" && styles.destructiveButton,
                ]}
                onPress={() => {
                  button.onPress();
                  onClose(); // Close popup after button press
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "destructive" &&
                      styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "rgba(25, 25, 25, 0.8)", // Translucent dark background
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(26, 71, 42, 0.3)", // Subtle border for glassmorphism
    // Add shadow for depth if desired, but might not be visible on all platforms
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  icon: {
    marginBottom: 15,
  },
  messageText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
  destructiveButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  destructiveButtonText: {
    color: "#FFFFFF",
  },
});

export default Popup;
