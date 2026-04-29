import { Redirect } from "expo-router";
import { usePreferences } from "@/stores/preferences";

export default function Index() {
  const hasOnboarded = usePreferences((s) => s.hasOnboarded);
  if (!hasOnboarded) return <Redirect href="/onboarding/intro" />;
  return <Redirect href="/customers" />;
}
