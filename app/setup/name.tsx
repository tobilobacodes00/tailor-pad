import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { usePreferences } from "@/stores/preferences";
import type { Colors } from "@/theme/colors";

export default function TemplateNameScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { source } = useLocalSearchParams<{ source?: string }>();
  const setOnboarded = usePreferences((s) => s.setOnboarded);
  const [name, setName] = useState("");

  const isFromTemplates = source === "templates";

  const handleSkip = () => {
    if (isFromTemplates) {
      router.back();
    } else {
      setOnboarded(true);
      router.replace("/customers");
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    router.push({
      pathname: "/setup/fields",
      params: { name: name.trim(), source: source ?? "" },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.topBar}>
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.topSkip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>Set up your first template</Text>
          <Text style={styles.subtitle}>
            This helps you reuse the same measurements anytime
          </Text>

          <View style={styles.inputBlock}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter Template Name"
              placeholderTextColor={colors.textPlaceholder}
              style={styles.input}
            />
            <View style={styles.helperRow}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.text}
              />
              <Text style={styles.helperText}>
                Name your first template e.g. Boys Measurement
              </Text>
            </View>
          </View>

          <View style={styles.cta}>
            <PrimaryButton label="Create" onPress={handleCreate} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    flex: { flex: 1 },
    topBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 8,
    },
    topSkip: {
      fontSize: 17,
      fontWeight: "500",
      color: c.text,
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
    heading: {
      fontSize: 32,
      fontWeight: "700",
      color: c.text,
      lineHeight: 40,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 16,
      color: c.textMuted,
      lineHeight: 22,
    },
    inputBlock: { marginTop: 32, gap: 8 },
    input: {
      fontSize: 18,
      color: c.text,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    helperRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    helperText: { fontSize: 14, color: c.textMuted },
    cta: { marginTop: 32 },
  });
