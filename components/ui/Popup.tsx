import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  iconColor,
  message,
  buttons,
}) => {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const resolvedIconColor = iconColor ?? p.accent;
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
            <View style={[styles.iconRing, { borderColor: resolvedIconColor }]}>
              <Ionicons name={iconName} size={22} color={resolvedIconColor} />
            </View>
          )}

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const borderColor = isDestructive
                ? p.dangerBorder
                : isCancel
                ? p.hairlineStrong
                : p.accentBorder;
              const labelColor = isDestructive
                ? p.danger
                : isCancel
                ? p.muted
                : p.bone;
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

const makeStyles = (p: Palette) => StyleSheet.create({
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
    borderColor: p.accentBorderSoft,
    backgroundColor: p.inkRaised,
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
    color: p.bone,
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
    backgroundColor: p.inkRaised,
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
