import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { useCustomers, type Customer } from "@/stores/customers";
import { useTemplates, type Template } from "@/stores/templates";

type BackupFile = {
  app: "tailor";
  version: 1;
  exportedAt: number;
  templates: Template[];
  customers: Customer[];
};

function isBackupFile(value: unknown): value is BackupFile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.app === "tailor" &&
    v.version === 1 &&
    Array.isArray(v.templates) &&
    Array.isArray(v.customers)
  );
}

export async function exportBackup(): Promise<void> {
  const payload: BackupFile = {
    app: "tailor",
    version: 1,
    exportedAt: Date.now(),
    templates: useTemplates.getState().templates,
    customers: useCustomers.getState().customers,
  };

  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const uri = `${FileSystem.cacheDirectory}tailor-backup-${stamp}.json`;

  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/json",
      dialogTitle: "Save Tailor backup",
    });
  } else {
    Alert.alert("Sharing unavailable", `Backup saved at ${uri}`);
  }
}

export async function importBackup(): Promise<void> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/plain", "*/*"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return;

  const file = result.assets[0];
  let content: string;
  try {
    content = await FileSystem.readAsStringAsync(file.uri);
  } catch {
    Alert.alert("Couldn't open file", "The selected file couldn't be read.");
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    Alert.alert(
      "Invalid backup",
      "This file isn't valid JSON. Pick a Tailor backup file."
    );
    return;
  }

  if (!isBackupFile(parsed)) {
    Alert.alert(
      "Not a Tailor backup",
      "This file doesn't look like a Tailor backup. Pick a file you exported from this app."
    );
    return;
  }

  const data = parsed;
  const currentTemplates = useTemplates.getState().templates.length;
  const currentCustomers = useCustomers.getState().customers.length;

  Alert.alert(
    "Replace all data?",
    `Backup contains ${data.templates.length} templates and ${data.customers.length} customers.\n\nThis will replace your current ${currentTemplates} templates and ${currentCustomers} customers. This can't be undone.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Replace",
        style: "destructive",
        onPress: () => {
          useTemplates.setState({ templates: data.templates });
          useCustomers.setState({ customers: data.customers });
          Alert.alert(
            "Restored",
            `Loaded ${data.templates.length} templates and ${data.customers.length} customers.`
          );
        },
      },
    ]
  );
}
