/**
 * ShipOptimize - Meesho & eCommerce Image Optimization SaaS
 * TypeScript — 15 total variations
 * Group A (5): Border + Badge on original size
 * Group B (5): Resize to Meesho dims + Border + Badge
 * Group C (5): Background colour replacement + Border + Badge
 */

import { useState, useRef, useEffect } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface DimConfig { w: number; h: number; label: string; quality: number; }

interface BorderVariation {
  id: string; group: "A"; name: string; tag: string; desc: string;
  borderColor: string; badge: string | null; cardBg: string; accent: string;
  score: number; fileSizeNote: string; recommended: boolean; dims?: undefined; bgColor?: undefined;
}

interface DimensionVariation {
  id: string; group: "B"; name: string; tag: string; desc: string;
  dims: DimConfig; borderColor: string; badge: string | null;
  cardBg: string; accent: string; score: number; fileSizeNote: string; recommended: boolean; bgColor?: undefined;
}

interface BgColorVariation {
  id: string; group: "C" | "D"; name: string; tag: string; desc: string;
  bgColor: string; bgLabel: string; borderColor: string; badge: string | null;
  cardBg: string; accent: string; score: number; fileSizeNote: string; recommended: boolean; dims?: undefined;
}

type Variation = BorderVariation | DimensionVariation | BgColorVariation;

interface HistoryItem { original: string; category: string; time: number; count: number; }

// ─── MEESHO STANDARD DIMENSIONS ───────────────────────────────────────────────

const MEESHO_DIMS: Record<string, DimConfig> = {
  SQUARE_HD:     { w: 1080, h: 1080, label: "1080×1080", quality: 0.82 },
  SQUARE_LITE:   { w: 800,  h: 800,  label: "800×800",   quality: 0.72 },
  SQUARE_MIN:    { w: 500,  h: 500,  label: "500×500",   quality: 0.65 },
  PORTRAIT_HD:   { w: 900,  h: 1200, label: "900×1200",  quality: 0.78 },
  PORTRAIT_COMP: { w: 720,  h: 960,  label: "720×960",   quality: 0.68 },
};

// ─── VARIATION CONFIG ─────────────────────────────────────────────────────────

const BORDER_VARIATIONS: BorderVariation[] = [
  { id: "purple-plain",      group: "A", name: "Purple Border",        tag: "Trending",        desc: "Bold purple frame — most popular on Meesho",      borderColor: "#9333ea", badge: null,         cardBg: "#faf5ff", accent: "#9333ea", score: 88, fileSizeNote: "Original size", recommended: false },
  { id: "yellow-bestseller", group: "A", name: "Yellow + Bestseller",  tag: "🏆 Best Seller",  desc: "Yellow border + Bestseller badge",                 borderColor: "#eab308", badge: "bestseller", cardBg: "#fefce8", accent: "#ca8a04", score: 90, fileSizeNote: "Original size", recommended: false },
  { id: "white-plain",       group: "A", name: "White Border",         tag: "✨ Clean Look",   desc: "Crisp white frame — clean professional style",     borderColor: "#ffffff", badge: null,         cardBg: "#f8fafc", accent: "#64748b", score: 85, fileSizeNote: "Original size", recommended: false },
  { id: "red-sale",          group: "A", name: "Red + SALE Badge",     tag: "🔥 Hot Deal",     desc: "Bold red border + SALE badge — maximum attention", borderColor: "#dc2626", badge: "sale",       cardBg: "#fef2f2", accent: "#dc2626", score: 87, fileSizeNote: "Original size", recommended: false },
  { id: "teal-quality",      group: "A", name: "Teal + Quality Badge", tag: "💎 Premium",      desc: "Teal border + Best Quality badge",                 borderColor: "#0d9488", badge: "quality",    cardBg: "#f0fdfa", accent: "#0d9488", score: 89, fileSizeNote: "Original size", recommended: false },
];

const DIMENSION_VARIATIONS: DimensionVariation[] = [
  { id: "resize-1080-white",  group: "B", name: "1080px + White Border",   tag: "📐 1080×1080",    desc: "Meesho standard 1080×1080 + white border",              dims: MEESHO_DIMS.SQUARE_HD,     borderColor: "#ffffff", badge: null,         cardBg: "#f0f9ff", accent: "#0284c7", score: 93, fileSizeNote: "~120–180 KB", recommended: false },
  { id: "resize-800-orange",  group: "B", name: "800px + Orange Border",   tag: "⚡ 800×800",       desc: "800×800 lightweight + orange border + Bestseller",      dims: MEESHO_DIMS.SQUARE_LITE,   borderColor: "#ea580c", badge: "bestseller", cardBg: "#fff7ed", accent: "#ea580c", score: 95, fileSizeNote: "~70–100 KB",  recommended: false },
  { id: "resize-500-green",   group: "B", name: "500px + Green Border",    tag: "🔥 Smallest File", desc: "500×500 min spec + green border — smallest file size",  dims: MEESHO_DIMS.SQUARE_MIN,    borderColor: "#16a34a", badge: "quality",    cardBg: "#f0fdf4", accent: "#16a34a", score: 99, fileSizeNote: "~30–50 KB",   recommended: true  },
  { id: "resize-port-black",  group: "B", name: "Portrait + Black Border", tag: "👗 900×1200",      desc: "900×1200 portrait + black border — best for kurtis",   dims: MEESHO_DIMS.PORTRAIT_HD,   borderColor: "#1e293b", badge: null,         cardBg: "#f8fafc", accent: "#334155", score: 92, fileSizeNote: "~100–150 KB", recommended: false },
  { id: "resize-720-pink",    group: "B", name: "720px + Pink + SALE",     tag: "📦 720×960",       desc: "720×960 compressed + pink border + SALE badge",        dims: MEESHO_DIMS.PORTRAIT_COMP, borderColor: "#ec4899", badge: "sale",       cardBg: "#fdf2f8", accent: "#db2777", score: 97, fileSizeNote: "~50–75 KB",   recommended: false },
];

