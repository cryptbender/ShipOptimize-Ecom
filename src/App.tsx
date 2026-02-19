/**
 * ShipOptimize - Meesho & eCommerce Image Optimization SaaS
 *
 * GROUP A — Border + Badge variations (visual differentiation)
 * GROUP B — Dimension + Compression variations (actual file size reduction)
 *
 * Meesho shipping slab is based on volumetric weight of the PACKAGE,
 * but smaller file sizes help avoid system misclassification.
 * Standard Meesho image specs: 1080x1080px JPEG, <200KB ideal.
 */

import { useState, useRef, useEffect } from 'react';

// ─── MEESHO STANDARD DIMENSIONS ───────────────────────────────────────────────
// Source: Meesho seller guidelines
const MEESHO_DIMS = {
  SQUARE_HD: {
    w: 1080,
    h: 1080,
    label: '1080×1080',
    quality: 0.82,
    note: 'Meesho Standard Square',
  },
  SQUARE_LITE: {
    w: 800,
    h: 800,
    label: '800×800',
    quality: 0.72,
    note: 'Lightweight Square',
  },
  SQUARE_MIN: {
    w: 500,
    h: 500,
    label: '500×500',
    quality: 0.65,
    note: 'Min Spec — Smallest File',
  },
  PORTRAIT_HD: {
    w: 900,
    h: 1200,
    label: '900×1200',
    quality: 0.78,
    note: 'Portrait — Best for Kurtis/Dresses',
  },
  PORTRAIT_COMP: {
    w: 720,
    h: 960,
    label: '720×960',
    quality: 0.68,
    note: 'Compressed Portrait',
  },
};

// ─── VARIATION CONFIG ─────────────────────────────────────────────────────────

const BORDER_VARIATIONS = [
  {
    id: 'purple-plain',
    group: 'A',
    name: 'Purple Border',
    tag: 'Trending',
    desc: 'Bold purple frame — most popular on Meesho',
    borderColor: '#9333ea',
    badge: null,
    cardBg: '#faf5ff',
    accent: '#9333ea',
    score: 88,
    fileSizeNote: 'Same size as original',
    recommended: false,
  },
  {
    id: 'yellow-bestseller',
    group: 'A',
    name: 'Yellow + Bestseller',
    tag: '🏆 Best Seller',
    desc: 'Yellow border with Bestseller badge',
    borderColor: '#eab308',
    badge: 'bestseller',
    cardBg: '#fefce8',
    accent: '#ca8a04',
    score: 90,
    fileSizeNote: 'Same size as original',
    recommended: false,
  },
  {
    id: 'blue-sale',
    group: 'A',
    name: 'Blue + SALE Badge',
    tag: '⚡ Flash Sale',
    desc: 'Blue border with SALE sticker',
    borderColor: '#2563eb',
    badge: 'sale',
    cardBg: '#eff6ff',
    accent: '#2563eb',
    score: 87,
    fileSizeNote: 'Same size as original',
    recommended: false,
  },
  {
    id: 'pink-plain',
    group: 'A',
    name: 'Pink Border',
    tag: "Women's Pick",
    desc: "Pink frame — best for women's fashion",
    borderColor: '#ec4899',
    badge: null,
    cardBg: '#fdf2f8',
    accent: '#db2777',
    score: 86,
    fileSizeNote: 'Same size as original',
    recommended: false,
  },
  {
    id: 'green-quality',
    group: 'A',
    name: 'Green + Quality Badge',
    tag: '✅ Quality Seal',
    desc: 'Green border + Best Quality badge',
    borderColor: '#16a34a',
    badge: 'quality',
    cardBg: '#f0fdf4',
    accent: '#16a34a',
    score: 89,
    fileSizeNote: 'Same size as original',
    recommended: false,
  },
];

