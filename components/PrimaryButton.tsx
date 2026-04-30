import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Props = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    button: {
      backgroundColor: c.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
    },
    pressed: { opacity: 0.85 },
    label: {
      color: c.primaryText,
      fontSize: 17,
      fontWeight: "600", fontFamily: FONT.semibold,
    },
  });