const BGCHANGE_VARIATIONS: BgColorVariation[] = [
  { id: "bg-lavender", group: "C", name: "Lavender Background",  tag: "💜 Pastel Vibe",    desc: "Soft lavender bg — ideal for fashion & lifestyle products",  bgColor: "#ede9fe", bgLabel: "Lavender",  borderColor: "#9333ea", badge: null,         cardBg: "#f5f3ff", accent: "#9333ea", score: 91, fileSizeNote: "Original size", recommended: false },
  { id: "bg-skyblue",  group: "C", name: "Sky Blue Background",  tag: "🩵 Fresh & Cool",   desc: "Sky blue bg + SALE badge — fresh look, high click rate",      bgColor: "#e0f2fe", bgLabel: "Sky Blue",  borderColor: "#0284c7", badge: "sale",       cardBg: "#f0f9ff", accent: "#0284c7", score: 92, fileSizeNote: "Original size", recommended: false },
  { id: "bg-mint",     group: "C", name: "Mint Green Background",tag: "🌿 Natural Feel",   desc: "Mint green bg + Quality badge — natural, clean aesthetic",    bgColor: "#dcfce7", bgLabel: "Mint",      borderColor: "#16a34a", badge: "quality",    cardBg: "#f0fdf4", accent: "#16a34a", score: 93, fileSizeNote: "Original size", recommended: false },
  { id: "bg-peach",    group: "C", name: "Peach Background",     tag: "🍑 Warm & Trendy",  desc: "Warm peach bg + Bestseller badge — top performer for kurtas", bgColor: "#fee2e2", bgLabel: "Peach",     borderColor: "#ea580c", badge: "bestseller", cardBg: "#fff7ed", accent: "#ea580c", score: 94, fileSizeNote: "Original size", recommended: false },
  { id: "bg-yellow",   group: "C", name: "Sunshine Background",  tag: "☀️ Eye-Catching",   desc: "Bright yellow bg + red border — maximum marketplace attention",bgColor: "#fef9c3", bgLabel: "Sunshine",  borderColor: "#ca8a04", badge: null,         cardBg: "#fefce8", accent: "#ca8a04", score: 90, fileSizeNote: "Original size", recommended: false },
];

const BGCHANGE_VARIATIONS2: BgColorVariation[] = [
  { id: "bg2-rose",      group: "D", name: "Rose Pink Background",  tag: "🌸 Girly & Bold",   desc: "Vibrant rose bg + purple border — perfect for women's ethnic",   bgColor: "#fce7f3", bgLabel: "Rose Pink",  borderColor: "#9333ea", badge: "bestseller", cardBg: "#fdf2f8", accent: "#be185d", score: 92, fileSizeNote: "Original size", recommended: false },
  { id: "bg2-coral",     group: "D", name: "Coral Background",      tag: "🪸 Vibrant Pop",    desc: "Coral bg + gold border + SALE — bold, energetic listing look",    bgColor: "#ffe4d6", bgLabel: "Coral",      borderColor: "#b45309", badge: "sale",       cardBg: "#fff7ed", accent: "#c2410c", score: 91, fileSizeNote: "Original size", recommended: false },
  { id: "bg2-lilac",     group: "D", name: "Lilac Background",      tag: "🔮 Soft Premium",   desc: "Soft lilac bg + teal border — modern premium marketplace style",  bgColor: "#f3e8ff", bgLabel: "Lilac",      borderColor: "#0d9488", badge: "quality",    cardBg: "#faf5ff", accent: "#7c3aed", score: 93, fileSizeNote: "Original size", recommended: false },
  { id: "bg2-aqua",      group: "D", name: "Aqua Background",       tag: "🌊 Cool & Fresh",   desc: "Aqua bg + pink border — cool contrast, eye-catching combo",       bgColor: "#cffafe", bgLabel: "Aqua",       borderColor: "#ec4899", badge: null,         cardBg: "#ecfeff", accent: "#0891b2", score: 90, fileSizeNote: "Original size", recommended: false },
  { id: "bg2-champagne", group: "D", name: "Champagne Background",  tag: "✨ Luxury Feel",    desc: "Warm champagne bg + black border — classy premium product look",  bgColor: "#fef3c7", bgLabel: "Champagne",  borderColor: "#1e293b", badge: null,         cardBg: "#fffbeb", accent: "#92400e", score: 94, fileSizeNote: "Original size", recommended: false },
];

const ALL_VARIATIONS: Variation[] = [...BORDER_VARIATIONS, ...DIMENSION_VARIATIONS, ...BGCHANGE_VARIATIONS, ...BGCHANGE_VARIATIONS2];

// ─── BADGE & BORDER HELPERS ───────────────────────────────────────────────────

function drawBorder(ctx: CanvasRenderingContext2D, W: number, H: number, color: string): number {
  const bw = Math.round(Math.min(W, H) * 0.034);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, bw);
  ctx.fillRect(0, H - bw, W, bw);
  ctx.fillRect(0, 0, bw, H);
  ctx.fillRect(W - bw, 0, bw, H);
  if (color === "#ffffff") {
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2;
    ctx.strokeRect(bw, bw, W - bw * 2, H - bw * 2);
  }
  return bw;
}

