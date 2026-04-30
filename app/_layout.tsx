import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppErrorFallback } from "@/components/AppErrorFallback";
import { LockGate } from "@/components/LockGate";
import { useTheme } from "@/hooks/useTheme";
import { fontAssets, FONT } from "@/theme/fonts";
import { ErrorBoundary, initMonitoring, wrap } from "@/utils/monitoring";

initMonitoring();
SplashScreen.preventAutoHideAsync();

const TextAny = Text as unknown as { defaultProps?: { style?: object } };
TextAny.defaultProps = TextAny.defaultProps || {};
TextAny.defaultProps.style = [
  TextAny.defaultProps.style,
  { fontFamily: FONT.regular },
];

const TextInputAny = TextInput as unknown as {
  defaultProps?: { style?: object };
};
TextInputAny.defaultProps = TextInputAny.defaultProps || {};
TextInputAny.defaultProps.style = [
  TextInputAny.defaultProps.style,
  { fontFamily: FONT.regular },
];

function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ErrorBoundary fallback={(props) => <AppErrorFallback {...props} />}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LockGate>
            <ThemedStack />
          </LockGate>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

function ThemedStack() {
  const { isDark, colors } = useTheme();
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default wrap(RootLayout);
