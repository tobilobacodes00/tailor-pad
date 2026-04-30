import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
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
import { useTemplates, validateTemplateInput } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Field = { id: string; name: string };

export default function NewTemplateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const addTemplate = useTemplates((s) => s.add);

  const [name, setName] = useState("");
  const [fields, setFields] = useState<Field[]>([{ id: "1", name: "" }]);

  const updateName = (id: string, fname: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name: fname } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const addField = () => {
    setFields((prev) => [...prev, { id: String(Date.now()), name: "" }]);
  };

  const handleSave = () => {
    const result = validateTemplateInput({
      name,
      fields: fields.map((f) => f.name),
    });
    if (!result.ok) {
      Alert.alert("Can't save template", result.error);
      return;
    }
    addTemplate({ name: result.name, fields: result.fields });
    router.back();
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Field>) => {
    const isEmpty = item.name.trim().length === 0;
    return (
      <ScaleDecorator>
        <View style={[styles.row, isActive && styles.rowActive]}>
          <TextInput
            value={item.name}
            onChangeText={(t) => updateName(item.id, t)}
            placeholder="e.g. Waist"
            placeholderTextColor={colors.textPlaceholder}
            style={[styles.rowInput, isEmpty && styles.rowInputEmpty]}
          />
          <Pressable
            onLongPress={drag}
            delayLongPress={120}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Reorder field"
            accessibilityHint="Long-press and drag to reorder"
          >
            <Feather
              name="move"
              size={20}
              color={isEmpty ? colors.textPlaceholder : colors.text}
            />
          </Pressable>
          <Pressable
            onPress={() => removeField(item.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Delete field"
          >
            <Feather
              name="trash-2"
              size={20}
              color={isEmpty ? colors.textPlaceholder : colors.destructiveSoft}
            />
          </Pressable>
        </View>
      </ScaleDecorator>
    );
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
          <Pressable
            onPress={handleSave}
            hitSlop={12}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Save template"
          >
            <Text style={styles.saveLabel}>Save</Text>
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
              <Text style={styles.title}>New Template</Text>

              <Text style={styles.sectionLabel}>Template name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Boys Measurement"
                placeholderTextColor={colors.textPlaceholder}
                style={styles.nameInput}
              />

              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
                Fields
              </Text>
              <Text style={styles.sectionHint}>
                Long-press the move icon to reorder
              </Text>
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
              <Text style={styles.addText}>Add field</Text>
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
    saveLabel: { fontSize: 17, fontWeight: "600", fontFamily: FONT.semibold, color: c.text },
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    title: {
      fontSize: 28,
      fontWeight: "700", fontFamily: FONT.bold,
      color: c.text,
      marginTop: 4,
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      color: c.textMuted,
      fontWeight: "500", fontFamily: FONT.medium,
      marginBottom: 8,
    },
    sectionHint: { fontSize: 13, color: c.textMuted, marginTop: 4 },
    nameInput: {
      fontSize: 18,
      color: c.text,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
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
    rowInputEmpty: { color: c.textPlaceholder },
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
