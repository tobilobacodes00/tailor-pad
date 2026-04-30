import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
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
import { useLock } from "@/stores/lock";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { verifyLock } from "@/utils/auth";

export default function LockSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isLockSet = useLock((s) => s.isLockSet);
  const setLockAction = useLock((s) => s.setLock);
  const clearLockAndUnlock = useLock((s) => s.clearLockAndUnlock);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (isLockSet) {
      const ok = await verifyLock(current);
      if (!ok) {
        setError("Current password is incorrect.");
        return;
      }
    }
    if (next.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    await setLockAction(next);
    Alert.alert(
      isLockSet ? "Password changed" : "Lock added",
      "From now on you'll need this password to open the app."
    );
    router.back();
  };

  const handleRemove = async () => {
    const ok = await verifyLock(current);
    if (!ok) {
      setError("Current password is incorrect.");
      return;
    }
    Alert.alert(
      "Remove app lock?",
      "Anyone with this device will be able to open Tailor without a password.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await clearLockAndUnlock();
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Feather name="chevron-left" size={26} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>
            {isLockSet ? "App lock" : "Add a lock"}
          </Text>
          <Text style={styles.subtitle}>
            {isLockSet
              ? "Change your password or remove the lock."
              : "Pick a password. You'll be asked for it every time you open the app."}
          </Text>

          <View style={styles.fields}>
            {isLockSet && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Current password</Text>
                <TextInput
                  value={current}
                  onChangeText={(v) => {
                    setCurrent(v);
                    setError(null);
                  }}
                  placeholder="••••••"
                  placeholderTextColor={colors.textPlaceholder}
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {isLockSet ? "New password" : "Password"}
              </Text>
              <TextInput
                value={next}
                onChangeText={(v) => {
                  setNext(v);
                  setError(null);
                }}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                value={confirm}
                onChangeText={(v) => {
                  setConfirm(v);
                  setError(null);
                }}
                placeholder="Repeat password"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                style={styles.input}
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
          </View>

          <View style={styles.cta}>
            <PrimaryButton
              label={isLockSet ? "Save changes" : "Add lock"}
              onPress={handleSave}
            />
            {isLockSet && (
              <Pressable
                onPress={handleRemove}
                hitSlop={6}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remove lock</Text>
              </Pressable>
            )}
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
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    iconBtn: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    heading: { fontSize: 28, fontWeight: "700", fontFamily: FONT.bold, color: c.text },
    subtitle: {
      marginTop: 8,
      fontSize: 15,
      color: c.textMuted,
      lineHeight: 22,
    },
    fields: { marginTop: 24, gap: 16 },
    fieldGroup: { gap: 6 },
    label: { fontSize: 13, color: c.textMuted, fontWeight: "500", fontFamily: FONT.medium },
    input: {
      fontSize: 17,
      color: c.text,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    error: { fontSize: 13, color: c.destructive, marginTop: 4 },
    cta: { marginTop: "auto", gap: 8 },
    removeBtn: { paddingVertical: 12, alignSelf: "center" },
    removeText: {
      fontSize: 15,
      color: c.destructive,
      fontWeight: "500", fontFamily: FONT.medium,
    },
  });
