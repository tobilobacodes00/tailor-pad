import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TapeMeasure from "@/assets/images/tape-measure.svg";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { usePreferences } from "@/stores/preferences";
import type { Colors } from "@/theme/colors";

const TAPE_ASPECT = 338 / 402;

export default function IntroScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const setOnboarded = usePreferences((s) => s.setOnboarded);
  const { width } = useWindowDimensions();
  const tapeHeight = width * TAPE_ASPECT;

  const handleSkip = () => {
    setOnboarded(true);
    router.replace("/customers");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.illustrationWrap}>
          <TapeMeasure width={width} height={tapeHeight} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.heading}>
            Stop writing{"\n"}measurements on paper
          </Text>
          <Text style={styles.subtitle}>
            Save, organize, and reuse customer measurements easily (بسهولة)
          </Text>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Next"
            onPress={() => router.push("/onboarding/templates")}
          />

          <Pressable onPress={handleSkip}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    container: { flex: 1 },
    illustrationWrap: { flex: 1, justifyContent: "center" },
    textBlock: { gap: 12, marginBottom: 24, paddingHorizontal: 24 },
    heading: {
      fontSize: 32,
      fontWeight: "700",
      color: c.text,
      lineHeight: 40,
    },
    subtitle: { fontSize: 16, color: c.textMuted, lineHeight: 22 },
    buttons: { gap: 4, paddingHorizontal: 24, paddingBottom: 8 },
    skip: {
      fontSize: 17,
      fontWeight: "500",
      color: c.text,
      textAlign: "center",
      paddingVertical: 16,
    },
  });