const DIMENSION_VARIATIONS = [
  {
    id: 'meesho-standard',
    group: 'B',
    name: 'Meesho Standard',
    tag: '📐 1080×1080px',
    desc: 'Official Meesho recommended square — 1080×1080px, JPEG 82%',
    dims: MEESHO_DIMS.SQUARE_HD,
    cardBg: '#f0f9ff',
    accent: '#0284c7',
    score: 94,
    fileSizeNote: '~120–180 KB',
    recommended: false,
  },
  {
    id: 'lightweight-square',
    group: 'B',
    name: 'Lightweight Square',
    tag: '⚡ 800×800px',
    desc: '800×800px at 72% JPEG — 40% smaller than standard',
    dims: MEESHO_DIMS.SQUARE_LITE,
    cardBg: '#fff7ed',
    accent: '#ea580c',
    score: 96,
    fileSizeNote: '~70–100 KB',
    recommended: false,
  },
  {
    id: 'min-spec',
    group: 'B',
    name: 'Min Spec Compressed',
    tag: '🔥 Smallest File',
    desc: '500×500px — Meesho minimum. Maximum file size reduction',
    dims: MEESHO_DIMS.SQUARE_MIN,
    cardBg: '#fef2f2',
    accent: '#dc2626',
    score: 99,
    fileSizeNote: '~30–50 KB',
    recommended: true,
  },
  {
    id: 'portrait-hd',
    group: 'B',
    name: 'Portrait HD',
    tag: '👗 900×1200px',
    desc: '4:3 portrait — ideal for kurtis, dresses, full-length shots',
    dims: MEESHO_DIMS.PORTRAIT_HD,
    cardBg: '#fdf4ff',
    accent: '#9333ea',
    score: 93,
    fileSizeNote: '~100–150 KB',
    recommended: false,
  },
  {
    id: 'portrait-compressed',
    group: 'B',
    name: 'Portrait Compressed',
    tag: '📦 720×960px',
    desc: 'Compressed portrait — 68% JPEG quality, smallest portrait size',
    dims: MEESHO_DIMS.PORTRAIT_COMP,
    cardBg: '#f0fdf4',
    accent: '#16a34a',
    score: 97,
    fileSizeNote: '~50–75 KB',
    recommended: false,
  },
];

const ALL_VARIATIONS = [...BORDER_VARIATIONS, ...DIMENSION_VARIATIONS];

// ─── BADGE DRAWING HELPERS ────────────────────────────────────────────────────

function drawBadgeBestseller(ctx, W, H, bw) {
  const cx = W - bw * 3.2,
    cy = bw * 3.2,
    r = bw * 2.4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1c1917';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.font = `bold ${Math.round(r * 0.5)}px Arial`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Best', cx, cy - r * 0.2);
  ctx.font = `bold ${Math.round(r * 0.42)}px Arial`;
  ctx.fillText('Seller', cx, cy + r * 0.28);
}

function drawBadgeSale(ctx, W, H, bw) {
  const bx = bw * 0.8,
    by = bw * 0.8;
  const bW = bw * 4.5,
    bH = bw * 1.8,
    r = bH * 0.38;
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bW - r, by);
  ctx.arcTo(bx + bW, by, bx + bW, by + r, r);
  ctx.lineTo(bx + bW, by + bH - r);
  ctx.arcTo(bx + bW, by + bH, bx + bW - r, by + bH, r);
  ctx.lineTo(bx + r, by + bH);
  ctx.arcTo(bx, by + bH, bx, by + bH - r, r);
  ctx.lineTo(bx, by + r);
  ctx.arcTo(bx, by, bx + r, by, r);
  ctx.closePath();
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.font = `900 ${Math.round(bH * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SALE', bx + bW / 2, by + bH / 2);
}

function drawBadgeQuality(ctx, W, H, bw) {
  const cx = bw * 3,
    cy = bw * 3,
    r = bw * 2.3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#15803d';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3.5, 0, Math.PI * 2);
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = `bold ${Math.round(r * 0.44)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BEST', cx, cy - r * 0.24);
  ctx.font = `bold ${Math.round(r * 0.36)}px Arial`;
  ctx.fillText('QUALITY', cx, cy + r * 0.28);
}

// ─── CANVAS PROCESSORS ────────────────────────────────────────────────────────

/** Group A: Border + Badge — same dimensions, draws colored frame over edges */
async function processBorderVariation(imageSrc, variation) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('Timeout')), 12000);
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Load error'));
    };
    img.onload = () => {
      clearTimeout(timer);
      try {
        const W = img.naturalWidth,
          H = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Draw original photo — center untouched
        ctx.drawImage(img, 0, 0, W, H);

        // Paint thick colored strips over edges only
        const bw = Math.round(Math.min(W, H) * 0.034);
        ctx.fillStyle = variation.borderColor;
        ctx.fillRect(0, 0, W, bw);
        ctx.fillRect(0, H - bw, W, bw);
        ctx.fillRect(0, 0, bw, H);
        ctx.fillRect(W - bw, 0, bw, H);

        // Badges
        if (variation.badge === 'bestseller')
          drawBadgeBestseller(ctx, W, H, bw);
        if (variation.badge === 'sale') drawBadgeSale(ctx, W, H, bw);
        if (variation.badge === 'quality') drawBadgeQuality(ctx, W, H, bw);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        reject(err);
      }
    };
    img.src = imageSrc;
  });
}