function drawBadgeBestseller(ctx: CanvasRenderingContext2D, W: number, _H: number, bw: number) {
  const cx = W - bw * 3.2, cy = bw * 3.2, r = bw * 2.4;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = "#1c1917"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, Math.PI * 2); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.font = `bold ${Math.round(r * 0.5)}px Arial`; ctx.fillStyle = "#f59e0b"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("Best", cx, cy - r * 0.2);
  ctx.font = `bold ${Math.round(r * 0.42)}px Arial`; ctx.fillText("Seller", cx, cy + r * 0.28);
}

function drawBadgeSale(ctx: CanvasRenderingContext2D, _W: number, _H: number, bw: number) {
  const bx = bw * 0.8, by = bw * 0.8, bW = bw * 4.5, bH = bw * 1.8, r = bH * 0.38;
  ctx.beginPath();
  ctx.moveTo(bx + r, by); ctx.lineTo(bx + bW - r, by); ctx.arcTo(bx + bW, by, bx + bW, by + r, r);
  ctx.lineTo(bx + bW, by + bH - r); ctx.arcTo(bx + bW, by + bH, bx + bW - r, by + bH, r);
  ctx.lineTo(bx + r, by + bH); ctx.arcTo(bx, by + bH, bx, by + bH - r, r);
  ctx.lineTo(bx, by + r); ctx.arcTo(bx, by, bx + r, by, r); ctx.closePath();
  ctx.fillStyle = "#dc2626"; ctx.fill();
  ctx.font = `900 ${Math.round(bH * 0.6)}px Arial`; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("SALE", bx + bW / 2, by + bH / 2);
}

function drawBadgeQuality(ctx: CanvasRenderingContext2D, _W: number, _H: number, bw: number) {
  const cx = bw * 3, cy = bw * 3, r = bw * 2.3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = "#15803d"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r - 3.5, 0, Math.PI * 2); ctx.strokeStyle = "#86efac"; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = `bold ${Math.round(r * 0.44)}px Arial`; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("BEST", cx, cy - r * 0.24);
  ctx.font = `bold ${Math.round(r * 0.36)}px Arial`; ctx.fillText("QUALITY", cx, cy + r * 0.28);
}

function applyBorderAndBadge(ctx: CanvasRenderingContext2D, W: number, H: number, borderColor: string, badge: string | null) {
  const bw = drawBorder(ctx, W, H, borderColor);
  if (badge === "bestseller") drawBadgeBestseller(ctx, W, H, bw);
  if (badge === "sale")       drawBadgeSale(ctx, W, H, bw);
  if (badge === "quality")    drawBadgeQuality(ctx, W, H, bw);
}

// ─── BACKGROUND REPLACEMENT HELPER ───────────────────────────────────────────
/**
 * Replaces the background of an image using a flood-fill from all 4 corners.
 * Samples the corner regions to detect background color, then replaces
 * pixels within tolerance with the new background color.
 * Works well for product photos taken against plain walls/backgrounds.
 */
function replaceBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  newBgColor: string
): void {
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;

  // Parse new background color (hex → RGB)
  const nr = parseInt(newBgColor.slice(1, 3), 16);
  const ng = parseInt(newBgColor.slice(3, 5), 16);
  const nb = parseInt(newBgColor.slice(5, 7), 16);

  // Sample multiple corner pixels to get average background color
  const samplePoints = [
    [2, 2], [W - 3, 2], [2, H - 3], [W - 3, H - 3],
    [Math.floor(W / 2), 2], [2, Math.floor(H / 2)],
    [W - 3, Math.floor(H / 2)], [Math.floor(W / 2), H - 3],
  ];

  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  for (const [sx, sy] of samplePoints) {
    const idx = (sy * W + sx) * 4;
    if (idx >= 0 && idx < data.length - 3) {
      sumR += data[idx]; sumG += data[idx + 1]; sumB += data[idx + 2];
      count++;
    }
  }
  const bgR = Math.round(sumR / count);
  const bgG = Math.round(sumG / count);
  const bgB = Math.round(sumB / count);

  // Tolerance — how different a pixel can be from bg color and still be replaced
  // Higher = replaces more background but risks eating into product edges
  const TOLERANCE = 55;

  // BFS flood fill from all 4 corners simultaneously
  const visited = new Uint8Array(W * H);
  const queue: number[] = [];

  function enqueue(x: number, y: number) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const pos = y * W + x;
    if (visited[pos]) return;
    const idx = pos * 4;
    const dr = data[idx] - bgR;
    const dg = data[idx + 1] - bgG;
    const db = data[idx + 2] - bgB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist > TOLERANCE) return;
    visited[pos] = 1;
    queue.push(pos);
  }

  // Seed from all 4 corners + edges
  for (let x = 0; x < W; x++) { enqueue(x, 0); enqueue(x, H - 1); }
  for (let y = 0; y < H; y++) { enqueue(0, y); enqueue(W - 1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const pos = queue[qi++];
    const x = pos % W;
    const y = Math.floor(pos / W);
    const idx = pos * 4;

    // Replace with new background color
    data[idx]     = nr;
    data[idx + 1] = ng;
    data[idx + 2] = nb;
    data[idx + 3] = 255;

    enqueue(x + 1, y); enqueue(x - 1, y);
    enqueue(x, y + 1); enqueue(x, y - 1);
  }

  ctx.putImageData(imageData, 0, 0);
}

// ─── CANVAS PROCESSORS ────────────────────────────────────────────────────────

