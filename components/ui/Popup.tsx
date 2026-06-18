import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const DANGER_BORDER = "rgba(248,113,113,0.45)";

type ButtonStyle = "default" | "cancel" | "destructive";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  /** Overrides the icon ring tint. Defaults to the accent green. */
  iconColor?: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: ButtonStyle;
  }>;
}

const Popup: React.FC<PopupProps> = ({
  isVisible,
  onClose,
  iconName,
  iconColor = Palette.accent,
  message,
  buttons,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.scrim}>
        <Animated.View
          entering={FadeInDown.delay(40).duration(360)}
          style={styles.card}
        >
          {iconName && (
            <View style={[styles.iconRing, { borderColor: iconColor }]}>
              <Ionicons name={iconName} size={22} color={iconColor} />
            </View>
          )}

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const borderColor = isDestructive
                ? DANGER_BORDER
                : isCancel
                ? Palette.hairlineStrong
                : Palette.accentBorder;
              const labelColor = isDestructive
                ? Palette.danger
                : isCancel
                ? Palette.muted
                : Palette.bone;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.85}
                  style={[styles.button, { borderColor }]}
                  onPress={() => {
                    button.onPress();
                    onClose();
                  }}
                >
                  <Text style={[styles.buttonText, { color: labelColor }]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    backgroundColor: "rgba(0,0,0,0.78)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorderSoft,
    backgroundColor: Palette.inkRaised,
    overflow: "hidden",
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  message: {
    color: Palette.bone,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
    textAlign: "center",
    marginBottom: 26,
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
});

export default Popup;