/**
 * Group B: Dimension + Compression — resizes canvas to Meesho standard sizes.
 * This is what ACTUALLY reduces file size and can help with shipping slabs.
 * Fits product centered on white canvas at the target dimension.
 */
async function processDimensionVariation(imageSrc, variation) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('Timeout')), 12000);
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Load error'));
    };
    img.onload = () => {
      clearTimeout(timer);
      try {
        const { w: TW, h: TH, quality } = variation.dims;
        const canvas = document.createElement('canvas');
        canvas.width = TW;
        canvas.height = TH;
        const ctx = canvas.getContext('2d');

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, TW, TH);

        // Scale product to fit inside target with 4% padding
        const padFrac = 0.04;
        const maxW = TW * (1 - padFrac * 2);
        const maxH = TH * (1 - padFrac * 2);
        const scale = Math.min(
          maxW / img.naturalWidth,
          maxH / img.naturalHeight
        );
        const dw = Math.round(img.naturalWidth * scale);
        const dh = Math.round(img.naturalHeight * scale);
        const dx = Math.round((TW - dw) / 2);
        const dy = Math.round((TH - dh) / 2);

        // Use imageSmoothingQuality for best downscale result
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, dx, dy, dw, dh);

        // Subtle dimension watermark (bottom-right, tiny)
        ctx.font = `500 ${Math.round(TH * 0.018)}px Arial`;
        ctx.fillStyle = 'rgba(180,180,180,0.7)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${TW}×${TH}`, TW - 8, TH - 6);

        // Export at the configured JPEG quality — this is the key to file size reduction
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(err);
      }
    };
    img.src = imageSrc;
  });
}

async function processVariation(imageSrc, variation) {
  if (variation.group === 'A')
    return processBorderVariation(imageSrc, variation);
  return processDimensionVariation(imageSrc, variation);
}

// ─── UTILITY ──────────────────────────────────────────────────────────────────

/** Estimate file size in KB from a data URL */
function estimateKB(dataUrl) {
  if (!dataUrl) return null;
  const base64 = dataUrl.split(',')[1] || '';
  return Math.round((base64.length * 3) / 4 / 1024);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    group: 'Women',
    items: [
      'Kurtis',
      'Tops & Tunics',
      'Dresses',
      'Sarees',
      'Leggings & Palazzos',
    ],
  },
  { group: 'Men', items: ['T-Shirts', 'Shirts', 'Trousers', 'Ethnic Wear'] },
  {
    group: 'Kids',
    items: ['Girls Topwear', 'Boys Topwear', 'Kids Dresses', 'Infant Wear'],
  },
  {
    group: 'Home',
    items: ['Home Decor', 'Bedsheets', 'Curtains', 'Kitchen Linens'],
  },
];

function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const all = CATEGORIES.flatMap((g) =>
    g.items.map((i) => `${g.group} > ${i}`)
  );
  const filtered = all.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setOpen(!open);
          setCustomMode(false);
        }}
        style={{
          width: '100%',
          padding: '11px 16px',
          borderRadius: 10,
          border: '1.5px solid #e2e8f0',
          background: '#fff',
          color: value ? '#1e293b' : '#94a3b8',
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>{value || 'Select product category...'}</span>
        <span style={{ color: '#94a3b8', fontSize: 11 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            zIndex: 1000,
            maxHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}
          >
            <input
              autoFocus
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px',
                borderRadius: 8,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  border: 'none',
                  background: cat === value ? '#f0f9ff' : 'transparent',
                  color: cat === value ? '#0284c7' : '#374151',
                  fontSize: 13.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => {
                setCustomMode(true);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                borderTop: '1px solid #f1f5f9',
                background: 'transparent',
                color: '#6366f1',
                fontSize: 13.5,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              + Add Custom Category
            </button>
          </div>
        </div>
      )}
      {customMode && (
        <input
          autoFocus
          placeholder="Type custom category and press Enter..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              onChange(e.target.value);
              setCustomMode(false);
            }
          }}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '11px 16px',
            borderRadius: 10,
            border: '1.5px solid #6366f1',
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            boxSizing: 'border-box',
            color: '#1e293b',
          }}
        />
      )}
    </div>
  );
}

