import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

type ShareInput = {
  customerName: string;
  templateName: string;
  fields: { label: string; value: string }[];
  timestamp: number;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderHtml({
  customerName,
  templateName,
  fields,
  timestamp,
}: ShareInput) {
  const dateStr = new Date(timestamp).toLocaleString();
  const rows = fields
    .map(
      (f) => `
        <tr>
          <td>${escapeHtml(f.label)}</td>
          <td>${escapeHtml(f.value || "—")}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0B0B0B; padding: 32px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  .meta { color: #5C5C5C; font-size: 13px; margin-bottom: 24px; }
  .tag { display: inline-block; background: #F4F4F4; border: 1px solid #E5E7EB; border-radius: 6px; padding: 4px 10px; font-size: 13px; margin-right: 8px; }
  table { width: 100%; border-collapse: collapse; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
  th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #E5E7EB; font-size: 15px; }
  th { background: #FAFAFA; font-weight: 600; }
  td:nth-child(2) { text-align: right; }
  tr:last-child td { border-bottom: none; }
</style>
</head>
<body>
  <h1>${escapeHtml(customerName)}</h1>
  <div class="meta">
    <span class="tag">${escapeHtml(templateName)}</span>
    <span>${escapeHtml(dateStr)}</span>
  </div>
  <table>
    <thead><tr><th>Field</th><th>Value</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

export async function shareMeasurementPdf(input: ShareInput): Promise<boolean> {
  const html = renderHtml(input);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: `Share ${input.customerName}'s measurement`,
      UTI: "com.adobe.pdf",
    });
    return true;
  }
  return false;
}
