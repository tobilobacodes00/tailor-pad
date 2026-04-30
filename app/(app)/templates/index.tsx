import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyStateIcon from "@/assets/images/empty-state.svg";
import { useTheme } from "@/hooks/useTheme";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { formatUsedLabel } from "@/utils/time";

export default function TemplatesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const templates = useTemplates((s) => s.templates);
  const isEmpty = templates.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
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
        <Text style={styles.topTitle}>Templates</Text>
        <Pressable
          onPress={() => router.push("/templates/new")}
          style={({ pressed }) => [
            styles.newButton,
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="New template"
        >
          <Feather name="plus" size={16} color={colors.text} />
          <Text style={styles.newLabel}>New</Text>
        </Pressable>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <View style={styles.emptyImage}>
            <EmptyStateIcon width={120} height={120} />
          </View>
          <Text style={styles.emptyTitle}>No templates yet</Text>
          <Text style={styles.emptySubtitle}>
            Create a template to start taking measurements
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/setup/name",
                params: { source: "templates" },
              })
            }
            style={({ pressed }) => [
              styles.createButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Feather name="plus" size={18} color={colors.text} />
            <Text style={styles.createLabel}>Create Template</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>All templates</Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item: t }) => (
            <Pressable
              onPress={() => router.push(`/templates/${t.id}`)}
              style={({ pressed }) => [
                styles.template,
                pressed && { backgroundColor: colors.rowPress },
              ]}
            >
              <View style={styles.templateIcon}>
                <Feather name="file-text" size={18} color={colors.text} />
              </View>
              <Text style={styles.templateName}>{t.name}</Text>
              <Text style={styles.templateMeta}>
                {formatUsedLabel(t.lastUsedAt)}
              </Text>
            </Pressable>
          )}
          removeClippedSubviews
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
    topTitle: { fontSize: 17, fontWeight: "500", fontFamily: FONT.medium, color: c.text },
    newButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    newLabel: { fontSize: 14, fontWeight: "500", fontFamily: FONT.medium, color: c.text },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingBottom: 80,
    },
    emptyImage: {
      width: 120,
      height: 120,
      marginBottom: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700", fontFamily: FONT.bold,
      color: c.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: "center",
      marginBottom: 32,
    },
    createButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    createLabel: { fontSize: 16, fontWeight: "500", fontFamily: FONT.medium, color: c.text },
    listContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
    sectionLabel: {
      fontSize: 16,
      fontWeight: "600", fontFamily: FONT.semibold,
      color: c.text,
      marginBottom: 12,
    },
    list: { gap: 12 },
    template: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    templateIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: c.surfaceMuted,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    templateName: { flex: 1, fontSize: 16, fontWeight: "600", fontFamily: FONT.semibold, color: c.text },
    templateMeta: { fontSize: 13, color: c.textMuted, fontStyle: "italic" },
  });
