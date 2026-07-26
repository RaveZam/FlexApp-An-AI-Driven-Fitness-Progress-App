import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { usePalette, type Palette } from "@/src/theme";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={p.accent} />
      </View>
    </Modal>
  );
};

const makeStyles = (p: Palette) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

export default LoadingOverlay;
