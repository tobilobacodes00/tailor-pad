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
import TemplatesMockup from "@/assets/images/templates-mockup.svg";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { usePreferences } from "@/stores/preferences";
import type { Colors } from "@/theme/colors";

const MOCKUP_ASPECT = 400 / 314;

export default function TemplatesIntroScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const setOnboarded = usePreferences((s) => s.setOnboarded);
  const { width } = useWindowDimensions();
  const mockupWidth = width * 0.7;
  const mockupHeight = mockupWidth * MOCKUP_ASPECT;

  const handleSkip = () => {
    setOnboarded(true);
    router.replace("/customers");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.illustrationWrap}>
          <TemplatesMockup width={mockupWidth} height={mockupHeight} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.heading}>Create templates once</Text>
          <Text style={styles.subtitle}>
            Add your measurement fields and reuse them anytime
          </Text>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Get Started"
            onPress={() => router.push("/setup/name")}
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
    illustrationWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
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
