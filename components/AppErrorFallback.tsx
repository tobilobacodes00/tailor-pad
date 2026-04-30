import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Props = {
  error: unknown;
  resetError: () => void;
};

export function AppErrorFallback({ resetError }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.heading}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          Tailor hit an unexpected error. Your saved data is still safe.
        </Text>
        <Text style={styles.subtitle}>
          Try restarting the screen. If it keeps happening, share what you
          were doing with the developer.
        </Text>

        <View style={styles.cta}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.85 },
            ]}
            onPress={resetError}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 64,
      paddingBottom: 16,
    },
    heading: {
      fontSize: 28,
      fontWeight: "700",
      fontFamily: FONT.bold,
      color: c.text,
    },
    subtitle: {
      marginTop: 12,
      fontSize: 16,
      color: c.textMuted,
      lineHeight: 22,
    },
    cta: { marginTop: "auto" },
    button: {
      backgroundColor: c.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
    },
    buttonLabel: {
      color: c.primaryText,
      fontSize: 17,
      fontWeight: "600",
      fontFamily: FONT.semibold,
    },
  });
