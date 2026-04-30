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
import { useCustomers } from "@/stores/customers";
import { useLock } from "@/stores/lock";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Props = { children: ReactNode };

export function LockGate({ children }: Props) {
  const isLockSet = useLock((s) => s.isLockSet);
  const isUnlocked = useLock((s) => s.isUnlocked);
  const hydrated = useLock((s) => s.hydrated);
  const cooldownUntil = useLock((s) => s.cooldownUntil);
  const failedAttempts = useLock((s) => s.failedAttempts);
  const init = useLock((s) => s.init);
  const unlockWith = useLock((s) => s.unlockWith);
  const clearLockAndUnlock = useLock((s) => s.clearLockAndUnlock);
  const reLock = useLock((s) => s.reLock);

  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [entered, setEntered] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if (prev === "active" && next === "background") {
        reLock();
      }
    });
    return () => sub.remove();
  }, [reLock]);

  useEffect(() => {
    if (cooldownUntil <= Date.now()) {
      setCooldownRemaining(0);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, cooldownUntil - Date.now());
      setCooldownRemaining(remaining);
      if (remaining === 0) clearInterval(id);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  if (!hydrated) return null;

  const isLocked = isLockSet && !isUnlocked;
  if (!isLocked) return <>{children}</>;

  const inCooldown = cooldownRemaining > 0;

  const handleUnlock = async () => {
    if (inCooldown) return;
    const ok = await unlockWith(entered);
    if (ok) {
      setEntered("");
      setError(null);
    } else if (cooldownUntil > Date.now()) {
      setError("Too many attempts. Please wait.");
    } else {
      const remaining = Math.max(0, 5 - (failedAttempts + 1));
      setError(
        `Incorrect password.${remaining > 0 ? ` ${remaining} attempts left.` : ""}`
      );
    }
  };

  const handleForgot = () => {
    Alert.alert(
      "Forgot password",
      "Without a backend we can't email you a reset link. You can wipe the lock and all data to start over. This permanently deletes your templates and customers.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe lock and all data",
          style: "destructive",
          onPress: async () => {
            useCustomers.setState({ customers: [] });
            useTemplates.setState({ templates: [] });
            await clearLockAndUnlock();
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
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              editable={!inCooldown}
              style={styles.input}
              onSubmitEditing={handleUnlock}
              returnKeyType="go"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {inCooldown && (
              <Text style={styles.error}>
                Try again in {Math.ceil(cooldownRemaining / 1000)}s
              </Text>
            )}

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
    heading: { fontSize: 28, fontWeight: "700", fontFamily: FONT.bold, color: c.text },
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
      fontWeight: "500", fontFamily: FONT.medium,
      textAlign: "center",
      paddingVertical: 4,
    },
    cta: { marginTop: "auto", width: "100%" },
  });
