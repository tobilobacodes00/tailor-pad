import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionMenu } from "@/components/ActionMenu";
import { ConfirmDeleteSheet } from "@/components/ConfirmDeleteSheet";
import { useTheme } from "@/hooks/useTheme";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { formatTimeLabel } from "@/utils/time";

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const template = useTemplates((s) => s.getById(id ?? ""));
  const removeTemplate = useTemplates((s) => s.remove);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (!template) return <Redirect href="/templates" />;

  const handleDelete = () => {
    removeTemplate(template.id);
    router.back();
  };

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
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="More actions"
        >
          <Feather name="more-vertical" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.metaLabel}>
          Created {formatTimeLabel(template.createdAt)}
        </Text>

        <View style={styles.fieldList}>
          {template.fields.map((field) => (
            <View key={field} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{field}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <ActionMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        actions={[
          {
            label: "Edit",
            icon: <Feather name="edit-2" size={18} color={colors.text} />,
            onPress: () => router.push(`/templates/${template.id}/edit`),
          },
          {
            label: "Delete",
            icon: (
              <Feather name="trash-2" size={18} color={colors.destructive} />
            ),
            destructive: true,
            onPress: () => setShowDelete(true),
          },
        ]}
      />

      <ConfirmDeleteSheet
        visible={showDelete}
        title="Delete this template?"
        message="Are you sure you want to permanently delete this template?"
        onConfirm={() => {
          setShowDelete(false);
          handleDelete();
        }}
        onCancel={() => setShowDelete(false)}
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    title: { fontSize: 28, fontWeight: "700", fontFamily: FONT.bold, color: c.text, marginTop: 4 },
    metaLabel: {
      fontSize: 13,
      color: c.textPlaceholder,
      fontStyle: "italic",
      marginBottom: 20,
    },
    fieldList: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    fieldRow: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    fieldLabel: { fontSize: 16, color: c.text, fontWeight: "500", fontFamily: FONT.medium },
  });