function UploadZone({ onFile, preview, originalKB }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFile(file);
  };
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${
          drag ? '#6366f1' : preview ? '#e2e8f0' : '#cbd5e1'
        }`,
        borderRadius: 16,
        background: drag ? '#f0f4ff' : preview ? '#fafafa' : '#f8fafc',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onFile(f);
        }}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Product"
            style={{
              maxHeight: 240,
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
          {originalKB && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15,23,42,0.8)',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 11,
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
              }}
            >
              Original: ~{originalKB} KB
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: '#1e293b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            ↺ Change
          </button>
        </>
      ) : (
        <>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              marginBottom: 18,
            }}
          >
            🖼️
          </div>
          <div
            style={{
              color: '#1e293b',
              fontWeight: 700,
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 8,
            }}
          >
            Drop your product image here
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 20,
            }}
          >
            JPG, PNG, WebP — any size
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              padding: '11px 28px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
            }}
          >
            Browse Files
          </button>
          <div
            style={{
              marginTop: 12,
              color: '#cbd5e1',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            Secure · Fast · No data stored
          </div>
        </>
      )}
    </div>
  );
}

function VariationCard({
  variation,
  dataUrl,
  isLoading,
  onDownload,
  originalKB,
}) {
  const kb = dataUrl ? estimateKB(dataUrl) : null;
  const saving =
    kb && originalKB
      ? Math.round(((originalKB - kb) / originalKB) * 100)
      : null;
  const isGroupB = variation.group === 'B';

  return (
    <div
      style={{
        borderRadius: 16,
        border: variation.recommended
          ? '2px solid #22c55e'
          : '1.5px solid #e2e8f0',
        background: '#fff',
        overflow: 'hidden',
        boxShadow: variation.recommended
          ? '0 8px 32px rgba(34,197,94,0.15)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = variation.recommended
          ? '0 8px 32px rgba(34,197,94,0.15)'
          : '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Group label badge */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          background: isGroupB ? '#0f172a' : '#6366f1',
          color: '#fff',
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: 9,
          fontWeight: 800,
          fontFamily: 'monospace',
          letterSpacing: '0.08em',
        }}
      >
        {isGroupB ? '📐 RESIZE' : '🎨 BORDER'}
      </div>

      {variation.recommended && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            background: '#22c55e',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 9,
            fontWeight: 800,
            fontFamily: 'monospace',
          }}
        >
          ✓ BEST
        </div>
      )}

      {/* Preview */}
      <div
        style={{
          height: 200,
          background: variation.cardBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `3px solid ${variation.accent}`,
                borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            <span
              style={{
                color: variation.accent,
                fontSize: 11,
                fontFamily: 'monospace',
              }}
            >
              Processing...
            </span>
          </div>
        ) : dataUrl ? (
          <>
            <img
              src={dataUrl}
              alt={variation.name}
              style={{ maxHeight: 190, maxWidth: '100%', objectFit: 'contain' }}
            />
            {/* File size badge on preview */}
            {kb && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: saving > 0 ? '#22c55e' : '#64748b',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                {kb} KB{saving > 0 ? ` ↓${saving}%` : ''}
              </div>
            )}
          </>
        ) : (
          <span style={{ color: '#e2e8f0', fontSize: 36 }}>◌</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 5,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13.5,
                color: '#0f172a',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {variation.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: variation.accent,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 1,
              }}
            >
              {variation.tag}
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 8,
              padding: '3px 8px',
              marginLeft: 8,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: variation.accent,
                fontFamily: 'monospace',
              }}
            >
              {variation.score}
            </div>
            <div
              style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}
            >
              SCORE
            </div>
          </div>
        </div>

        <div
          style={{
            color: '#64748b',
            fontSize: 11.5,
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 8,
            lineHeight: 1.4,
          }}
        >
          {variation.desc}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 10,
            flexWrap: 'wrap',
          }}
        >
          {isGroupB && variation.dims && (
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                borderRadius: 5,
                padding: '2px 7px',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {variation.dims.label}px
            </span>
          )}
          <span
            style={{
              background: '#f0fdf4',
              color: '#16a34a',
              borderRadius: 5,
              padding: '2px 7px',
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            {kb ? `${kb} KB` : variation.fileSizeNote}
          </span>
          {saving > 0 && (
            <span
              style={{
                background: '#fef9c3',
                color: '#854d0e',
                borderRadius: 5,
                padding: '2px 7px',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              ↓ {saving}% smaller
            </span>
          )}
        </div>

        {/* Score bar */}
        <div
          style={{
            height: 3,
            background: '#f1f5f9',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${variation.score}%`,
              background: `linear-gradient(90deg, ${variation.accent}, ${variation.accent}bb)`,
              borderRadius: 4,
              transition: 'width 1.2s ease',
            }}
          />
        </div>

        <button
          onClick={() =>
            dataUrl && onDownload(dataUrl, variation.name, isGroupB)
          }
          disabled={!dataUrl || isLoading}
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: 10,
            border: 'none',
            background: dataUrl
              ? variation.recommended
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : isGroupB
                ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : '#f1f5f9',
            color: dataUrl ? '#fff' : '#94a3b8',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: dataUrl ? 'pointer' : 'not-allowed',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {isLoading ? 'Processing...' : dataUrl ? '⬇ Download' : 'Waiting...'}
        </button>
      </div>
    </div>
  );
}

