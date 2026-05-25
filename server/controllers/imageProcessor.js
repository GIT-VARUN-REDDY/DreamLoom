const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/* ─────────────────────────────────────────────────────────
   COLOUR THEMES — each story page gets a unique palette
   so every page feels distinct even without AI generation.
───────────────────────────────────────────────────────── */
const pageThemes = {
  "Bath Time":      { tint: { r: 200, g: 230, b: 255 }, hue: 200, label: "aqua"    },
  "Pajama Time":    { tint: { r: 220, g: 200, b: 255 }, hue: 270, label: "lavender" },
  "Family Cuddle":  { tint: { r: 255, g: 230, b: 180 }, hue: 30,  label: "golden"  },
  "Story Time":     { tint: { r: 255, g: 210, b: 180 }, hue: 15,  label: "amber"   },
  "Lullaby Time":   { tint: { r: 180, g: 200, b: 255 }, hue: 220, label: "moonblue"},
  "Goodnight Kiss": { tint: { r: 210, g: 255, b: 210 }, hue: 120, label: "mint"    },
  "Sweet Dreams":   { tint: { r: 255, g: 200, b: 230 }, hue: 320, label: "pink"    },
};

const defaultTheme = { tint: { r: 255, g: 242, b: 210 }, hue: 40, label: "warm" };

/* ─────────────────────────────────────────────────────────
   SVG OVERLAYS
───────────────────────────────────────────────────────── */

// Dense sparkle field — more stars than before, 3 sizes
const buildSparklesSVG = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c4b5fd" stop-opacity="1"/>
      <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#bfdbfe" stop-opacity="1"/>
      <stop offset="100%" stop-color="#bfdbfe" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- large white glows -->
  <circle cx="${w*0.08}" cy="${h*0.07}" r="12" fill="url(#wg)" opacity="0.9"/>
  <circle cx="${w*0.91}" cy="${h*0.06}" r="14" fill="url(#wg)" opacity="0.85"/>
  <circle cx="${w*0.05}" cy="${h*0.75}" r="11" fill="url(#wg)" opacity="0.8"/>
  <circle cx="${w*0.93}" cy="${h*0.82}" r="13" fill="url(#wg)" opacity="0.85"/>
  <circle cx="${w*0.50}" cy="${h*0.03}" r="10" fill="url(#wg)" opacity="0.75"/>

  <!-- medium gold glows -->
  <circle cx="${w*0.15}" cy="${h*0.05}" r="8"  fill="url(#gg)" opacity="0.9"/>
  <circle cx="${w*0.82}" cy="${h*0.11}" r="9"  fill="url(#gg)" opacity="0.85"/>
  <circle cx="${w*0.07}" cy="${h*0.88}" r="8"  fill="url(#gg)" opacity="0.8"/>
  <circle cx="${w*0.80}" cy="${h*0.93}" r="9"  fill="url(#gg)" opacity="0.85"/>
  <circle cx="${w*0.55}" cy="${h*0.96}" r="7"  fill="url(#gg)" opacity="0.75"/>
  <circle cx="${w*0.28}" cy="${h*0.04}" r="7"  fill="url(#gg)" opacity="0.8"/>
  <circle cx="${w*0.70}" cy="${h*0.97}" r="6"  fill="url(#gg)" opacity="0.7"/>

  <!-- small purple glows -->
  <circle cx="${w*0.97}" cy="${h*0.44}" r="7"  fill="url(#pg)" opacity="0.8"/>
  <circle cx="${w*0.02}" cy="${h*0.50}" r="6"  fill="url(#pg)" opacity="0.75"/>
  <circle cx="${w*0.72}" cy="${h*0.02}" r="6"  fill="url(#pg)" opacity="0.85"/>
  <circle cx="${w*0.20}" cy="${h*0.97}" r="7"  fill="url(#pg)" opacity="0.8"/>
  <circle cx="${w*0.42}" cy="${h*0.98}" r="5"  fill="url(#pg)" opacity="0.7"/>
  <circle cx="${w*0.97}" cy="${h*0.20}" r="5"  fill="url(#pg)" opacity="0.75"/>

  <!-- tiny blue glows scattered -->
  <circle cx="${w*0.22}" cy="${h*0.03}" r="5"  fill="url(#bg)" opacity="0.8"/>
  <circle cx="${w*0.60}" cy="${h*0.02}" r="4"  fill="url(#bg)" opacity="0.75"/>
  <circle cx="${w*0.88}" cy="${h*0.35}" r="5"  fill="url(#bg)" opacity="0.7"/>
  <circle cx="${w*0.03}" cy="${h*0.35}" r="4"  fill="url(#bg)" opacity="0.7"/>
  <circle cx="${w*0.85}" cy="${h*0.96}" r="5"  fill="url(#bg)" opacity="0.75"/>

  <!-- 4-pointed star shapes — large -->
  <path d="M${w*0.30},${h*0.06} l5,-13 l5,13 l13,5 l-13,5 l-5,13 l-5,-13 l-13,-5 z"
        fill="white" opacity="0.9"/>
  <path d="M${w*0.72},${h*0.05} l4,-10 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 z"
        fill="#fde68a" opacity="0.9"/>
  <path d="M${w*0.10},${h*0.55} l3,-8  l3,8  l8,3  l-8,3  l-3,8  l-3,-8  l-8,-3  z"
        fill="white" opacity="0.8"/>
  <path d="M${w*0.90},${h*0.60} l3,-8  l3,8  l8,3  l-8,3  l-3,8  l-3,-8  l-8,-3  z"
        fill="#c4b5fd" opacity="0.85"/>

  <!-- 4-pointed star shapes — small -->
  <path d="M${w*0.50},${h*0.98} l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 z"
        fill="#fde68a" opacity="0.8"/>
  <path d="M${w*0.03},${h*0.20} l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 z"
        fill="white" opacity="0.75"/>
  <path d="M${w*0.96},${h*0.70} l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 z"
        fill="#bfdbfe" opacity="0.8"/>
