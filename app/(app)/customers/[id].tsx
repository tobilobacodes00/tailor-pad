import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionMenu } from "@/components/ActionMenu";
import { ConfirmDeleteSheet } from "@/components/ConfirmDeleteSheet";
import { useTheme } from "@/hooks/useTheme";
import { useCustomers } from "@/stores/customers";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { shareMeasurementPdf } from "@/utils/pdf";
import { formatTimeLabel } from "@/utils/time";

export default function CustomerMeasurementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const customer = useCustomers((s) => s.getById(id ?? ""));
  const updateCustomer = useCustomers((s) => s.update);
  const removeCustomer = useCustomers((s) => s.remove);
  const template = useTemplates((s) =>
    customer ? s.getById(customer.templateId) : undefined
  );

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(
    customer?.measurements ?? {}
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (!customer) return <Redirect href="/customers" />;

  const templateLabel = template
    ? template.name.replace("Measurement", "measurement")
    : "Measurement";
  const fieldLabels = template
    ? template.fields
    : Object.keys(customer.measurements);

  const updateValue = (label: string, v: string) =>
    setDraft((prev) => ({ ...prev, [label]: v }));

  const handleDone = () => {
    updateCustomer(customer.id, { measurements: draft });
    setEditMode(false);
  };

  const handleDelete = () => {
    removeCustomer(customer.id);
    router.back();
  };

  const enterEditMode = () => {
    setDraft(customer.measurements);
    setEditMode(true);
  };

  const handleShare = async () => {
    await shareMeasurementPdf({
      customerName: customer.name,
      templateName: templateLabel,
      fields: fieldLabels.map((f) => ({
        label: f,
        value: customer.measurements[f] ?? "",
      })),
      timestamp: customer.updatedAt,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
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
          {editMode ? (
            <Pressable
              onPress={handleDone}
              hitSlop={12}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
            >
              <Text style={styles.doneLabel}>Done</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setMenuOpen(true)}
              hitSlop={12}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="More actions"
            >
              <Feather name="more-vertical" size={22} color={colors.text} />
            </Pressable>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{customer.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.templateTag}>
              <Text style={styles.templateText}>{templateLabel}</Text>
            </View>
            <Text style={styles.timeLabel}>
              {editMode ? "Editing…" : formatTimeLabel(customer.updatedAt)}
            </Text>
          </View>

          <View style={styles.table}>
            {fieldLabels.map((label) => (
              <View key={label} style={styles.tableRow}>
                <Text style={styles.tableLabel}>{label}</Text>
                {editMode ? (
                  <TextInput
                    value={draft[label] ?? ""}
                    onChangeText={(v) => updateValue(label, v)}
                    keyboardType="numeric"
                    placeholder="—"
                    placeholderTextColor={colors.textPlaceholder}
                    style={styles.tableInput}
                  />
                ) : (
                  <Text style={styles.tableValue}>
                    {customer.measurements[label] ?? "—"}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        actions={[
          {
            label: "Edit",
            icon: <Feather name="edit-2" size={18} color={colors.text} />,
            onPress: enterEditMode,
          },
          {
            label: "Share",
            icon: <Feather name="share" size={18} color={colors.text} />,
            onPress: handleShare,
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
        title="Delete this measurement?"
        message="Are you sure you want to permanently delete this measurement?"
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
    flex: { flex: 1 },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    iconBtn: {
      minWidth: 44,
      height: 44,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    doneLabel: { fontSize: 17, fontWeight: "600", fontFamily: FONT.semibold, color: c.text },
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    title: {
      fontSize: 28,
      fontWeight: "700", fontFamily: FONT.bold,
      color: c.text,
      marginTop: 4,
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    templateTag: {
      alignSelf: "flex-start",
      backgroundColor: c.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: c.border,
    },
    templateText: { fontSize: 13, color: c.text },
    timeLabel: { fontSize: 13, color: c.textPlaceholder, fontStyle: "italic" },
    table: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    tableLabel: { fontSize: 16, color: c.text, fontWeight: "500", fontFamily: FONT.medium },
    tableValue: { fontSize: 16, color: c.text },
    tableInput: {
      fontSize: 16,
      color: c.text,
      minWidth: 60,
      textAlign: "right",
      padding: 0,
    },
  });
