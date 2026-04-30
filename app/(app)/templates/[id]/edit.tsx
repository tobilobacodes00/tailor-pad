import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Field = { id: string; name: string };

export default function TemplateEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const template = useTemplates((s) => s.getById(id ?? ""));
  const updateTemplate = useTemplates((s) => s.update);

  const [fields, setFields] = useState<Field[]>(() =>
    template
      ? template.fields.map((name, idx) => ({ id: String(idx), name }))
      : []
  );

  if (!template) return <Redirect href="/templates" />;

  const updateName = (fid: string, name: string) => {
    setFields((prev) => prev.map((f) => (f.id === fid ? { ...f, name } : f)));
  };

  const removeField = (fid: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fid));
  };

  const addField = () => {
    setFields((prev) => [...prev, { id: String(Date.now()), name: "" }]);
  };

  const handleDone = () => {
    const cleaned = fields.map((f) => f.name.trim()).filter((n) => n.length > 0);
    updateTemplate(template.id, { fields: cleaned });
    router.back();
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Field>) => (
    <ScaleDecorator>
      <View style={[styles.row, isActive && styles.rowActive]}>
        <TextInput
          value={item.name}
          onChangeText={(t) => updateName(item.id, t)}
          placeholder="Field name"
          placeholderTextColor={colors.textPlaceholder}
          style={styles.rowInput}
        />
        <Pressable
          onLongPress={drag}
          delayLongPress={120}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Reorder field"
          accessibilityHint="Long-press and drag to reorder"
        >
          <Feather name="move" size={20} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={() => removeField(item.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Delete field"
        >
          <Feather name="trash-2" size={20} color={colors.destructive} />
        </Pressable>
      </View>
    </ScaleDecorator>
  );

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
          <Pressable
            onPress={handleDone}
            hitSlop={12}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
          >
            <Text style={styles.doneLabel}>Done</Text>
          </Pressable>
        </View>

        <DraggableFlatList
          data={fields}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setFields(data)}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>{template.name}</Text>
              <Text style={styles.metaLabel}>Just now</Text>
              <View style={{ height: 12 }} />
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListFooterComponent={
            <Pressable
              onPress={addField}
              style={({ pressed }) => [
                styles.addButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Feather name="plus" size={18} color={colors.text} />
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          }
          ListFooterComponentStyle={{ marginTop: 16 }}
        />
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
    iconBtn: {
      minWidth: 44,
      height: 44,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    doneLabel: { fontSize: 17, fontWeight: "600", fontFamily: FONT.semibold, color: c.text },
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    title: { fontSize: 28, fontWeight: "700", fontFamily: FONT.bold, color: c.text, marginTop: 4 },
    metaLabel: {
      fontSize: 13,
      color: c.textPlaceholder,
      fontStyle: "italic",
      marginTop: 4,
      marginBottom: 8,
    },
    row: {
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
    rowActive: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      borderColor: c.text,
    },
    rowInput: { flex: 1, fontSize: 16, color: c.text, padding: 0 },
    addButton: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    addText: { fontSize: 16, fontWeight: "500", fontFamily: FONT.medium, color: c.text },
  });