</svg>`;

// Soft dreamy vignette — darker at edges, clear center
const buildVignetteSVG = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vig" cx="50%" cy="45%" r="65%">
      <stop offset="45%"  stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.65"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;

// Rainbow glow border — thicker, more vivid than before
const buildGlowBorderSVG = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#a78bfa"/>
      <stop offset="20%"  stop-color="#ec4899"/>
      <stop offset="40%"  stop-color="#fde68a"/>
      <stop offset="60%"  stop-color="#6ee7b7"/>
      <stop offset="80%"  stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <!-- outer glow — blurry wide stroke -->
  <rect x="2"  y="2"  width="${w-4}"  height="${h-4}"
        rx="22" ry="22" fill="none"
        stroke="url(#g1)" stroke-width="14" opacity="0.6"/>
  <!-- crisp inner border -->
  <rect x="10" y="10" width="${w-20}" height="${h-20}"
        rx="16" ry="16" fill="none"
        stroke="url(#g1)" stroke-width="5" opacity="0.95"/>
  <!-- white inner edge -->
  <rect x="16" y="16" width="${w-32}" height="${h-32}"
        rx="12" ry="12" fill="none"
        stroke="white"   stroke-width="2" opacity="0.45"/>
</svg>`;

// Bottom gradient — helps text on top of photo stand out
const buildBottomFadeSVG = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bf" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="55%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bf)"/>
</svg>`;

/* ─────────────────────────────────────────────────────────
   DREAMY COLOUR TONING
   Each page gets its own unique colour palette shift.
───────────────────────────────────────────────────────── */
const applyDreamyTone = async (buffer, theme) => {
  return await sharp(buffer)
    .modulate({
      brightness: 1.08,
      saturation: 1.20,
      hue: theme.hue,
    })
    .tint(theme.tint)
    .toBuffer();
};

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT — processPhoto
   No API calls — pure sharp processing.
   Fast: ~0.5s per photo.
───────────────────────────────────────────────────────── */
const processPhoto = async (filePath, pageTitle) => {
  try {
    const theme = pageThemes[pageTitle] || defaultTheme;

    // Load + resize to consistent dimensions
    const originalBuffer = await sharp(filePath)
      .resize({ width: 800, height: 1000, fit: "cover", position: "top" })
      .jpeg({ quality: 88 })
      .toBuffer();

    const meta = await sharp(originalBuffer).metadata();
    const W = meta.width || 800;
    const H = meta.height || 1000;

    // Apply page-specific dreamy colour tone
    const tonedBuffer = await applyDreamyTone(originalBuffer, theme);

    // Composite all overlay layers
    const finalBuffer = await sharp(tonedBuffer)
      .composite([
        { input: Buffer.from(buildBottomFadeSVG(W, H)),  top: 0, left: 0 },
        { input: Buffer.from(buildVignetteSVG(W, H)),    top: 0, left: 0 },
        { input: Buffer.from(buildSparklesSVG(W, H)),    top: 0, left: 0 },
        { input: Buffer.from(buildGlowBorderSVG(W, H)),  top: 0, left: 0 },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64 = finalBuffer.toString("base64");
    console.log(`  ✓ "${pageTitle}" [${theme.label}] → ${Math.round(base64.length / 1024)}KB`);
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.error(`processPhoto failed for "${pageTitle}":`, err.message);
    // Last resort — return raw file
    try {
      const buf = fs.readFileSync(filePath);
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      return null;
    }
  }
};

module.exports = { processPhoto };