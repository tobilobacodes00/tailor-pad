import { useColorScheme } from "react-native";
import { usePreferences } from "@/stores/preferences";
import { darkColors, lightColors, type Colors } from "@/theme/colors";

export function useTheme(): { colors: Colors; isDark: boolean } {
  const themeMode = usePreferences((s) => s.themeMode);
  const system = useColorScheme();
  const isDark =
    themeMode === "dark" ||
    (themeMode === "system" && system === "dark");
  return { colors: isDark ? darkColors : lightColors, isDark };
}