async function processBorderVariation(imageSrc: string, variation: BorderVariation): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error("Timeout")), 12000);
    img.onerror = () => { clearTimeout(timer); reject(new Error("Load error")); };
    img.onload = () => {
      clearTimeout(timer);
      try {
        const W = img.naturalWidth, H = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No ctx")); return; }
        ctx.drawImage(img, 0, 0, W, H);
        applyBorderAndBadge(ctx, W, H, variation.borderColor, variation.badge);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch (err) { reject(err); }
    };
    img.src = imageSrc;
  });
}

async function processDimensionVariation(imageSrc: string, variation: DimensionVariation): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error("Timeout")), 12000);
    img.onerror = () => { clearTimeout(timer); reject(new Error("Load error")); };
    img.onload = () => {
      clearTimeout(timer);
      try {
        const { w: TW, h: TH, quality } = variation.dims;
        const canvas = document.createElement("canvas");
        canvas.width = TW; canvas.height = TH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No ctx")); return; }
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, TW, TH);
        const maxW = TW * 0.90, maxH = TH * 0.90;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
        const dw = Math.round(img.naturalWidth * scale);
        const dh = Math.round(img.naturalHeight * scale);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, Math.round((TW - dw) / 2), Math.round((TH - dh) / 2), dw, dh);
        applyBorderAndBadge(ctx, TW, TH, variation.borderColor, variation.badge);
        ctx.font = `500 ${Math.round(TH * 0.018)}px Arial`;
        ctx.fillStyle = "rgba(160,160,160,0.6)"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        ctx.fillText(`${TW}×${TH}`, TW - 10, TH - 7);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) { reject(err); }
    };
    img.src = imageSrc;
  });
}

/**
 * Group C: Background colour replacement.
 * 1. Draw original image
 * 2. BFS flood-fill replace background with new solid colour
 * 3. Apply colored border on top
 * 4. Apply badge sticker
 */
async function processBgColorVariation(imageSrc: string, variation: BgColorVariation): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error("Timeout")), 12000);
    img.onerror = () => { clearTimeout(timer); reject(new Error("Load error")); };
    img.onload = () => {
      clearTimeout(timer);
      try {
        const W = img.naturalWidth, H = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No ctx")); return; }

        // Step 1: Draw original
        ctx.drawImage(img, 0, 0, W, H);

        // Step 2: Replace background colour using BFS flood fill
        replaceBackground(ctx, W, H, variation.bgColor);

        // Step 3: Apply border + badge on top
        applyBorderAndBadge(ctx, W, H, variation.borderColor, variation.badge);

        resolve(canvas.toDataURL("image/jpeg", 0.90));
      } catch (err) { reject(err); }
    };
    img.src = imageSrc;
  });
}

async function processVariation(imageSrc: string, variation: Variation): Promise<string> {
  if (variation.group === "A") return processBorderVariation(imageSrc, variation as BorderVariation);
  if (variation.group === "B") return processDimensionVariation(imageSrc, variation as DimensionVariation);
  return processBgColorVariation(imageSrc, variation as BgColorVariation); // handles C and D
}

function estimateKB(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4 / 1024);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { group: "Women", items: ["Kurtis", "Tops & Tunics", "Dresses", "Sarees", "Leggings & Palazzos"] },
  { group: "Men",   items: ["T-Shirts", "Shirts", "Trousers", "Ethnic Wear"] },
  { group: "Kids",  items: ["Girls Topwear", "Boys Topwear", "Kids Dresses", "Infant Wear"] },
  { group: "Home",  items: ["Home Decor", "Bedsheets", "Curtains", "Kitchen Linens"] },
];

function CategoryDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const all = CATEGORIES.flatMap((g) => g.items.map((i) => `${g.group} > ${i}`));
  const filtered = all.filter((c) => c.toLowerCase().includes(search.toLowerCase()));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => { setOpen(!open); setCustomMode(false); }}
        style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: value ? "#1e293b" : "#94a3b8", fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <span>{value || "Select product category..."}</span>
        <span style={{ color: "#94a3b8", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", zIndex: 1000, maxHeight: 300, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
            <input autoFocus placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map((cat) => (
              <button key={cat} onClick={() => { onChange(cat); setOpen(false); }}
                style={{ width: "100%", padding: "9px 16px", border: "none", background: cat === value ? "#f0f9ff" : "transparent", color: cat === value ? "#0284c7" : "#374151", fontSize: 13.5, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>{cat}</button>
            ))}
            <button onClick={() => { setCustomMode(true); setOpen(false); }}
              style={{ width: "100%", padding: "10px 16px", border: "none", borderTop: "1px solid #f1f5f9", background: "transparent", color: "#6366f1", fontSize: 13.5, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>+ Add Custom Category</button>
          </div>
        </div>
      )}
      {customMode && (
        <input autoFocus placeholder="Type custom category and press Enter..."
          onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLInputElement).value) { onChange((e.target as HTMLInputElement).value); setCustomMode(false); } }}
          style={{ marginTop: 8, width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid #6366f1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", color: "#1e293b" }} />
      )}
    </div>
  );
}

