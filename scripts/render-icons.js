/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "assets", "images", "tailor-pad-icon.svg");
const outDir = path.join(root, "assets", "images");

if (!fs.existsSync(svgPath)) {
  console.error(`Missing source SVG: ${svgPath}`);
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

const targets = [
  // iOS / generic main launcher icon
  { name: "tailor-pad-icon.png", size: 1024, density: 1 },

  // Android adaptive: foreground = full SVG centered with safe-zone padding (~33% safe zone)
  // We render the full SVG at 720 within a 1080 transparent canvas so the rounded
  // mark sits within Android's adaptive-icon safe zone.
  {
    name: "android-icon-foreground.png",
    size: 1080,
    inner: 720,
    density: 1,
  },

  // Splash icon: 200×200 per app.json splash plugin config
  { name: "splash-icon.png", size: 400, density: 2 },

  // Favicon for web build
  { name: "favicon.png", size: 256, density: 1 },
];

async function render(target) {
  const { name, size, inner } = target;
  const out = path.join(outDir, name);

  if (inner) {
    // Render the SVG at `inner` size, then composite onto a transparent square of `size`.
    const fg = await sharp(svgBuffer)
      .resize(inner, inner, { fit: "contain" })
      .png()
      .toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: fg, gravity: "center" }])
      .png()
      .toFile(out);
  } else {
    await sharp(svgBuffer)
      .resize(size, size, { fit: "contain" })
      .png()
      .toFile(out);
  }
  console.log(`✓ ${name} (${size}x${size})`);
}

(async () => {
  try {
    for (const t of targets) {
      await render(t);
    }
    console.log("Done.");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
