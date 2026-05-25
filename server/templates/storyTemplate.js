/* ─────────────────────────────────────────────────────────
   SVG DECORATIONS — no emoji fonts needed
   All shapes drawn as inline SVG so they render identically
   on Render's Linux Chromium (which has no emoji fonts).
───────────────────────────────────────────────────────── */

// Moon crescent
const svgMoon = (color = "#fde68a", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        fill="${color}" opacity="0.9"/>
</svg>`;

// 5-pointed star
const svgStar = (color = "#fde68a", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
           fill="${color}" opacity="0.9"/>
</svg>`;

// 4-pointed sparkle
const svgSparkle = (color = "#ffffff", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill="${color}" opacity="0.9"/>
</svg>`;

// Cloud
const svgCloud = (color = "#ffffff", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
        fill="${color}" opacity="0.75"/>
</svg>`;

// Heart
const svgHeart = (color = "#f9a8d4", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="${color}" opacity="0.9"/>
</svg>`;

// Musical note
const svgNote = (color = "#bfdbfe", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 18V5l12-2v13" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="6" cy="18" r="3" fill="${color}" opacity="0.9"/>
  <circle cx="18" cy="16" r="3" fill="${color}" opacity="0.9"/>
</svg>`;

// Sun / flower burst
const svgSun = (color = "#fde68a", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="5" fill="${color}" opacity="0.9"/>
  <line x1="12" y1="1"  x2="12" y2="3"  stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="21" x2="12" y2="23" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="1"  y1="12" x2="3"  y2="12" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="21" y1="12" x2="23" y2="12" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke="${color}" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// Book (open)
const svgBook = (color = "#bbf7d0", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="${color}" opacity="0.85"/>
  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="${color}" opacity="0.85"/>
</svg>`;

// Flower
const svgFlower = (color = "#99f6e4", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="3" fill="${color}"/>
  <ellipse cx="12" cy="6"  rx="2.5" ry="4" fill="${color}" opacity="0.7"/>
  <ellipse cx="12" cy="18" rx="2.5" ry="4" fill="${color}" opacity="0.7"/>
  <ellipse cx="6"  cy="12" rx="4" ry="2.5" fill="${color}" opacity="0.7"/>
  <ellipse cx="18" cy="12" rx="4" ry="2.5" fill="${color}" opacity="0.7"/>
  <ellipse cx="7.76" cy="7.76" rx="2.5" ry="4" transform="rotate(45 7.76 7.76)" fill="${color}" opacity="0.6"/>
  <ellipse cx="16.24" cy="16.24" rx="2.5" ry="4" transform="rotate(45 16.24 16.24)" fill="${color}" opacity="0.6"/>
</svg>`;

// Diamond / gem
const svgGem = (color = "#fbcfe8", size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <polygon points="12,2 22,9 12,22 2,9" fill="${color}" opacity="0.85"/>
  <polygon points="12,2 22,9 12,13 2,9" fill="${color}" opacity="0.5"/>
</svg>`;

/* ─────────────────────────────────────────────────────────
   PAGE THEMES — full background + SVG icons per page
───────────────────────────────────────────────────────── */
const PAGE_THEMES = {
  "Bath Time": {
    bg: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 40%, #38bdf8 100%)",
    titleColor: "#bae6fd",
    icons: [svgMoon("#bae6fd"), svgSparkle("#ffffff"), svgCloud("#bae6fd"), svgStar("#ffffff")],
    accentBorder: "rgba(186,230,253,0.25)",
    accentGlow: "rgba(56,189,248,0.12)",
  },
  "Pajama Time": {
    bg: "linear-gradient(160deg, #1e1b4b 0%, #4c1d95 45%, #7c3aed 100%)",
    titleColor: "#ddd6fe",
    icons: [svgMoon("#ddd6fe"), svgStar("#fde68a"), svgSparkle("#ddd6fe"), svgCloud("#c4b5fd")],
    accentBorder: "rgba(221,214,254,0.25)",
    accentGlow: "rgba(124,58,237,0.12)",
  },
  "Family Cuddle": {
    bg: "linear-gradient(160deg, #431407 0%, #9a3412 45%, #f97316 100%)",
    titleColor: "#fed7aa",
    icons: [svgHeart("#fca5a5"), svgStar("#fde68a"), svgSparkle("#fed7aa"), svgHeart("#fb923c")],
    accentBorder: "rgba(254,215,170,0.25)",
    accentGlow: "rgba(249,115,22,0.12)",
  },
  "Story Time": {
    bg: "linear-gradient(160deg, #14532d 0%, #166534 45%, #16a34a 100%)",
    titleColor: "#bbf7d0",
    icons: [svgBook("#bbf7d0"), svgSparkle("#fde68a"), svgStar("#bbf7d0"), svgSparkle("#ffffff")],
    accentBorder: "rgba(187,247,208,0.25)",
    accentGlow: "rgba(74,222,128,0.12)",
  },
  "Lullaby Time": {
    bg: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #1d4ed8 100%)",
    titleColor: "#bfdbfe",
    icons: [svgMoon("#bfdbfe"), svgNote("#bfdbfe"), svgStar("#fde68a"), svgSparkle("#bfdbfe")],
    accentBorder: "rgba(191,219,254,0.25)",
    accentGlow: "rgba(29,78,216,0.12)",
  },
  "Goodnight Kiss": {
    bg: "linear-gradient(160deg, #134e4a 0%, #0f766e 45%, #0d9488 100%)",
    titleColor: "#99f6e4",
    icons: [svgFlower("#99f6e4"), svgSparkle("#ffffff"), svgStar("#fde68a"), svgFlower("#5eead4")],
    accentBorder: "rgba(153,246,228,0.25)",
    accentGlow: "rgba(45,212,191,0.12)",
  },
  "Sweet Dreams": {
    bg: "linear-gradient(160deg, #500724 0%, #9d174d 45%, #db2777 100%)",
    titleColor: "#fbcfe8",
    icons: [svgGem("#fbcfe8"), svgStar("#fde68a"), svgSparkle("#fbcfe8"), svgHeart("#fda4af")],
    accentBorder: "rgba(251,207,232,0.25)",
    accentGlow: "rgba(244,114,182,0.12)",
  },
};

const DEFAULT_THEME = {
  bg: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%)",
  titleColor: "#fde68a",
  icons: [svgMoon(), svgStar(), svgCloud(), svgSparkle()],
  accentBorder: "rgba(253,230,138,0.2)",
  accentGlow: "rgba(49,46,129,0.12)",
};

/* ─────────────────────────────────────────────────────────
   SCATTERED BACKGROUND DECORATIONS (SVG dots + crosses)
   No emojis — pure SVG shapes
───────────────────────────────────────────────────────── */
const buildBgDecorations = (color) => `
  <!-- tiny 4-point crosses scattered in background -->
  <div style="position:absolute;top:9%;left:5%;opacity:0.18;z-index:1;">${svgSparkle(color, 18)}</div>
  <div style="position:absolute;top:18%;right:6%;opacity:0.15;z-index:1;">${svgStar(color, 16)}</div>
  <div style="position:absolute;top:32%;left:3%;opacity:0.12;z-index:1;">${svgSparkle(color, 14)}</div>
  <div style="position:absolute;top:48%;right:4%;opacity:0.15;z-index:1;">${svgStar(color, 16)}</div>
  <div style="position:absolute;bottom:28%;left:4%;opacity:0.18;z-index:1;">${svgSparkle(color, 18)}</div>
  <div style="position:absolute;bottom:16%;right:5%;opacity:0.15;z-index:1;">${svgStar(color, 16)}</div>
  <div style="position:absolute;bottom:9%;left:48%;opacity:0.12;z-index:1;">${svgSparkle(color, 14)}</div>
  <div style="position:absolute;top:8%;left:48%;opacity:0.12;z-index:1;">${svgStar(color, 14)}</div>`;

/* ─────────────────────────────────────────────────────────
   MAIN HTML GENERATOR
───────────────────────────────────────────────────────── */
const generateStoryHTML = ({ babyName, pages }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${babyName} Dream Book</title>
<style>

* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Georgia, serif; background: white; }

.page {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  position: relative;
  page-break-after: always;
}
.page:last-child { page-break-after: avoid; }

/* COVER */
.cover-page {
  background:
    linear-gradient(rgba(10,10,40,0.5), rgba(10,10,40,0.65)),
    linear-gradient(135deg, #1e1b4b, #6d28d9, #db2777);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 48px;
}
.cover-title {
  font-family: Georgia, serif;
  font-size: 56px;
  line-height: 1.3;
  width: 85%;
  text-shadow: 0 6px 24px rgba(0,0,0,0.5);
  color: white;
}
.cover-sub {
  margin-top: 28px;
  font-size: 24px;
  color: rgba(255,255,255,0.85);
}
.cover-dec {
  position: absolute;
}

/* STORY PAGE */
.story-page {
  color: white;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-family: Georgia, serif;
  text-align: center;
  font-size: 40px;
  margin-top: 6px;
  margin-bottom: 16px;
  text-shadow: 0 4px 16px rgba(0,0,0,0.4);
  position: relative;
  z-index: 2;
}

/* corner icons */
.corner-icon {
  position: absolute;
  z-index: 2;
}
.ci1 { top:16px;    left:18px;  }
.ci2 { top:18px;    right:18px; }
.ci3 { bottom:16px; left:18px;  }
.ci4 { bottom:18px; right:18px; }

/* photo */
.photo-wrap {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 2;
}
.photo-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.circle-photo {
  width: 370px;
  height: 480px;
  border-radius: 50% / 42%;
}
.square-photo {
  width: 76%;
  height: 53%;
  border-radius: 30px;
  margin-top: 4px;
  margin-bottom: 16px;
}

/* text boxes */
.circle-top-text {
  width: 88%;
  text-align: center;
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 10px;
  color: white;
  font-weight: 600;
  position: relative;
  z-index: 2;
}
.circle-bottom-text {
  width: 88%;
  text-align: center;
  font-size: 19px;
  line-height: 1.65;
  border-radius: 28px;
  padding: 14px 22px;
  color: white;
  font-weight: 600;
  margin-top: 10px;
  position: relative;
  z-index: 2;
}
.square-text {
  width: 88%;
  text-align: center;
  font-size: 23px;
  line-height: 1.8;
  color: white;
  border-radius: 28px;
  padding: 20px 24px;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.page-number {
  position: absolute;
  bottom: 12px;
  right: 20px;
  font-size: 16px;
  font-weight: bold;
  z-index: 2;
}

</style>
</head>
<body>

${pages.map((page, index) => {

  /* COVER */
  if (page.type === "cover") {
    return `
<div class="page cover-page">
  <div class="cover-dec" style="top:6%;left:7%;">${svgMoon("#fde68a", 40)}</div>
  <div class="cover-dec" style="top:10%;right:8%;">${svgStar("#ffffff", 36)}</div>
  <div class="cover-dec" style="bottom:10%;left:9%;">${svgCloud("#c4b5fd", 38)}</div>
  <div class="cover-dec" style="bottom:7%;right:7%;">${svgSparkle("#fde68a", 34)}</div>
  <div class="cover-dec" style="top:38%;left:3%;">${svgSparkle("#ffffff", 22)}</div>
  <div class="cover-dec" style="top:55%;right:3%;">${svgStar("#fde68a", 20)}</div>
  <h1 class="cover-title">${page.text}</h1>
  <p class="cover-sub">A Magical Bedtime Adventure</p>
</div>`;
  }

  /* STORY PAGES */
  const theme = PAGE_THEMES[page.title] || DEFAULT_THEME;
  const [ic1, ic2, ic3, ic4] = theme.icons;
  const bgDeco = buildBgDecorations(theme.titleColor);
  const textBoxStyle = `background:${theme.accentGlow};border:1px solid ${theme.accentBorder};`;

  const photoImg = page.photoPath
    ? `<img src="${page.photoPath}" alt="${page.title}" onerror="this.style.display='none'"/>`
    : "";

  const isCirclePage = index % 2 === 1;

  if (isCirclePage) {
    return `
<div class="page story-page" style="background:${theme.bg};">
  ${bgDeco}
  <div class="corner-icon ci1">${ic1}</div>
  <div class="corner-icon ci2">${ic2}</div>
  <div class="corner-icon ci3">${ic3}</div>
  <div class="corner-icon ci4">${ic4}</div>

  <h2 class="page-title" style="color:${theme.titleColor};">${page.title}</h2>

  <div class="circle-top-text">
    Tonight the stars shone just for little <strong>${babyName}</strong>,
    lighting the way to a world full of magic
  </div>

  <div class="photo-wrap circle-photo">
    ${photoImg}
  </div>

  <div class="circle-bottom-text" style="${textBoxStyle}">
    ${page.text}
  </div>

  <div class="page-number" style="color:${theme.titleColor};">${page.pageNumber}</div>
</div>`;
  }

  return `
<div class="page story-page" style="background:${theme.bg};">
  ${bgDeco}
  <div class="corner-icon ci1">${ic1}</div>
  <div class="corner-icon ci2">${ic2}</div>
  <div class="corner-icon ci3">${ic3}</div>
  <div class="corner-icon ci4">${ic4}</div>

  <h2 class="page-title" style="color:${theme.titleColor};">${page.title}</h2>

  <div class="photo-wrap square-photo">
    ${photoImg}
  </div>

  <div class="square-text" style="${textBoxStyle}">
    ${page.text}
  </div>

  <div class="page-number" style="color:${theme.titleColor};">${page.pageNumber}</div>
</div>`;

}).join("")}

</body>
</html>`;
};

module.exports = { generateStoryHTML };