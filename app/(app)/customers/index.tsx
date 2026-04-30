import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyStateIcon from "@/assets/images/empty-state.svg";
import { ConfirmDeleteSheet } from "@/components/ConfirmDeleteSheet";
import { NewMeasurementSheet } from "@/components/NewMeasurementSheet";
import { useTheme } from "@/hooks/useTheme";
import { useCustomers, type Customer } from "@/stores/customers";
import { useTemplates } from "@/stores/templates";
import type { Colors } from "@/theme/colors";
import { FONT } from "@/theme/fonts";
import { shareMeasurementPdf } from "@/utils/pdf";
import { dayBucket, formatTimeLabel, type DayBucket } from "@/utils/time";

export default function CustomersScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const customers = useCustomers((s) => s.customers);
  const removeCustomer = useCustomers((s) => s.remove);
  const templates = useTemplates((s) => s.templates);
  const [search, setSearch] = useState("");
  const [showNewSheet, setShowNewSheet] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, search]);

  const sections = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    const buckets: DayBucket[] = ["Today", "Yesterday", "Earlier"];
    return buckets
      .map((title) => ({
        title,
        data: sorted.filter((c) => dayBucket(c.createdAt) === title),
      }))
      .filter((s) => s.data.length > 0);
  }, [filtered]);

  const getTemplateLabel = (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    return t ? t.name.replace("Measurement", "measurement") : "Measurement";
  };

  const handleShare = async (id: string) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    const t = templates.find((x) => x.id === c.templateId);
    const fieldLabels = t ? t.fields : Object.keys(c.measurements);
    await shareMeasurementPdf({
      customerName: c.name,
      templateName: t
        ? t.name.replace("Measurement", "measurement")
        : "Measurement",
      fields: fieldLabels.map((f) => ({
        label: f,
        value: c.measurements[f] ?? "",
      })),
      timestamp: c.updatedAt,
    });
  };

  const isEmpty = customers.length === 0;
  const noMatches = !isEmpty && filtered.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Feather name="menu" size={28} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={colors.textPlaceholder} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search customer name..."
          placeholderTextColor={colors.textPlaceholder}
          style={styles.searchInput}
        />
      </View>

      {isEmpty ? (
        <EmptyState colors={colors} />
      ) : noMatches ? (
        <NoMatchesState colors={colors} query={search.trim()} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionLabel}>{section.title}</Text>
          )}
          renderItem={({ item, index, section }) => (
            <CustomerRow
              colors={colors}
              customer={item}
              isFirst={index === 0}
              isLast={index === section.data.length - 1}
              templateLabel={getTemplateLabel(item.templateId)}
              onView={(id) => router.push(`/customers/${id}`)}
              onShare={handleShare}
              onDelete={(id) => setConfirmDeleteId(id)}
            />
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
        />
      )}

      <View style={styles.fab}>
        <Pressable
          style={({ pressed }) => [
            styles.fabButton,
            pressed && { transform: [{ scale: 0.92 }], opacity: 0.9 },
          ]}
          onPress={() => setShowNewSheet(true)}
          accessibilityRole="button"
          accessibilityLabel="Add new customer measurement"
        >
          <Feather name="plus" size={28} color={colors.primaryText} />
        </Pressable>
      </View>

      <NewMeasurementSheet
        visible={showNewSheet}
        onClose={() => setShowNewSheet(false)}
      />
      <ConfirmDeleteSheet
        visible={confirmDeleteId !== null}
        title="Delete this customer?"
        message="Are you sure you want to permanently delete this customer's measurement?"
        onConfirm={() => {
          if (confirmDeleteId) removeCustomer(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </SafeAreaView>
  );
}

function EmptyState({ colors }: { colors: Colors }) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.empty}>
      <View style={styles.emptyImage}>
        <EmptyStateIcon width={120} height={120} />
      </View>
      <Text style={styles.emptyTitle}>No customers yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap &quot;Plus Icon&quot; to add your first customer
      </Text>
    </View>
  );
}

function NoMatchesState({
  colors,
  query,
}: {
  colors: Colors;
  query: string;
}) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No matches</Text>
      <Text style={styles.emptySubtitle}>
        No customer name contains &quot;{query}&quot;.
      </Text>
    </View>
  );
}

type CustomerRowProps = {
  colors: Colors;
  customer: Customer;
  isFirst: boolean;
  isLast: boolean;
  templateLabel: string;
  onView: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
};

function CustomerRow({
  colors,
  customer,
  isFirst,
  isLast,
  templateLabel,
  onView,
  onShare,
  onDelete,
}: CustomerRowProps) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const cardStyle = [
    styles.cardWrap,
    isFirst && styles.cardWrapFirst,
    isLast && styles.cardWrapLast,
  ];
  return (
    <View style={cardStyle}>
      <ReanimatedSwipeable
        renderRightActions={() => (
          <View style={styles.swipeActions}>
            <Pressable
              style={[
                styles.swipeAction,
                { backgroundColor: colors.swipeEdit },
              ]}
              onPress={() => onView(customer.id)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${customer.name}`}
            >
              <Feather name="edit-3" size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={[
                styles.swipeAction,
                { backgroundColor: colors.swipeShare },
              ]}
              onPress={() => onShare(customer.id)}
              accessibilityRole="button"
              accessibilityLabel={`Share ${customer.name}'s measurement`}
            >
              <Feather name="share-2" size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={[
                styles.swipeAction,
                { backgroundColor: colors.swipeDelete },
              ]}
              onPress={() => onDelete(customer.id)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${customer.name}`}
            >
              <Feather name="trash-2" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      >
        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && { backgroundColor: colors.rowPress },
          ]}
          onPress={() => onView(customer.id)}
        >
          <View style={styles.rowLeft}>
            <Text style={styles.rowName}>{customer.name}</Text>
            <View style={styles.templateTag}>
              <Text style={styles.templateText}>{templateLabel}</Text>
            </View>
          </View>
          <Text style={styles.timeLabel}>
            {formatTimeLabel(customer.createdAt)}
          </Text>
        </Pressable>
      </ReanimatedSwipeable>
      {!isLast && <View style={styles.separator} />}
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 12,
    },
    headerTitle: { fontSize: 28, fontWeight: "700", fontFamily: FONT.bold, color: c.text },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: c.search,
      borderRadius: 100,
      marginHorizontal: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchInput: { flex: 1, fontSize: 16, color: c.text, padding: 0 },
    listContent: { paddingHorizontal: 24, paddingBottom: 120 },
    sectionLabel: {
      fontSize: 18,
      fontWeight: "600", fontFamily: FONT.semibold,
      color: c.text,
      marginBottom: 8,
    },
    sectionFooter: { height: 24 },
    cardWrap: {
      backgroundColor: c.surface,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    cardWrapFirst: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderTopWidth: 1,
    },
    cardWrapLast: {
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomWidth: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.surface,
    },
    rowLeft: { flex: 1, gap: 6 },
    rowName: { fontSize: 17, fontWeight: "600", fontFamily: FONT.semibold, color: c.text },
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
    separator: { height: 1, backgroundColor: c.divider, marginHorizontal: 16 },
    swipeActions: { flexDirection: "row" },
    swipeAction: {
      width: 60,
      justifyContent: "center",
      alignItems: "center",
    },
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
    emptySubtitle: { fontSize: 14, color: c.textMuted, textAlign: "center" },
    fab: {
      position: "absolute",
      bottom: 24,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    fabButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  });
