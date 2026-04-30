import { Feather, Ionicons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useLock } from "@/stores/lock";
import { usePreferences } from "@/stores/preferences";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { exportBackup, importBackup } from "@/utils/backup";

const LINKS = {
  tobiloba: {
    website: "https://tobilobasulaimon.com",
    github: "https://github.com/tobilobacodes00",
    linkedin: "https://www.linkedin.com/in/tobilobacodes",
    x: "https://x.com/tobilobacodes00",
  },
  abdul: {
    x: "https://x.com/abdul_uxui",
    facebook: "https://www.facebook.com/share/1J867TvEvN/",
    instagram:
      "https://www.instagram.com/abdul_uxui?igsh=MWlwcmpqZHd1ZWMyMg==",
  },
};

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export function CustomDrawerContent({
  navigation,
}: DrawerContentComponentProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const themeMode = usePreferences((s) => s.themeMode);
  const setThemeMode = usePreferences((s) => s.setThemeMode);
  const isLockSet = useLock((s) => s.isLockSet);

  const closeDrawer = () => navigation.closeDrawer();

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Couldn't open link", url);
    }
  };

  const handleBackup = () => {
    Alert.alert(
      "Backup to Drive",
      "Export — pick Google Drive (or any cloud/email) in the share sheet to save your data there.\n\nImport — pick a Tailor backup file from Drive, Files, or anywhere your phone can read.\n\nNote: backup files are unencrypted JSON. Treat them like sensitive customer data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: () => {
            importBackup().catch((e) =>
              Alert.alert("Import failed", String(e))
            );
          },
        },
        {
          text: "Export",
          onPress: () => {
            exportBackup().catch((e) =>
              Alert.alert("Export failed", String(e))
            );
          },
        },
      ]
    );
  };

  const handleAppInfo = () => {
    Alert.alert(
      `Tailor v${APP_VERSION}`,
      "Built by Tobiloba Sulaimon\nDesigned by Abdul ui ux"
    );
  };

  const handleThemeMode = () => {
    const order: typeof themeMode[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(themeMode) + 1) % order.length];
    setThemeMode(next);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.menu}>
        <MenuItem
          colors={colors}
          label="Templates"
          right={
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          }
          onPress={() => {
            closeDrawer();
            router.push("/templates");
          }}
        />
        <MenuItem
          colors={colors}
          label="Theme"
          right={
            <Text style={styles.rightText}>
              {themeMode === "system"
                ? "System"
                : themeMode === "dark"
                  ? "Dark"
                  : "Light"}
            </Text>
          }
          onPress={handleThemeMode}
        />
        <MenuItem
          colors={colors}
          label="Backup"
          right={
            <View style={styles.rightRow}>
              <Text style={styles.rightLink}>Export · Import</Text>
              <Feather name="download" size={16} color={colors.text} />
            </View>
          }
          onPress={handleBackup}
        />
        <MenuItem
          colors={colors}
          label={isLockSet ? "App lock" : "Add a lock"}
          right={
            <View style={styles.rightRow}>
              {isLockSet && <Text style={styles.rightText}>On</Text>}
              <Feather
                name={isLockSet ? "lock" : "chevron-right"}
                size={isLockSet ? 16 : 20}
                color={isLockSet ? colors.text : colors.textMuted}
              />
            </View>
          }
          onPress={() => {
            closeDrawer();
            router.push("/lock-setup");
          }}
        />
        <MenuItem
          colors={colors}
          label="App info"
          right={<Text style={styles.rightText}>v{APP_VERSION}</Text>}
          onPress={handleAppInfo}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.creditBlock}>
          <Image
            source={require("@/assets/images/avatar.jpeg")}
            style={styles.avatar}
            accessibilityLabel="Tobiloba Sulaimon profile photo"
          />
          <View style={styles.creditText}>
            <Text style={styles.creditLabel}>Built by</Text>
            <Text style={styles.creditName}>Tobiloba Sulaimon</Text>
          </View>
          <View style={styles.socials}>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.tobiloba.website)}
              accessibilityRole="button"
              accessibilityLabel="Tobiloba's website"
            >
              <Feather name="globe" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.tobiloba.github)}
              accessibilityRole="button"
              accessibilityLabel="Tobiloba on GitHub"
            >
              <Ionicons name="logo-github" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.tobiloba.linkedin)}
              accessibilityRole="button"
              accessibilityLabel="Tobiloba on LinkedIn"
            >
              <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.tobiloba.x)}
              accessibilityRole="button"
              accessibilityLabel="Tobiloba on X"
            >
              <Ionicons name="logo-twitter" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.creditBlock}>
          <Image
            source={require("@/assets/images/Ellipse 413.png")}
            style={styles.avatar}
            accessibilityLabel="Abdul ui ux profile photo"
          />
          <View style={styles.creditText}>
            <Text style={styles.creditLabel}>Designed by</Text>
            <Text style={styles.creditName}>Abdul ui ux</Text>
          </View>
          <View style={styles.socials}>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.abdul.x)}
              accessibilityRole="button"
              accessibilityLabel="Abdul on X"
            >
              <Ionicons name="logo-twitter" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.abdul.facebook)}
              accessibilityRole="button"
              accessibilityLabel="Abdul on Facebook"
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => openLink(LINKS.abdul.instagram)}
              accessibilityRole="button"
              accessibilityLabel="Abdul on Instagram"
            >
              <Ionicons name="logo-instagram" size={20} color="#E1306C" />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  colors: Colors;
  label: string;
  right: ReactNode;
  onPress?: () => void;
};

function MenuItem({ colors, label, right, onPress }: MenuItemProps) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.6 }]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={styles.menuLabel}>{label}</Text>
        {right}
      </Pressable>
    );
  }
  return (
    <View style={styles.menuItem} accessibilityLabel={label}>
      <Text style={styles.menuLabel}>{label}</Text>
      {right}
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    menu: { paddingHorizontal: 24, paddingTop: 24, gap: 24 },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    menuLabel: { fontSize: 17, color: c.text, fontWeight: "500", fontFamily: FONT.medium },
    rightRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    rightLink: { fontSize: 15, color: c.text, fontWeight: "500", fontFamily: FONT.medium },
    rightText: { fontSize: 15, color: c.textMuted },
    footer: {
      marginTop: "auto",
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 16,
      borderTopWidth: 1,
      borderTopColor: c.divider,
    },
    creditBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    creditText: { flex: 1 },
    creditLabel: { fontSize: 12, color: c.textMuted },
    creditName: { fontSize: 14, color: c.text, fontWeight: "600", fontFamily: FONT.semibold },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    socials: { flexDirection: "row", gap: 12 },
  });