function UploadZone({ onFile, preview, originalKB }: { onFile: (f: File) => void; preview: string | null; originalKB: number | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDrag(false); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith("image/")) onFile(file); };
  return (
    <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={handleDrop}
      style={{ border: `2px dashed ${drag ? "#6366f1" : preview ? "#e2e8f0" : "#cbd5e1"}`, borderRadius: 16, background: drag ? "#f0f4ff" : preview ? "#fafafa" : "#f8fafc", minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {preview ? (
        <>
          <img src={preview} alt="Product" style={{ maxHeight: 240, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }} />
          {originalKB && <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(15,23,42,0.8)", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap" }}>Original: ~{originalKB} KB</div>}
          <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ position: "absolute", top: 12, right: 12, background: "#1e293b", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>↺ Change</button>
        </>
      ) : (
        <>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg, #ede9fe, #dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 18 }}>🖼️</div>
          <div style={{ color: "#1e293b", fontWeight: 700, fontSize: 17, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Drop your product image here</div>
          <div style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>JPG, PNG, WebP — any size</div>
          <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", padding: "11px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(99,102,241,0.35)" }}>Browse Files</button>
          <div style={{ marginTop: 12, color: "#cbd5e1", fontSize: 11, fontFamily: "monospace" }}>Secure · Fast · No data stored</div>
        </>
      )}
    </div>
  );
}

function VariationCard({ variation, dataUrl, isLoading, onDownload, originalKB }: {
  variation: Variation; dataUrl: string | null; isLoading: boolean;
  onDownload: (url: string, name: string) => void; originalKB: number | null;
}) {
  const kb = dataUrl ? estimateKB(dataUrl) : null;
  const saving = kb !== null && originalKB !== null ? Math.round(((originalKB - kb) / originalKB) * 100) : null;
  const isGroupB = variation.group === "B";
  const isGroupC = variation.group === "C";
  const isGroupD = variation.group === "D";
  const isBgGroup = isGroupC || isGroupD;
  const borderColor = "borderColor" in variation ? variation.borderColor : "#6366f1";
  const badge = "badge" in variation ? variation.badge : null;
  const bgColor = isBgGroup ? (variation as BgColorVariation).bgColor : null;
  const bgLabel = isBgGroup ? (variation as BgColorVariation).bgLabel : null;

  const groupLabel = isGroupD ? "🎨 BG CHANGE D" : isGroupC ? "🎨 BG CHANGE" : isGroupB ? "📐 RESIZE" : "🖼️ BORDER";
  const groupBg    = isGroupD ? "#be185d"          : isGroupC ? "#7c3aed"       : isGroupB ? "#0f172a"  : "#6366f1";
  const dlBg       = variation.recommended
    ? "linear-gradient(135deg, #22c55e, #16a34a)"
    : isGroupD ? "linear-gradient(135deg, #be185d, #9333ea)"
    : isGroupC ? "linear-gradient(135deg, #7c3aed, #9333ea)"
    : isGroupB ? "linear-gradient(135deg, #0284c7, #2563eb)"
    : "linear-gradient(135deg, #6366f1, #8b5cf6)";

  return (
    <div style={{ borderRadius: 16, border: variation.recommended ? "2px solid #22c55e" : "1.5px solid #e2e8f0", background: "#fff", overflow: "hidden", boxShadow: variation.recommended ? "0 8px 32px rgba(34,197,94,0.15)" : "0 2px 8px rgba(0,0,0,0.06)", transition: "transform 0.2s", position: "relative" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; }}>

      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, background: groupBg, color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.06em" }}>{groupLabel}</div>
      {variation.recommended && <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "#22c55e", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800, fontFamily: "monospace" }}>✓ BEST</div>}

      {/* Preview */}
      <div style={{ height: 210, background: variation.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${variation.accent}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
            <span style={{ color: variation.accent, fontSize: 11, fontFamily: "monospace" }}>{isBgGroup ? "Replacing BG..." : "Processing..."}</span>
          </div>
        ) : dataUrl ? (
          <>
            <img src={dataUrl} alt={variation.name} style={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain" }} />
            {kb !== null && (
              <div style={{ position: "absolute", bottom: 8, right: 8, background: saving !== null && saving > 0 ? "#16a34a" : "#475569", color: "#fff", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}>
                {kb} KB{saving !== null && saving > 0 ? ` ↓${saving}%` : ""}
              </div>
            )}
          </>
        ) : <span style={{ color: "#e2e8f0", fontSize: 36 }}>◌</span>}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{variation.name}</div>
            <div style={{ fontSize: 11, color: variation.accent, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{variation.tag}</div>
          </div>
          <div style={{ textAlign: "center", background: "#f8fafc", borderRadius: 8, padding: "3px 8px", marginLeft: 8, flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: variation.accent, fontFamily: "monospace" }}>{variation.score}</div>
            <div style={{ fontSize: 8, color: "#94a3b8", fontFamily: "monospace" }}>SCORE</div>
          </div>
        </div>

        <div style={{ color: "#64748b", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, lineHeight: 1.4 }}>{variation.desc}</div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Bg color swatch for Group C */}
          {bgColor && bgLabel && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8fafc", borderRadius: 5, padding: "2px 7px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: bgColor, border: "1px solid #e2e8f0", flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace", fontWeight: 700 }}>{bgLabel.toUpperCase()} BG</span>
            </div>
          )}
          {/* Border color swatch */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8fafc", borderRadius: 5, padding: "2px 7px", border: "1px solid #e2e8f0" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: borderColor, border: borderColor === "#ffffff" ? "1px solid #e2e8f0" : "none", flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace", fontWeight: 700 }}>BORDER</span>
          </div>
          {badge && <span style={{ background: "#fef9c3", color: "#854d0e", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>{badge === "bestseller" ? "🏆 BADGE" : badge === "sale" ? "🔥 SALE" : "✅ QUALITY"}</span>}
          {isGroupB && "dims" in variation && <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>{(variation as DimensionVariation).dims.label}px</span>}
          <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>{kb !== null ? `${kb} KB` : variation.fileSizeNote}</span>
          {saving !== null && saving > 0 && <span style={{ background: "#fef2f2", color: "#dc2626", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>↓{saving}%</span>}
        </div>

        <div style={{ height: 3, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: `${variation.score}%`, background: `linear-gradient(90deg, ${variation.accent}, ${variation.accent}bb)`, borderRadius: 4, transition: "width 1.2s ease" }} />
        </div>

        <button onClick={() => dataUrl && onDownload(dataUrl, variation.name)} disabled={!dataUrl || isLoading}
          style={{ width: "100%", padding: "9px", borderRadius: 10, border: "none", background: dataUrl ? dlBg : "#f1f5f9", color: dataUrl ? "#fff" : "#94a3b8", fontSize: 12.5, fontWeight: 700, cursor: dataUrl ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
          {isLoading ? (isBgGroup ? "Replacing BG..." : "Processing...") : dataUrl ? "⬇ Download" : "Waiting..."}
        </button>
      </div>
    </div>
  );
}

function Sidebar({ activePage, setActivePage, historyCount }: { activePage: string; setActivePage: (p: string) => void; historyCount: number }) {
  const nav = [
    { id: "optimizer", icon: "⚡", label: "Image Optimizer" },
    { id: "history",   icon: "🕐", label: "History", badge: historyCount },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "settings",  icon: "⚙️", label: "Settings" },
  ];
  const bgSwatches = [
    { color: "#ede9fe", label: "Lavender" }, { color: "#e0f2fe", label: "Sky Blue" },
    { color: "#dcfce7", label: "Mint" },     { color: "#fee2e2", label: "Peach" },
    { color: "#fef9c3", label: "Sunshine" }, { color: "#fce7f3", label: "Rose Pink" },
    { color: "#ffe4d6", label: "Coral" },    { color: "#f3e8ff", label: "Lilac" },
    { color: "#cffafe", label: "Aqua" },     { color: "#fef3c7", label: "Champagne" },
  ];
  return (
    <aside style={{ width: 224, minWidth: 224, background: "#0f172a", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b", height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>⚡</div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>ShipOptimize</div>
            <div style={{ color: "#64748b", fontSize: 10, fontFamily: "monospace" }}>v5.0 PRO · 20 variations</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ marginBottom: 5, padding: "0 8px", color: "#334155", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Tools</div>
        {nav.map((item) => (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: activePage === item.id ? "rgba(99,102,241,0.15)" : "transparent", color: activePage === item.id ? "#a5b4fc" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: activePage === item.id ? 700 : 400, marginBottom: 2, transition: "all 0.15s", textAlign: "left", fontFamily: "'DM Sans', sans-serif", borderLeft: activePage === item.id ? "2px solid #6366f1" : "2px solid transparent" }}>
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {"badge" in item && item.badge! > 0 && <span style={{ background: "#6366f1", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px", fontFamily: "monospace" }}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Groups legend */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid #1e293b" }}>
        <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 7 }}>VARIATION GROUPS</div>
        {[
          { dot: "#6366f1", label: "🖼️ Border + Badge (5)" },
          { dot: "#0284c7", label: "📐 Resize + Border (5)" },
          { dot: "#7c3aed", label: "🎨 BG Colours C (5)" },
          { dot: "#be185d", label: "🎨 BG Colours D (5)" },
        ].map((g) => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: g.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{g.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 9, color: "#475569", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 5 }}>BG COLOURS (Group C)</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {bgSwatches.map((s) => (
            <div key={s.label} title={s.label} style={{ width: 18, height: 18, borderRadius: 4, background: s.color, border: "1px solid #334155", cursor: "default" }} />
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderTop: "1px solid #1e293b" }}>
        <div style={{ background: "#1e293b", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>M</div>
          <div><div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Meesho Seller</div><div style={{ color: "#475569", fontSize: 10, fontFamily: "monospace" }}>Pro Plan</div></div>
        </div>
      </div>
    </aside>
  );
}

function HistoryPage({ history }: { history: HistoryItem[] }) {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>History</h2>
      <p style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Previously processed images</p>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#f8fafc", borderRadius: 16, border: "1.5px dashed #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>No history yet — optimize your first image!</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {history.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
              <img src={item.original} alt="" style={{ width: "100%", height: 130, objectFit: "cover" }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{item.category || "No Category"}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginTop: 2 }}>{new Date(item.time).toLocaleDateString()} · {item.count} variations</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const metrics = [
    { label: "Images Optimized", value: "247", change: "+18%", icon: "🖼️" },
    { label: "Avg Compression",  value: "68%", change: "+8%",  icon: "📦" },
    { label: "Slab Reductions",  value: "83%", change: "+12%", icon: "✅" },
    { label: "Est. Savings",     value: "₹2,840", change: "+₹320", icon: "💰" },
  ];
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Analytics</h2>
      <p style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Your optimization performance</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 28 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "20px 22px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, fontFamily: "monospace" }}>{m.change} this month</div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 16, padding: "22px 26px", color: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 17, fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>🚀 Upgrade to Enterprise</div>
        <div style={{ fontSize: 13, opacity: 0.85, fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>Bulk processing, API access, and advanced analytics.</div>
        <button style={{ background: "#fff", color: "#6366f1", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View Plans →</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function ShipOptimize() {
  const [activePage, setActivePage] = useState("optimizer");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalKB, setOriginalKB] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [processing, setProcessing] = useState(false);
  const [variations, setVariations] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const handleFile = (file: File) => {
    setVariations({}); setLoadingIds([]);
    setOriginalKB(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = (e) => { setPreviewUrl(e.target?.result as string); setStep(2); };
    reader.readAsDataURL(file);
  };

  const handleOptimize = async () => {
    if (!previewUrl) return;
    setProcessing(true); setStep(3); setActiveTab("all");
    setLoadingIds(ALL_VARIATIONS.map((v) => v.id));
    setVariations({});
    for (const cfg of ALL_VARIATIONS) {
      await new Promise((r) => setTimeout(r, 30));
      try {
        const url = await processVariation(previewUrl, cfg);
        setVariations((prev) => ({ ...prev, [cfg.id]: url }));
      } catch (e) {
        console.error(cfg.id, e);
        setVariations((prev) => ({ ...prev, [cfg.id]: previewUrl! }));
      }
      setLoadingIds((prev) => prev.filter((id) => id !== cfg.id));
    }
    setHistory((prev) => [{ original: previewUrl!, category, time: Date.now(), count: ALL_VARIATIONS.length }, ...prev]);
    setProcessing(false);
  };

  const handleDownload = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl; a.download = `shipoptimize-${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleDownloadAll = () => { ALL_VARIATIONS.forEach((cfg, i) => { const url = variations[cfg.id]; if (url) setTimeout(() => handleDownload(url, cfg.name), i * 180); }); };
  const reset = () => { setStep(1); setPreviewUrl(null); setCategory(""); setVariations({}); setLoadingIds([]); setOriginalKB(null); };
  const allDone = Object.keys(variations).length === ALL_VARIATIONS.length && !processing;

  const displayedVariations =
    activeTab === "border"    ? BORDER_VARIATIONS :
    activeTab === "resize"    ? DIMENSION_VARIATIONS :
    activeTab === "bgchange"  ? BGCHANGE_VARIATIONS :
    activeTab === "bgchange2" ? BGCHANGE_VARIATIONS2 :
    ALL_VARIATIONS;

  const bestKB = allDone ? Math.min(...DIMENSION_VARIATIONS.map((v) => variations[v.id] ? estimateKB(variations[v.id]) : 99999)) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} historyCount={history.length} />
        <main style={{ flex: 1, overflowY: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>
                {activePage === "optimizer" ? "Image Optimizer" : activePage === "history" ? "History" : activePage === "analytics" ? "Analytics" : "Settings"}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>20 variations · Border · Resize · Background Colour Change (10 colours)</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {step === 3 && activePage === "optimizer" && (
                <>
                  <button onClick={handleDownloadAll} disabled={!allDone} style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: allDone ? "pointer" : "not-allowed", opacity: allDone ? 1 : 0.5, fontFamily: "'DM Sans', sans-serif" }}>⬇ Download All (20)</button>
                  <button onClick={reset} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ New Image</button>
                </>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#16a34a", fontWeight: 600, fontFamily: "monospace" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> AI Active
              </div>
            </div>
          </div>

          {activePage === "history"   && <HistoryPage history={history} />}
          {activePage === "analytics" && <AnalyticsPage />}
          {activePage === "settings"  && <div style={{ padding: "40px", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Settings coming soon.</div>}

          {activePage === "optimizer" && (
            <div style={{ padding: "22px 28px", animation: "fadeIn 0.3s ease" }}>

              {/* Steps */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
                {[{ n: 1, label: "Upload" }, { n: 2, label: "Configure" }, { n: 3, label: "Results" }].map((s, i, arr) => (
                  <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: step >= s.n ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e2e8f0", color: step >= s.n ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{step > s.n ? "✓" : s.n}</div>
                      <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 400, color: step >= s.n ? "#0f172a" : "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 36, height: 2, background: step > s.n ? "#6366f1" : "#e2e8f0", margin: "0 10px" }} />}
                  </div>
                ))}
              </div>

              {/* Upload + Config */}
              {step <= 2 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
                  <div>
                    <div style={{ marginBottom: 10, fontWeight: 700, fontSize: 14, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>Product Image <span style={{ color: "#ef4444" }}>*</span></div>
                    <UploadZone onFile={handleFile} preview={previewUrl} originalKB={originalKB} />
                    {previewUrl && (
                      <div style={{ marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#16a34a", fontFamily: "'DM Sans', sans-serif" }}>
                        ✓ Ready — {originalKB} KB · 15 variations will be generated
                      </div>
                    )}
                  </div>

                  <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>Settings</div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "'DM Sans', sans-serif", marginBottom: 7 }}>Product Category</label>
                      <CategoryDropdown value={category} onChange={setCategory} />
                    </div>

                    {/* Group A */}
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "11px", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", fontFamily: "monospace", marginBottom: 7, letterSpacing: "0.06em" }}>🖼️ GROUP A — BORDER + BADGE (5)</div>
                      {BORDER_VARIATIONS.map((v) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.borderColor, border: v.borderColor === "#ffffff" ? "1px solid #cbd5e1" : "none", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{v.name}</span>
                          {v.badge && <span style={{ marginLeft: "auto", fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>{v.badge}</span>}
                        </div>
                      ))}
                    </div>

                    {/* Group B */}
                    <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "11px", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#0284c7", fontFamily: "monospace", marginBottom: 7, letterSpacing: "0.06em" }}>📐 GROUP B — RESIZE + BORDER (5)</div>
                      {DIMENSION_VARIATIONS.map((v) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.borderColor, border: v.borderColor === "#ffffff" ? "1px solid #cbd5e1" : "none", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{v.name}</span>
                          <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 4, padding: "1px 5px", fontSize: 9, fontFamily: "monospace" }}>{v.dims.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Group C — BG Set 1 */}
                    <div style={{ background: "#faf5ff", borderRadius: 10, padding: "11px", marginBottom: 8, border: "1.5px solid #e9d5ff" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", fontFamily: "monospace", marginBottom: 7, letterSpacing: "0.06em" }}>🎨 GROUP C — BG COLOUR SET 1 (5)</div>
                      {BGCHANGE_VARIATIONS.map((v) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.bgColor, border: "1px solid #e2e8f0", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{v.name}</span>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.borderColor, flexShrink: 0 }} />
                        </div>
                      ))}
                    </div>

                    {/* Group D — BG Set 2 */}
                    <div style={{ background: "#fff0f9", borderRadius: 10, padding: "11px", marginBottom: 14, border: "1.5px solid #fbcfe8" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#be185d", fontFamily: "monospace", marginBottom: 7, letterSpacing: "0.06em" }}>🎨 GROUP D — BG COLOUR SET 2 (5) ✨ NEW</div>
                      {BGCHANGE_VARIATIONS2.map((v) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.bgColor, border: "1px solid #e2e8f0", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{v.name}</span>
                          <div style={{ width: 11, height: 11, borderRadius: 3, background: v.borderColor, flexShrink: 0 }} />
                        </div>
                      ))}
                      <div style={{ marginTop: 6, fontSize: 10, color: "#be185d", fontFamily: "'DM Sans', sans-serif" }}>Rose, Coral, Lilac, Aqua, Champagne tones</div>
                    </div>

                    <button onClick={handleOptimize} disabled={!previewUrl}
                      style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: previewUrl ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e2e8f0", color: previewUrl ? "#fff" : "#94a3b8", fontSize: 15, fontWeight: 700, cursor: previewUrl ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", boxShadow: previewUrl ? "0 8px 24px rgba(99,102,241,0.35)" : "none" }}>
                      ⚡ Generate 20 Variations
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {step === 3 && (
                <div style={{ animation: "fadeIn 0.4s ease" }}>

                  {/* Stats bar */}
                  <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace", marginBottom: 4 }}>ORIGINAL</div>
                      {previewUrl && <img src={previewUrl} alt="Original" style={{ height: 85, objectFit: "contain", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />}
                      <div style={{ marginTop: 4, fontSize: 10, color: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>{originalKB} KB</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ height: 2, flex: 1, background: "linear-gradient(90deg, #e2e8f0, #6366f1)" }} />
                      <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", borderRadius: 10, padding: "5px 11px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>⚡ 15 Variations</div>
                      <div style={{ height: 2, flex: 1, background: "linear-gradient(90deg, #22c55e, #e2e8f0)" }} />
                    </div>
                    {[
                      { label: "Original",  value: `${originalKB} KB`,                                                                              color: "#ef4444" },
                      { label: "Best Size", value: bestKB ? `${bestKB} KB` : "...",                                                                 color: "#22c55e" },
                      { label: "Reduction", value: bestKB && originalKB ? `${Math.round(((originalKB - bestKB) / originalKB) * 100)}%` : "...",    color: "#0284c7" },
                      { label: "Category",  value: category || "—",                                                                                 color: "#6366f1" },
                    ].map((m) => (
                      <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace", marginBottom: 3, letterSpacing: "0.06em" }}>{m.label.toUpperCase()}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: m.color, fontFamily: "monospace" }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Info box */}
                  <div style={{ background: "linear-gradient(135deg, #faf5ff, #eff6ff, #f0fdf4)", border: "1.5px solid #e9d5ff", borderRadius: 12, padding: "13px 16px", marginBottom: 18, display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>💡</span>
                    <div style={{ fontSize: 12, color: "#374151", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                      <strong style={{ color: "#6366f1" }}>Group A</strong> — Colored borders + badges on original size.<br />
                      <strong style={{ color: "#0284c7" }}>Group B</strong> — Resized to Meesho standard dimensions + border. <strong>500×500 Green</strong> = smallest file.<br />
                      <strong style={{ color: "#7c3aed" }}>Group C</strong> — BG replaced with Lavender, Sky Blue, Mint, Peach, Sunshine + border.<br />
                      <strong style={{ color: "#be185d" }}>Group D (NEW)</strong> — BG replaced with Rose, Coral, Lilac, Aqua, Champagne + border. Works best on plain/white background photos.
                    </div>
                  </div>

                  {/* Tab filter */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {[
                      { key: "all",       label: "All 20" },
                      { key: "border",    label: "🖼️ Border (5)" },
                      { key: "resize",    label: "📐 Resize (5)" },
                      { key: "bgchange",  label: "🎨 BG Set 1 (5)" },
                      { key: "bgchange2", label: "🎨 BG Set 2 (5)" },
                    ].map((tab) => (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ padding: "7px 15px", borderRadius: 20, border: "1.5px solid", borderColor: activeTab === tab.key ? "#6366f1" : "#e2e8f0", background: activeTab === tab.key ? "#6366f1" : "#fff", color: activeTab === tab.key ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{tab.label}</button>
                    ))}
                  </div>

                  {/* Cards grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))", gap: 14, marginBottom: 18 }}>
                    {displayedVariations.map((v) => (
                      <VariationCard key={v.id} variation={v} dataUrl={variations[v.id] ?? null} isLoading={loadingIds.includes(v.id)} onDownload={handleDownload} originalKB={originalKB} />
                    ))}
                  </div>

                  {/* Tip */}
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "13px 16px", display: "flex", gap: 10, fontSize: 13, color: "#92400e", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>📦</span>
                    <span>
                      <strong>Meesho Tip:</strong> For shipping slab reduction, upload the <strong>500×500 Green Border</strong> (smallest file ~30–50 KB). For listing attractiveness, try the <strong>BG Colour variations</strong> — pastel backgrounds increase click-through rates. Always verify slab changes in your Meesho seller dashboard after upload.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