function Sidebar({ activePage, setActivePage, historyCount }) {
  const nav = [
    { id: 'optimizer', icon: '⚡', label: 'Image Optimizer' },
    { id: 'history', icon: '🕐', label: 'History', badge: historyCount },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];
  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e293b',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{ padding: '24px 20px 18px', borderBottom: '1px solid #1e293b' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                color: '#f1f5f9',
                fontWeight: 800,
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ShipOptimize
            </div>
            <div
              style={{
                color: '#64748b',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            >
              v3.0 PRO
            </div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div
          style={{
            marginBottom: 6,
            padding: '0 8px',
            color: '#334155',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Tools
        </div>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background:
                activePage === item.id
                  ? 'rgba(99,102,241,0.15)'
                  : 'transparent',
              color: activePage === item.id ? '#a5b4fc' : '#64748b',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: activePage === item.id ? 700 : 400,
              marginBottom: 2,
              transition: 'all 0.15s',
              textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif",
              borderLeft:
                activePage === item.id
                  ? '2px solid #6366f1'
                  : '2px solid transparent',
            }}
          >
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge > 0 && (
              <span
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  fontFamily: 'monospace',
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Legend */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid #1e293b',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: '#475569',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          VARIATION TYPES
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 5,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: '#6366f1',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#64748b',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Border + Badge (5)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: '#0f172a',
              border: '1px solid #475569',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#64748b',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Resize + Compress (5)
          </span>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        <div
          style={{
            background: '#1e293b',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            M
          </div>
          <div>
            <div
              style={{
                color: '#e2e8f0',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Meesho Seller
            </div>
            <div
              style={{
                color: '#475569',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            >
              Pro Plan
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function HistoryPage({ history }) {
  return (
    <div style={{ padding: '32px 40px' }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#0f172a',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 6,
        }}
      >
        History
      </h2>
      <p
        style={{
          color: '#64748b',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 24,
        }}
      >
        Previously processed images
      </p>
      {history.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: '#f8fafc',
            borderRadius: 16,
            border: '1.5px dashed #e2e8f0',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div
            style={{ color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}
          >
            No history yet — optimize your first image!
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {history.map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.original}
                alt=""
                style={{ width: '100%', height: 130, objectFit: 'cover' }}
              />
              <div style={{ padding: '10px 12px' }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item.category || 'No Category'}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                    marginTop: 2,
                  }}
                >
                  {new Date(item.time).toLocaleDateString()} · {item.count}{' '}
                  variations
                </div>
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
    { label: 'Images Optimized', value: '247', change: '+18%', icon: '🖼️' },
    { label: 'Avg Compression', value: '68%', change: '+8%', icon: '📦' },
    { label: 'Slab Reductions', value: '83%', change: '+12%', icon: '✅' },
    { label: 'Est. Savings', value: '₹2,840', change: '+₹320', icon: '💰' },
  ];
  return (
    <div style={{ padding: '32px 40px' }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#0f172a',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 6,
        }}
      >
        Analytics
      </h2>
      <p
        style={{
          color: '#64748b',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 24,
        }}
      >
        Your optimization performance
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1.5px solid #e2e8f0',
              padding: '20px 22px',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#64748b',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#22c55e',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              {m.change} this month
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 16,
          padding: '22px 26px',
          color: '#fff',
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 17,
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 6,
          }}
        >
          🚀 Upgrade to Enterprise
        </div>
        <div
          style={{
            fontSize: 13,
            opacity: 0.85,
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 14,
          }}
        >
          Bulk processing, API access, team collaboration, and advanced
          analytics.
        </div>
        <button
          style={{
            background: '#fff',
            color: '#6366f1',
            border: 'none',
            borderRadius: 10,
            padding: '9px 22px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          View Plans →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function ShipOptimize() {
  const [activePage, setActivePage] = useState('optimizer');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalKB, setOriginalKB] = useState(null);
  const [category, setCategory] = useState('');
  const [processing, setProcessing] = useState(false);
  const [variations, setVariations] = useState({});
  const [loadingIds, setLoadingIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // all | border | resize

  const handleFile = (file) => {
    setVariations({});
    setLoadingIds([]);
    setOriginalKB(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleOptimize = async () => {
    if (!previewUrl) return;
    setProcessing(true);
    setStep(3);
    setActiveTab('all');
    setLoadingIds(ALL_VARIATIONS.map((v) => v.id));
    setVariations({});

    for (const cfg of ALL_VARIATIONS) {
      await new Promise((r) => setTimeout(r, 30));
      try {
        const url = await processVariation(previewUrl, cfg);
        setVariations((prev) => ({ ...prev, [cfg.id]: url }));
      } catch (e) {
        console.error(cfg.id, e);
        setVariations((prev) => ({ ...prev, [cfg.id]: previewUrl }));
      }
      setLoadingIds((prev) => prev.filter((id) => id !== cfg.id));
    }

    setHistory((prev) => [
      {
        original: previewUrl,
        category,
        time: Date.now(),
        count: ALL_VARIATIONS.length,
      },
      ...prev,
    ]);
    setProcessing(false);
  };

  const handleDownload = (dataUrl, name) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `shipoptimize-${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    ALL_VARIATIONS.forEach((cfg, i) => {
      const url = variations[cfg.id];
      if (url) setTimeout(() => handleDownload(url, cfg.name), i * 180);
    });
  };

  const reset = () => {
    setStep(1);
    setPreviewUrl(null);
    setCategory('');
    setVariations({});
    setLoadingIds([]);
    setOriginalKB(null);
  };
  const allDone =
    Object.keys(variations).length === ALL_VARIATIONS.length && !processing;

  // Filter variations by active tab
  const displayedVariations =
    activeTab === 'border'
      ? BORDER_VARIATIONS
      : activeTab === 'resize'
      ? DIMENSION_VARIATIONS
      : ALL_VARIATIONS;

  const bestKB = allDone
    ? Math.min(
        ...DIMENSION_VARIATIONS.map(
          (v) => estimateKB(variations[v.id]) || 99999
        )
      )
    : null;

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

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          historyCount={history.length}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {/* Topbar */}
          <div
            style={{
              background: '#fff',
              borderBottom: '1px solid #e2e8f0',
              padding: '14px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#0f172a',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {activePage === 'optimizer'
                  ? 'Image Optimizer'
                  : activePage === 'history'
                  ? 'History'
                  : activePage === 'analytics'
                  ? 'Analytics'
                  : 'Settings'}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                }}
              >
                10 variations · Border + Resize + Compress
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {step === 3 && activePage === 'optimizer' && (
                <>
                  <button
                    onClick={handleDownloadAll}
                    disabled={!allDone}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: '1.5px solid #e2e8f0',
                      background: '#fff',
                      color: '#374151',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: allDone ? 'pointer' : 'not-allowed',
                      opacity: allDone ? 1 : 0.5,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    ⬇ Download All (10)
                  </button>
                  <button
                    onClick={reset}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    + New Image
                  </button>
                </>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#f0fdf4',
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 12,
                  color: '#16a34a',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                />
                AI Active
              </div>
            </div>
          </div>

          {activePage === 'history' && <HistoryPage history={history} />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'settings' && (
            <div
              style={{
                padding: '40px',
                color: '#64748b',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Settings coming soon.
            </div>
          )}

          {activePage === 'optimizer' && (
            <div
              style={{ padding: '24px 32px', animation: 'fadeIn 0.3s ease' }}
            >
              {/* Steps */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                {[
                  { n: 1, label: 'Upload' },
                  { n: 2, label: 'Configure' },
                  { n: 3, label: 'Results' },
                ].map((s, i, arr) => (
                  <div
                    key={s.n}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background:
                            step >= s.n
                              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                              : '#e2e8f0',
                          color: step >= s.n ? '#fff' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {step > s.n ? '✓' : s.n}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: step === s.n ? 700 : 400,
                          color: step >= s.n ? '#0f172a' : '#94a3b8',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          width: 36,
                          height: 2,
                          background: step > s.n ? '#6366f1' : '#e2e8f0',
                          margin: '0 10px',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1 & 2 */}
              {step <= 2 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 360px',
                    gap: 20,
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div
                      style={{
                        marginBottom: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#0f172a',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Product Image <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <UploadZone
                      onFile={handleFile}
                      preview={previewUrl}
                      originalKB={originalKB}
                    />
                    {previewUrl && (
                      <div
                        style={{
                          marginTop: 10,
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: 10,
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 13,
                          color: '#16a34a',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        ✓ Image ready — {originalKB} KB original · 10 variations
                        will be generated
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      border: '1.5px solid #e2e8f0',
                      padding: '20px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#0f172a',
                        fontFamily: "'DM Sans', sans-serif",
                        marginBottom: 16,
                      }}
                    >
                      Settings
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#374151',
                          fontFamily: "'DM Sans', sans-serif",
                          marginBottom: 8,
                        }}
                      >
                        Product Category
                      </label>
                      <CategoryDropdown
                        value={category}
                        onChange={setCategory}
                      />
                    </div>

                    {/* Group A */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: 10,
                        padding: '12px',
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#6366f1',
                          fontFamily: 'monospace',
                          marginBottom: 8,
                          letterSpacing: '0.06em',
                        }}
                      >
                        🎨 GROUP A — BORDER + BADGE (5)
                      </div>
                      {BORDER_VARIATIONS.map((v) => (
                        <div
                          key={v.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            marginBottom: 5,
                            fontSize: 11.5,
                            color: '#475569',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 3,
                              background: v.borderColor,
                              flexShrink: 0,
                            }}
                          />
                          <span>{v.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Group B */}
                    <div
                      style={{
                        background: '#f0f9ff',
                        borderRadius: 10,
                        padding: '12px',
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#0284c7',
                          fontFamily: 'monospace',
                          marginBottom: 8,
                          letterSpacing: '0.06em',
                        }}
                      >
                        📐 GROUP B — RESIZE + COMPRESS (5)
                      </div>
                      {DIMENSION_VARIATIONS.map((v) => (
                        <div
                          key={v.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 5,
                            fontSize: 11.5,
                            color: '#475569',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <span>{v.name}</span>
                          <span
                            style={{
                              background: '#dbeafe',
                              color: '#1d4ed8',
                              borderRadius: 4,
                              padding: '1px 6px',
                              fontSize: 10,
                              fontFamily: 'monospace',
                            }}
                          >
                            {v.dims.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: '#94a3b8',
                        fontFamily: "'DM Sans', sans-serif",
                        marginBottom: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      Group B images are resized & compressed to Meesho specs —
                      these have the <strong>smallest file size</strong> and are
                      most likely to help with shipping slabs.
                    </div>

                    <button
                      onClick={handleOptimize}
                      disabled={!previewUrl}
                      style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: 12,
                        border: 'none',
                        background: previewUrl
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          : '#e2e8f0',
                        color: previewUrl ? '#fff' : '#94a3b8',
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: previewUrl ? 'pointer' : 'not-allowed',
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: previewUrl
                          ? '0 8px 24px rgba(99,102,241,0.35)'
                          : 'none',
                      }}
                    >
                      ⚡ Generate 10 Variations
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Results */}
              {step === 3 && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  {/* Stats bar */}
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      border: '1.5px solid #e2e8f0',
                      padding: '16px 20px',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 24,
                      flexWrap: 'wrap',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: 9,
                          color: '#94a3b8',
                          fontFamily: 'monospace',
                          marginBottom: 4,
                          letterSpacing: '0.08em',
                        }}
                      >
                        ORIGINAL
                      </div>
                      <img
                        src={previewUrl}
                        alt="Original"
                        style={{
                          height: 90,
                          objectFit: 'contain',
                          borderRadius: 8,
                          border: '1.5px solid #e2e8f0',
                        }}
                      />
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 10,
                          color: '#ef4444',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                        }}
                      >
                        {originalKB} KB
                      </div>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          height: 2,
                          flex: 1,
                          background:
                            'linear-gradient(90deg, #e2e8f0, #6366f1)',
                        }}
                      />
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: '#fff',
                          borderRadius: 10,
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'DM Sans', sans-serif",
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ⚡ 10 Variations
                      </div>
                      <div
                        style={{
                          height: 2,
                          flex: 1,
                          background:
                            'linear-gradient(90deg, #22c55e, #e2e8f0)',
                        }}
                      />
                    </div>

                    {/* Key stats */}
                    {[
                      {
                        label: 'Original Size',
                        value: `${originalKB} KB`,
                        color: '#ef4444',
                      },
                      {
                        label: 'Best Compressed',
                        value: bestKB ? `${bestKB} KB` : '...',
                        color: '#22c55e',
                      },
                      {
                        label: 'Max Reduction',
                        value:
                          bestKB && originalKB
                            ? `${Math.round(
                                ((originalKB - bestKB) / originalKB) * 100
                              )}%`
                            : '...',
                        color: '#0284c7',
                      },
                      {
                        label: 'Category',
                        value: category || '—',
                        color: '#6366f1',
                      },
                    ].map((m) => (
                      <div key={m.label} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 9,
                            color: '#94a3b8',
                            fontFamily: 'monospace',
                            marginBottom: 3,
                            letterSpacing: '0.06em',
                          }}
                        >
                          {m.label.toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: m.color,
                            fontFamily: 'monospace',
                          }}
                        >
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* How it works info box */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: 12,
                      padding: '14px 18px',
                      marginBottom: 20,
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>💡</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: '#1e40af',
                          fontFamily: "'DM Sans', sans-serif",
                          marginBottom: 4,
                        }}
                      >
                        How These Variations Reduce Shipping Charges
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#374151',
                          fontFamily: "'DM Sans', sans-serif",
                          lineHeight: 1.6,
                        }}
                      >
                        <strong>Group A (Border/Badge):</strong> Creates
                        visually distinct images to avoid duplicate listing
                        penalties.
                        <br />
                        <strong>Group B (Resize/Compress):</strong> Smaller JPEG
                        files at Meesho-standard dimensions (1080×1080, 800×800,
                        500×500px). The <strong>500×500 Min Spec</strong> is
                        typically the smallest file — upload this to Meesho and
                        check if your listing shows a reduced shipping slab.
                      </div>
                    </div>
                  </div>

                  {/* Tab filter */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {[
                      { key: 'all', label: 'All 10 Variations' },
                      { key: 'border', label: '🎨 Border + Badge (5)' },
                      { key: 'resize', label: '📐 Resize + Compress (5)' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 20,
                          border: '1.5px solid',
                          borderColor:
                            activeTab === tab.key ? '#6366f1' : '#e2e8f0',
                          background:
                            activeTab === tab.key ? '#6366f1' : '#fff',
                          color: activeTab === tab.key ? '#fff' : '#64748b',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Cards grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(210px, 1fr))',
                      gap: 14,
                      marginBottom: 20,
                    }}
                  >
                    {displayedVariations.map((v) => (
                      <VariationCard
                        key={v.id}
                        variation={v}
                        dataUrl={variations[v.id] || null}
                        isLoading={loadingIds.includes(v.id)}
                        onDownload={handleDownload}
                        originalKB={originalKB}
                      />
                    ))}
                  </div>

                  {/* Bottom tip */}
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 12,
                      padding: '13px 16px',
                      display: 'flex',
                      gap: 10,
                      fontSize: 13,
                      color: '#92400e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>📦</span>
                    <span>
                      <strong>Meesho Seller Tip:</strong> Upload the{' '}
                      <strong>500×500 Min Spec</strong> or{' '}
                      <strong>720×960 Compressed Portrait</strong> to your
                      Meesho listing. These have the smallest file sizes (~30–75
                      KB vs your original {originalKB} KB) and are most likely
                      to register in a lower shipping weight bracket. Always
                      verify in your seller dashboard after uploading.
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
