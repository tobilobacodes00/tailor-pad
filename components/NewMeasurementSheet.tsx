import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { formatUsedLabel } from "@/utils/time";
import { BottomSheet } from "./BottomSheet";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function NewMeasurementSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const templates = useTemplates((s) => s.templates);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<string | null>(null);

  const canStart = name.trim().length > 0 && templateId !== null;

  const handleStart = () => {
    if (!canStart) return;
    const params = { name: name.trim(), templateId: templateId! };
    setName("");
    setTemplateId(null);
    onClose();
    router.push({ pathname: "/customers/new", params });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>New Measurement</Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Feather name="x" size={18} color={colors.text} />
        </Pressable>
      </View>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter Customer Name"
        placeholderTextColor={colors.textPlaceholder}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Choose template</Text>
      <Text style={styles.sectionSubtitle}>
        Select a template and start entering parameters
      </Text>

      {templates.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No templates yet</Text>
          <Pressable
            onPress={() => {
              onClose();
              router.push("/templates/new");
            }}
            style={({ pressed }) => [
              styles.emptyCta,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Feather name="plus" size={16} color={colors.text} />
            <Text style={styles.emptyCtaText}>Create Template</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.templates}>
          {templates.map((t) => {
            const selected = templateId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTemplateId(t.id)}
                style={({ pressed }) => [
                  styles.template,
                  selected && styles.templateSelected,
                  pressed && { opacity: 0.85 },
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
            );
          })}
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.cta,
          !canStart && styles.ctaDisabled,
          pressed && canStart && { opacity: 0.85 },
        ]}
        disabled={!canStart}
        onPress={handleStart}
      >
        <Text style={[styles.ctaLabel, !canStart && styles.ctaLabelDisabled]}>
          Start Measurement
        </Text>
      </Pressable>
    </BottomSheet>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: "700", color: c.text },
    close: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.search,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      fontSize: 17,
      color: c.text,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: c.text,
      marginBottom: 4,
    },
    sectionSubtitle: { fontSize: 14, color: c.textMuted, marginBottom: 16 },
    empty: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      marginBottom: 24,
      alignItems: "center",
      gap: 12,
    },
    emptyText: { fontSize: 14, color: c.textMuted, textAlign: "center" },
    emptyCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
    },
    emptyCtaText: { fontSize: 14, fontWeight: "500", color: c.text },
    templates: { gap: 12, marginBottom: 24 },
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
    templateSelected: { borderColor: c.text, borderWidth: 2 },
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
    templateName: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: c.text,
    },
    templateMeta: { fontSize: 13, color: c.textMuted, fontStyle: "italic" },
    cta: {
      backgroundColor: c.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
    },
    ctaDisabled: { backgroundColor: c.primaryDisabled },
    ctaLabel: { color: c.primaryText, fontSize: 17, fontWeight: "600" },
    ctaLabelDisabled: { color: c.primaryDisabledText },
  });
