import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  type AppStateStatus,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TailorPadIcon from "@/assets/images/tailor-pad-icon.svg";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useLock } from "@/stores/lock";
import { usePreferences } from "@/stores/preferences";
import type { Colors } from "@/theme/colors";

type Props = { children: ReactNode };

export function LockGate({ children }: Props) {
  const lockPassword = usePreferences((s) => s.lockPassword);
  const setLockPassword = usePreferences((s) => s.setLockPassword);
  const isUnlocked = useLock((s) => s.isUnlocked);
  const unlock = useLock((s) => s.unlock);
  const reLock = useLock((s) => s.reLock);

  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [entered, setEntered] = useState("");
  const [error, setError] = useState<string | null>(null);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if (
        prev === "active" &&
        (next === "background" || next === "inactive")
      ) {
        reLock();
      }
    });
    return () => sub.remove();
  }, [reLock]);

  const isLocked = lockPassword !== null && !isUnlocked;

  if (!isLocked) return <>{children}</>;

  const handleUnlock = () => {
    if (entered === lockPassword) {
      setEntered("");
      setError(null);
      unlock();
    } else {
      setError("Incorrect password.");
    }
  };

  const handleForgot = () => {
    Alert.alert(
      "Forgot password",
      "Without a backend we can't email you a reset link. You can wipe the lock and start over (your templates and customers stay).",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe lock",
          style: "destructive",
          onPress: () => {
            setLockPassword(null);
            unlock();
            setEntered("");
            setError(null);
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
        <View style={styles.content}>
          <TailorPadIcon width={88} height={88} style={styles.brandIcon} />

          <Text style={styles.heading}>App is locked</Text>
          <Text style={styles.subtitle}>
            Enter your password to access Tailor
          </Text>

          <View style={styles.inputBlock}>
            <TextInput
              value={entered}
              onChangeText={(v) => {
                setEntered(v);
                setError(null);
              }}
              placeholder="Password"
              placeholderTextColor={colors.textPlaceholder}
              secureTextEntry
              autoFocus
              style={styles.input}
              onSubmitEditing={handleUnlock}
              returnKeyType="go"
            />
            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable onPress={handleForgot} hitSlop={6}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>
          </View>

          <View style={styles.cta}>
            <PrimaryButton label="Unlock" onPress={handleUnlock} />
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
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 64,
      paddingBottom: 16,
      alignItems: "center",
    },
    brandIcon: {
      marginBottom: 24,
    },
    heading: { fontSize: 28, fontWeight: "700", color: c.text },
    subtitle: {
      marginTop: 8,
      fontSize: 15,
      color: c.textMuted,
      textAlign: "center",
    },
    inputBlock: {
      marginTop: 32,
      width: "100%",
      gap: 12,
    },
    input: {
      fontSize: 17,
      color: c.text,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      backgroundColor: c.surface,
      textAlign: "center",
    },
    error: { fontSize: 13, color: c.destructive, textAlign: "center" },
    forgot: {
      fontSize: 14,
      color: c.text,
      fontWeight: "500",
      textAlign: "center",
      paddingVertical: 4,
    },
    cta: { marginTop: "auto", width: "100%" },
  });
