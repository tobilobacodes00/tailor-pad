import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { BottomSheet } from "./BottomSheet";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteSheet({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.confirm,
          pressed && { opacity: 0.85 },
        ]}
        onPress={onConfirm}
      >
        <Text style={styles.confirmLabel}>Delete</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
    </BottomSheet>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    title: {
      fontSize: 22,
      fontWeight: "700", fontFamily: FONT.bold,
      color: c.text,
      marginBottom: 8,
    },
    message: {
      fontSize: 15,
      color: c.textMuted,
      lineHeight: 22,
      marginBottom: 24,
    },
    confirm: {
      backgroundColor: c.destructive,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 4,
    },
    confirmLabel: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "600", fontFamily: FONT.semibold,
    },
    cancel: {
      fontSize: 17,
      fontWeight: "500", fontFamily: FONT.medium,
      color: c.text,
      textAlign: "center",
      paddingVertical: 16,
    },
  });
