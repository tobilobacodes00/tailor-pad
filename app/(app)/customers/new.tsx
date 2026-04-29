import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
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
import { useHistory } from "@/hooks/useHistory";
import { useTheme } from "@/hooks/useTheme";
import { useCustomers } from "@/stores/customers";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";

export default function NewMeasurementScreen() {
  const { name = "Customer", templateId = "" } = useLocalSearchParams<{
    name: string;
    templateId: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const template = useTemplates((s) => s.getById(templateId));
  const updateTemplate = useTemplates((s) => s.update);
  const addCustomer = useCustomers((s) => s.add);

  const initial = template
    ? Object.fromEntries(template.fields.map((f) => [f, ""]))
    : {};

  const {
    value: values,
    set: setValues,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<Record<string, string>>(initial);

  if (!template) return <Redirect href="/customers" />;

  const updateValue = (label: string, v: string) =>
    setValues({ ...values, [label]: v });

  const handleDone = () => {
    addCustomer({
      name: name as string,
      templateId: template.id,
      measurements: values,
    });
    updateTemplate(template.id, { lastUsedAt: Date.now() });
    router.back();
  };

  const templateLabel = template.name.replace("Measurement", "measurement");

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

          <View style={styles.topRight}>
            <Pressable
              onPress={undo}
              disabled={!canUndo}
              hitSlop={12}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Undo"
              accessibilityState={{ disabled: !canUndo }}
            >
              <Feather
                name="rotate-ccw"
                size={20}
                color={canUndo ? colors.text : colors.textPlaceholder}
              />
            </Pressable>
            <Pressable
              onPress={redo}
              disabled={!canRedo}
              hitSlop={12}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Redo"
              accessibilityState={{ disabled: !canRedo }}
            >
              <Feather
                name="rotate-cw"
                size={20}
                color={canRedo ? colors.text : colors.textPlaceholder}
              />
            </Pressable>
            <Pressable
              onPress={handleDone}
              hitSlop={12}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Save measurement"
            >
              <Text style={styles.doneLabel}>Done</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.templateTag}>
              <Text style={styles.templateText}>{templateLabel}</Text>
            </View>
            <Text style={styles.timeLabel}>Just now</Text>
          </View>

          <View style={styles.table}>
            {template.fields.map((field) => (
              <View key={field} style={styles.tableRow}>
                <Text style={styles.tableLabel}>{field}</Text>
                <TextInput
                  value={values[field] ?? ""}
                  onChangeText={(v) => updateValue(field, v)}
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.textPlaceholder}
                  style={styles.tableInput}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    topRight: { flexDirection: "row", alignItems: "center", gap: 4 },
    iconBtn: {
      minWidth: 44,
      height: 44,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    doneLabel: { fontSize: 17, fontWeight: "600", color: c.text },
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    title: {
      fontSize: 28,
      fontWeight: "700",
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
    tableLabel: { fontSize: 16, color: c.text, fontWeight: "500" },
    tableInput: {
      fontSize: 16,
      color: c.text,
      minWidth: 60,
      textAlign: "right",
      padding: 0,
    },
  });
