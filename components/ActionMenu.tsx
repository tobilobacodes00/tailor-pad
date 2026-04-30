import type { ReactNode } from "react";
import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";

export type Action = {
  label: string;
  icon: ReactNode;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
};

export function ActionMenu({ visible, onClose, actions }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menu}>
          {actions.map((a, i) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [
                styles.item,
                i > 0 && styles.itemBorder,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => {
                onClose();
                a.onPress();
              }}
              accessibilityRole="menuitem"
              accessibilityLabel={a.label}
            >
              <Text
                style={[styles.label, a.destructive && styles.destructive]}
              >
                {a.label}
              </Text>
              <View>{a.icon}</View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: c.drawerScrim,
      paddingTop: 80,
      paddingHorizontal: 24,
      alignItems: "flex-end",
    },
    menu: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      minWidth: 170,
      overflow: "hidden",
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    itemBorder: {
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    label: {
      fontSize: 16,
      color: c.text,
      fontWeight: "500", fontFamily: FONT.medium,
    },
    destructive: {
      color: c.destructive,
    },
  });
