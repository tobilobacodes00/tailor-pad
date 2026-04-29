import { usePreferences } from "@/stores/preferences";
import { darkColors, lightColors, type Colors } from "@/theme/colors";

export function useTheme(): { colors: Colors; isDark: boolean } {
  const darkMode = usePreferences((s) => s.darkMode);
  return { colors: darkMode ? darkColors : lightColors, isDark: darkMode };
}
