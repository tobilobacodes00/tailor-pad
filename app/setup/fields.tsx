import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { usePreferences } from "@/stores/preferences";
import { useTemplates, validateTemplateInput } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

type Field = { id: string; name: string };

export default function CustomFieldsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { name = "Template", source } = useLocalSearchParams<{
    name: string;
    source?: string;
  }>();
  const addTemplate = useTemplates((s) => s.add);
  const setOnboarded = usePreferences((s) => s.setOnboarded);

  const [fields, setFields] = useState<Field[]>([{ id: "1", name: "" }]);

  const isFromTemplates = source === "templates";

  const updateName = (id: string, fname: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: fname } : f))
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const addField = () => {
    setFields((prev) => [...prev, { id: String(Date.now()), name: "" }]);
  };

  const handleSkip = () => {
    if (isFromTemplates) {
      router.back();
    } else {
      setOnboarded(true);
      router.replace("/customers");
    }
  };

  const handleSave = () => {
    const result = validateTemplateInput({
      name: name as string,
      fields: fields.map((f) => f.name),
    });
    if (!result.ok) {
      Alert.alert("Can't save template", result.error);
      return;
    }
    addTemplate({ name: result.name, fields: result.fields });

    if (isFromTemplates) {
      router.dismissAll();
      router.replace("/templates");
    } else {
      setOnboarded(true);
      router.replace("/customers");
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Field>) => {
    const isEmpty = item.name.trim().length === 0;
    return (
      <ScaleDecorator>
        <View style={[styles.row, isActive && styles.rowActive]}>
          <TextInput
            value={item.name}
            onChangeText={(text) => updateName(item.id, text)}
            placeholder="Enter field name (e.g. Waist)"
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
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.topSkip}>Skip</Text>
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
              <Text style={styles.heading}>
                Create custom fields for your template
              </Text>
              <View style={{ height: 24 }} />
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

        <View style={styles.cta}>
          <PrimaryButton label="Save & Continue" onPress={handleSave} />
        </View>
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
      justifyContent: "flex-end",
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 8,
    },
    topSkip: {
      fontSize: 17,
      fontWeight: "500", fontFamily: FONT.medium,
      color: c.text,
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
    heading: {
      fontSize: 30,
      fontWeight: "700", fontFamily: FONT.bold,
      color: c.text,
      lineHeight: 38,
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
    cta: { paddingHorizontal: 24, paddingBottom: 8 },
  });
