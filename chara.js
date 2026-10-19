// =====================================================
// キャラクターの絵（アニメ風の2Dイラスト）
// drawCharacter("emi", { outfit, hair, head, side, hand, bg }, "uid") で SVG の文字列を返す
// 絵は 200 x 260 の中に描く
// 重ねる順番：背景 → 相棒 → 後ろ髪・マント → 首 → 足 → 服 → 手に持つ物 → 腕 → 持ち物 → 顔 → 前髪 → 頭の飾り
// =====================================================

const SKIN = "#FBE3D3";
const SKIN_LINE = "#D9A28A";
const OL = 'stroke="#4A3428" stroke-opacity="0.35" stroke-width="1.2" stroke-linejoin="round"';  // うすい輪郭線

// ===== 体の共通パーツ =====
const NECK = `<path d="M92 122 L92 142 Q100 146 108 142 L108 122 Z" fill="${SKIN}"/>
  <path d="M92 128 Q100 136 108 128 L108 134 Q100 140 92 134 Z" fill="#F2C9B3"/>`;

const ARM_PATHS = {
  emi: {
    left: "M76 144 Q62 150 60 174 L58 196 L70 198 L72 178 Q74 164 82 158 Z",
    right: "M124 144 Q138 150 140 174 L142 196 L130 198 L128 178 Q126 164 118 158 Z",
    capL: "M76 144 Q62 150 61 166 L73 168 Q74 162 82 158 Z",
    capR: "M124 144 Q138 150 139 166 L127 168 Q126 162 118 158 Z",
    wideL: "M76 144 Q54 150 50 178 L52 206 L74 206 L74 180 Q76 166 82 158 Z",
    wideR: "M124 144 Q146 150 150 178 L148 206 L126 206 L126 180 Q124 166 118 158 Z",
    hands: [[64, 200, 6.5], [136, 200, 6.5]]
  },
  manato: {
    left: "M72 146 Q56 152 55 176 L54 198 L69 200 L71 180 Q73 166 82 158 Z",
    right: "M128 146 Q144 152 145 176 L146 198 L131 200 L129 180 Q127 166 118 158 Z",
    capL: "M72 146 Q56 152 56 168 L71 170 Q73 162 82 158 Z",
    capR: "M128 146 Q144 152 144 168 L129 170 Q127 162 118 158 Z",
    wideL: "M72 146 Q50 152 48 180 L50 206 L72 206 L72 182 Q74 168 82 158 Z",
    wideR: "M128 146 Q150 152 152 180 L150 206 L128 206 L128 182 Q126 168 118 158 Z",
    hands: [[61, 202, 7.5], [139, 202, 7.5]]
  }
};

// 腕。len は "long"（長袖）"short"（半袖）"none"（袖なし）"wide"（浴衣などの広い袖）
function armsSVG(who, color, len) {
  const a = ARM_PATHS[who];
  const skinArm = `<path d="${a.left}" fill="${SKIN}" ${OL}/><path d="${a.right}" fill="${SKIN}" ${OL}/>`;
  let s = "";
  if (len === "long") s = `<path d="${a.left}" fill="${color}" ${OL}/><path d="${a.right}" fill="${color}" ${OL}/>`;
  if (len === "short") s = skinArm + `<path d="${a.capL}" fill="${color}" ${OL}/><path d="${a.capR}" fill="${color}" ${OL}/>`;
  if (len === "none") s = skinArm;
  if (len === "wide") s = `<path d="${a.wideL}" fill="${color}" ${OL}/><path d="${a.wideR}" fill="${color}" ${OL}/>`;
  return s + a.hands.map(([x, y, r]) =>
    `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r + 0.5}" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="1"/>`).join("");
}

// ===== 顔（アニメ風の目） =====
function faceSVG(who, uid) {
  const isEmi = who === "emi";
  const eye = (cx, outer) => `
    <ellipse cx="${cx}" cy="94" rx="8.5" ry="${isEmi ? 10 : 9}" fill="#fff"/>
    <ellipse cx="${cx}" cy="95.5" rx="6.8" ry="${isEmi ? 8.6 : 7.8}" fill="url(#iris${uid})"/>
    <ellipse cx="${cx}" cy="96.5" rx="3.2" ry="4.4" fill="#1A0F0A"/>
    <circle cx="${cx + 2.6}" cy="91" r="2.6" fill="#fff"/>
    <circle cx="${cx - 2.8}" cy="99.5" r="1.2" fill="#fff" opacity="0.9"/>
    <path d="M${cx - 10} 88 Q${cx} ${isEmi ? 81 : 83} ${cx + 10} 87" stroke="#2A1A14" stroke-width="${isEmi ? 3 : 2.6}" fill="none" stroke-linecap="round"/>
    ${isEmi ? `<path d="M${cx + outer * 10} 87.5 L${cx + outer * 13.5} 84" stroke="#2A1A14" stroke-width="2" stroke-linecap="round"/>` : ""}
    <path d="M${cx - 6} 104.5 Q${cx} 106.5 ${cx + 6} 104.5" stroke="#C88A74" stroke-width="1" fill="none"/>
    <path d="M${cx - 8} ${isEmi ? 77 : 78} Q${cx} ${isEmi ? 73.5 : 75} ${cx + 8} ${isEmi ? 77 : 77}" stroke="${isEmi ? "#5A3A2E" : "#2A2228"}" stroke-width="${isEmi ? 1.6 : 2.8}" fill="none" stroke-linecap="round"/>`;

  const blush = [70, 130].map(x => `<ellipse cx="${x}" cy="109" rx="8" ry="4" fill="#F4A6A0" opacity="${isEmi ? 0.55 : 0.35}"/>
    <path d="M${x - 4} 110 L${x - 2} 107 M${x} 110 L${x + 2} 107 M${x + 4} 110 L${x + 6} 107" stroke="#E98A84" stroke-width="0.8" opacity="0.6"/>`).join("");

  const mouth = isEmi
    ? `<path d="M94 115 Q100 122 106 115 Q100 117.5 94 115 Z" fill="#C25A55"/>`
    : `<path d="M94 116 Q101 120 107 115" stroke="#8A4A3A" stroke-width="2" fill="none" stroke-linecap="round"/>`;

  return `<defs><linearGradient id="iris${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A1810"/><stop offset="1" stop-color="${isEmi ? "#8A5638" : "#5A4030"}"/></linearGradient></defs>
    <path d="M58 78 Q58 36 100 36 Q142 36 142 78 Q142 108 124 122 Q112 132 100 132 Q88 132 76 122 Q58 108 58 78 Z" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="1.2"/>
    ${eye(82, -1)}${eye(118, 1)}${blush}
    <path d="M101 104 Q100 107 98 107" stroke="${SKIN_LINE}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    ${mouth}`;
}


// ===== Emi の髪型 =====
const E_HAIR = "#3A2621";
const E_HAIR_HI = "#6A4A3C";

function emiBangs(color) {
  return `<path d="M56 88 Q52 32 100 28 Q148 32 144 88 L139 70 L134 86 L126 62 L118 84 L108 58 L101 80 L93 58 L84 84 L76 62 L68 86 L62 70 Z" fill="${color}" ${OL}/>
    <path d="M58 74 Q50 108 56 146 L62 134 L66 146 Q64 110 68 82 Z" fill="${color}" ${OL}/>
    <path d="M142 74 Q150 108 144 146 L138 134 L134 146 Q136 110 132 82 Z" fill="${color}" ${OL}/>
    <path d="M68 52 Q100 40 132 52" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.25"/>
    <path d="M88 40 L84 70 M112 40 L116 70" stroke="#000" stroke-opacity="0.15" stroke-width="1"/>`;
}
const E_BACK_SHORT = `<path d="M56 88 Q50 30 100 26 Q150 30 144 88 Q146 118 138 130 L62 130 Q54 118 56 88 Z" fill="${E_HAIR}"/>`;

const EMI_HAIR = {
  long: {
    back: `<path d="M54 84 Q48 28 100 24 Q152 28 146 84 Q150 140 150 196 L142 186 L136 200 L128 184 Q124 160 122 140 L78 140 Q76 160 72 184 L64 200 L58 186 L50 196 Q50 140 54 84 Z" fill="${E_HAIR}" ${OL}/>`,
    front: emiBangs(E_HAIR)
  },
  pony: {
    back: E_BACK_SHORT + `<path d="M132 40 Q176 60 170 120 Q168 150 156 176 L152 160 L144 170 Q160 120 136 60 Z" fill="${E_HAIR}" ${OL}/>`,
    front: emiBangs(E_HAIR) + `<circle cx="136" cy="44" r="6" fill="#E58FA5"/>`
  },
  bun: {
    back: `<circle cx="100" cy="22" r="18" fill="${E_HAIR}" ${OL}/><path d="M88 14 Q100 6 112 14" stroke="${E_HAIR_HI}" stroke-width="2" fill="none"/>` + E_BACK_SHORT,
    front: emiBangs(E_HAIR) + `<path d="M142 80 Q148 96 144 112" stroke="${E_HAIR}" stroke-width="3" fill="none"/>`
  },
  braid: {
    back: E_BACK_SHORT,
    front: emiBangs(E_HAIR) + [136, 150, 164, 178].map(y =>
      `<ellipse cx="${62 - (y - 136) * 0.15}" cy="${y}" rx="8" ry="8" fill="${E_HAIR}" ${OL}/>`).join("") +
      `<circle cx="55" cy="190" r="4" fill="#F2C95C"/>`
  },
  wavy: {
    back: `<path d="M54 84 Q48 28 100 24 Q152 28 146 84 Q160 110 148 134 Q162 156 150 180 Q140 196 128 184 Q124 160 122 140 L78 140 Q76 160 72 184 Q60 196 50 180 Q38 156 52 134 Q40 110 54 84 Z" fill="#5A3A2C" ${OL}/>`,
    front: emiBangs("#5A3A2C")
  },
  bob: {
    back: `<path d="M54 86 Q48 28 100 24 Q152 28 146 86 Q152 120 146 132 L54 132 Q48 120 54 86 Z" fill="${E_HAIR}" ${OL}/>`,
    front: emiBangs(E_HAIR)
  },
  halfup: {
    back: `<path d="M54 84 Q48 28 100 24 Q152 28 146 84 Q150 140 150 196 L142 186 L136 200 L128 184 Q124 160 122 140 L78 140 Q76 160 72 184 L64 200 L58 186 L50 196 Q50 140 54 84 Z" fill="${E_HAIR}" ${OL}/>`,
    front: emiBangs(E_HAIR) + [64, 76, 88, 100, 112, 124, 136].map((x, i) =>
      `<ellipse cx="${x}" cy="${44 - Math.sin((i / 6) * Math.PI) * 10}" rx="6" ry="4.5" fill="${E_HAIR_HI}"/>`).join("")
  }
};


// ===== Manato の髪型 =====
const M_HAIR = "#1E1B22";

const MANATO_HAIR = {
  messy: {
    back: `<path d="M54 92 Q48 30 100 26 Q152 30 146 92 Q140 80 140 70 L60 70 Q60 80 54 92 Z" fill="${M_HAIR}" ${OL}/>`,
    front: `<path d="M52 92 Q46 40 96 28 Q150 26 150 88 L144 74 L140 88 L132 64 L124 82 L114 58 L106 78 L96 56 L88 78 L78 60 L72 82 L64 66 L58 86 Z" fill="${M_HAIR}" ${OL}/>
      <path d="M94 30 Q90 20 98 22 Q100 26 100 28 Z" fill="${M_HAIR}"/>
      <path d="M70 50 Q100 38 130 50" stroke="#fff" stroke-opacity="0.18" stroke-width="4" fill="none" stroke-linecap="round"/>`
  },
  short: {
    back: `<path d="M56 88 Q52 34 100 30 Q148 34 144 88 Z" fill="${M_HAIR}" ${OL}/>`,
    front: `<path d="M56 84 Q54 34 100 30 Q146 34 144 84 L138 72 L130 80 L120 66 L110 76 L100 64 L90 76 L80 66 L70 80 L62 72 Z" fill="${M_HAIR}" ${OL}/>
      <path d="M72 48 Q100 38 128 48" stroke="#fff" stroke-opacity="0.18" stroke-width="4" fill="none" stroke-linecap="round"/>`
  },
  wolf: {
    back: `<path d="M52 92 Q46 28 100 24 Q154 28 148 92 L150 124 L142 114 L138 130 L130 112 L70 112 L62 130 L58 114 L50 124 Z" fill="${M_HAIR}" ${OL}/>`,
    front: `<path d="M52 92 Q46 40 96 28 Q150 26 150 88 L144 74 L140 92 L132 64 L124 86 L114 58 L106 80 L96 56 L88 80 L78 60 L72 86 L64 66 L58 90 Z" fill="${M_HAIR}" ${OL}/>`
  },
  slick: {
    back: `<path d="M56 90 Q52 30 102 26 Q148 30 144 90 Z" fill="${M_HAIR}" ${OL}/>`,
    front: `<path d="M56 80 Q56 30 102 28 Q146 32 144 80 Q130 52 100 52 Q72 54 56 80 Z" fill="${M_HAIR}" ${OL}/>
      <path d="M72 62 Q90 40 120 38 M80 58 Q100 44 130 48 M66 70 Q80 50 104 42" stroke="#fff" stroke-opacity="0.2" stroke-width="1.5" fill="none"/>`
  }
};


// ===== 服 =====
// Emi のワンピース型。top=上、skirt=スカート、len=すそのY、flare=広がり
function emiBody(o) {
  const len = o.len || 218, flare = o.flare === undefined ? 14 : o.flare;
  const legsColor = o.legs || SKIN, shoes = o.shoes || "#8A5A44";
  return {
    legs: `<path d="M87 ${len - 8} L86 238 L95 238 L96 ${len - 8} Z" fill="${legsColor}"/>
      <path d="M104 ${len - 8} L105 238 L114 238 L113 ${len - 8} Z" fill="${legsColor}"/>
      <ellipse cx="90" cy="240" rx="8" ry="4.5" fill="${shoes}"/><ellipse cx="110" cy="240" rx="8" ry="4.5" fill="${shoes}"/>`,
    body: (o.under || "") +
      `<path d="M72 176 L128 176 L${128 + flare} ${len} Q100 ${len + 6} ${72 - flare} ${len} Z" fill="${o.skirt}" ${OL}/>` +
      `<path d="M77 141 Q100 133 123 141 L127 180 L73 180 Z" fill="${o.top}" ${OL}/>` + (o.extra || ""),
    arms: armsSVG("emi", o.sleeve || o.top, o.sleeveLen || "long") + (o.armsExtra || "")
  };
}

// Manato の上着型。hem=すそのY
function manBody(o) {
  const hem = o.hem || 210, pants = o.pants || "#3A3A44", shoes = o.shoes || "#2A2420";
  return {
    back: o.back || "",
    legs: `<path d="M80 ${hem - 6} L80 238 L97 238 L99 ${hem - 6} Z" fill="${pants}" ${OL}/>
      <path d="M101 ${hem - 6} L103 238 L120 238 L120 ${hem - 6} Z" fill="${pants}" ${OL}/>
      <ellipse cx="88" cy="241" rx="10" ry="5" fill="${shoes}"/><ellipse cx="112" cy="241" rx="10" ry="5" fill="${shoes}"/>`,
    body: `<path d="M70 144 Q100 131 130 144 L133 ${hem} L67 ${hem} Z" fill="${o.top}" ${OL}/>` + (o.extra || ""),
    arms: armsSVG("manato", o.sleeve || o.top, o.sleeveLen || "long") + (o.armsExtra || "")
  };
}

const dots = (list, r, color) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join("");
const flower = (x, y, c) => `<g>${[0, 72, 144, 216, 288].map(a =>
  `<circle cx="${x + 3 * Math.cos(a * Math.PI / 180)}" cy="${y + 3 * Math.sin(a * Math.PI / 180)}" r="2.4" fill="${c}"/>`).join("")}<circle cx="${x}" cy="${y}" r="1.6" fill="#F6D27A"/></g>`;
const sailorCollar = (color, tie) => `<path d="M80 140 L100 162 L120 140 L122 150 L100 170 L78 150 Z" fill="${color}" ${OL}/>
  <path d="M82 146 L100 166 L118 146" stroke="#fff" stroke-width="1.2" fill="none"/>
  <path d="M96 164 L104 164 L108 176 L100 172 L92 176 Z" fill="${tie}"/>`;

const EMI_OUTFIT = {
  // 最初の服：アイコンのベージュのコート
  coat: emiBody({ top: "#EADFCC", skirt: "#EADFCC", len: 222, flare: 10, legs: "#3A3540", shoes: "#2E2A30",
    extra: `<path d="M92 138 L100 152 L108 138 Z" fill="#8C4A4A"/><path d="M86 138 L100 162 L93 138 Z M114 138 L100 162 L107 138 Z" fill="#DCCFB9" ${OL}/>
      ${dots([[100, 174], [100, 192], [100, 210]], 2.6, "#8A7660")}<path d="M78 196 L90 196 M110 196 L122 196" stroke="#BFB09A" stroke-width="1.5"/>` }),

  // 第1章 春
  apron: emiBody({ top: "#FFFFFF", skirt: "#E8A0A8", len: 218,
    extra: `<path d="M80 150 L120 150 L124 214 Q100 220 76 214 Z" fill="#FFF8F0" ${OL}/>
      ${flower(88, 176, "#F2A0B0")}${flower(110, 192, "#F7C86A")}${flower(96, 206, "#9CC4E4")}${flower(114, 166, "#F2A0B0")}
      <path d="M80 150 L74 146 M120 150 L126 146" stroke="#FFF8F0" stroke-width="3"/>`, sleeve: "#FFFFFF", sleeveLen: "short" }),
  linen: emiBody({ top: "#C9D3B6", skirt: "#C9D3B6", len: 224, flare: 12,
    extra: `<path d="M73 177 L127 177" stroke="#A7B391" stroke-width="3"/>${dots([[100, 148], [100, 158], [100, 168]], 1.8, "#F5F2EA")}
      <path d="M92 138 Q100 146 108 138" stroke="#A7B391" stroke-width="2" fill="none"/>` }),
  denim: emiBody({ top: "#F2F2F0", skirt: "#3E5A7A", len: 216,
    extra: `<path d="M78 146 L122 146 M77 156 L123 156 M76 166 L124 166" stroke="#9CB4D0" stroke-width="2"/>
      <path d="M84 150 L116 150 L120 212 Q100 218 80 212 Z" fill="#4F6E92" ${OL}/><rect x="92" y="180" width="16" height="12" rx="2" fill="#3E5A7A"/>
      <path d="M90 136 L100 150 L110 136 Z" fill="#C0453F"/>`, sleeve: "#F2F2F0" }),

  // 第2章 夏
  yukata: emiBody({ top: "#2E3A6A", skirt: "#2E3A6A", len: 242, flare: 3, sleeveLen: "wide",
    extra: `<path d="M90 138 L100 160 L110 138" stroke="#fff" stroke-width="3" fill="none"/>
      <rect x="72" y="168" width="56" height="14" fill="#E58FA5" ${OL}/><rect x="94" y="166" width="12" height="18" fill="#F2B8C6"/>
      ${flower(84, 200, "#F2A0B0")}${flower(114, 222, "#9CC4E4")}${flower(90, 230, "#F2A0B0")}${flower(118, 196, "#9CC4E4")}${flower(86, 150, "#9CC4E4")}`,
    armsExtra: `${flower(56, 190, "#F2A0B0")}${flower(144, 186, "#9CC4E4")}` }),
  summer: emiBody({ top: "#FFFDF8", skirt: "#FFFDF8", len: 222, flare: 20, sleeveLen: "short",
    extra: `<path d="M74 178 L126 178" stroke="#E8D8BE" stroke-width="2"/>
      <path d="M${58} 216 Q70 210 80 218 Q90 210 100 218 Q110 210 120 218 Q130 210 142 216" stroke="#E8D8BE" stroke-width="1.5" fill="none"/>` }),
  happi: emiBody({ top: "#C8463E", skirt: "#2B3550", len: 196, flare: 2, sleeveLen: "short",
    extra: `<path d="M90 136 L98 180 M110 136 L102 180" stroke="#fff" stroke-width="5"/>
      <path d="M73 172 L127 172" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>` }),

  // 第3章 秋
  bordeaux: emiBody({ top: "#7A2E3A", skirt: "#7A2E3A", len: 222, flare: 16,
    extra: `<path d="M86 138 Q93 148 100 140 Q107 148 114 138 Z" fill="#fff" ${OL}/>${dots([[100, 156], [100, 166]], 2, "#E8C86A")}` }),
  cardigan: emiBody({ top: "#D9C7A8", skirt: "#8A6B4E", len: 232, flare: 10,
    extra: `<path d="M94 140 L106 140 L106 180 L94 180 Z" fill="#fff"/>${dots([[91, 152], [91, 164], [91, 176]], 2, "#8A6B4E")}
      <path d="M77 172 L123 172" stroke="#C7B494" stroke-width="2"/>` }),
  check: emiBody({ top: "#F6EFE4", skirt: "#9A6A42", len: 218, flare: 14,
    extra: `<path d="M74 186 L126 186 M72 198 L130 198 M70 210 L134 210 M86 176 L82 216 M100 176 L100 218 M114 176 L118 216" stroke="#7A4E2E" stroke-width="1.5"/>
      <rect x="86" y="160" width="28" height="18" fill="#9A6A42" ${OL}/><path d="M84 144 L86 178 M116 144 L114 178" stroke="#9A6A42" stroke-width="4"/>`, sleeve: "#F6EFE4" }),

  // 第5章 ふたりの船出（Manato とおそろい）
  marine: emiBody({ top: "#2C3E6B", skirt: "#2C3E6B", len: 220, flare: 16, sleeveLen: "short", extra: sailorCollar("#fff", "#C8463E") }),
  sailor: emiBody({ top: "#FFFFFF", skirt: "#2C3E6B", len: 216, flare: 16, sleeveLen: "short",
    extra: sailorCollar("#2C3E6B", "#C8463E") + `<path d="M84 180 L80 214 M100 180 L100 218 M116 180 L120 214" stroke="#1E2C52" stroke-width="1.5"/>` }),
  travel: emiBody({ top: "#C49A6C", skirt: "#C49A6C", len: 226, flare: 10, legs: "#3A3540",
    extra: `<rect x="72" y="172" width="56" height="7" fill="#9A7448"/><rect x="96" y="171" width="8" height="9" fill="#E8C86A"/>
      <path d="M84 138 L100 160 L92 138 Z M116 138 L100 160 L108 138 Z" fill="#B0875A" ${OL}/>${dots([[100, 190], [100, 206]], 2.4, "#7A5A38")}` }),

  // 終章 舞踏会
  rose: emiBody({ top: "#F4C9C9", skirt: "#F7DADA", len: 246, flare: 42, sleeveLen: "short",
    extra: `<path d="M50 236 Q100 250 150 236" stroke="#E8C86A" stroke-width="2" fill="none"/><path d="M60 214 Q100 224 140 214" stroke="#F0B4B4" stroke-width="2" fill="none"/>
      ${flower(100, 150, "#E58FA5")}`,
    armsExtra: `<circle cx="70" cy="148" r="11" fill="#F4C9C9" ${OL}/><circle cx="130" cy="148" r="11" fill="#F4C9C9" ${OL}/>` }),
  starry: emiBody({ top: "#23306A", skirt: "#2E3D80", len: 246, flare: 38, sleeveLen: "short",
    extra: dots([[70, 222], [90, 206], [118, 214], [132, 236], [80, 240], [104, 230], [96, 190], [112, 196], [100, 156]], 1.8, "#F6E7A6") +
      `<path d="M58 238 Q100 252 142 238" stroke="#8FA8E8" stroke-width="1.5" fill="none"/>` }),
  floral: emiBody({ top: "#FFFFFF", skirt: "#FFFBF5", len: 246, flare: 40, sleeveLen: "short",
    extra: flower(70, 230, "#F2A0B0") + flower(90, 214, "#F7C86A") + flower(116, 222, "#F2A0B0") + flower(132, 238, "#9CC4E4") +
      flower(104, 240, "#F7C86A") + flower(84, 196, "#9CC4E4") + flower(100, 150, "#F2A0B0") +
      `<path d="M66 224 Q72 220 76 226 M122 216 Q128 212 132 218" stroke="#8DBF6A" stroke-width="2" fill="none"/>` })
};

const MANATO_OUTFIT = {
  // 最初の服：アイコンのモスグリーンのジャケット
  jacket: manBody({ top: "#4A5340",
    extra: `<path d="M94 140 L106 140 L106 210 L94 210 Z" fill="#7D6A55"/>
      <path d="M76 140 L92 162 L100 146 L108 162 L124 140 Q100 132 76 140 Z" fill="#6A4A34" ${OL}/>
      <rect x="72" y="184" width="20" height="14" rx="2" fill="#3F4736" ${OL}/><rect x="108" y="184" width="20" height="14" rx="2" fill="#3F4736" ${OL}/>` }),

  // 春
  workshirt: manBody({ top: "#7A95B5", sleeveLen: "short",
    extra: `${dots([[100, 156], [100, 170], [100, 184], [100, 198]], 1.8, "#E8EEF4")}<rect x="78" y="156" width="14" height="12" fill="#6A85A5" ${OL}/>
      <path d="M90 138 L100 150 L110 138" stroke="#6A85A5" stroke-width="3" fill="none"/>`,
    armsExtra: `<path d="M56 166 L72 168 M128 168 L144 166" stroke="#7A95B5" stroke-width="5"/>` }),
  raincoat: manBody({ top: "#E8B53A", hem: 216,
    extra: `<path d="M100 140 L100 216" stroke="#C99624" stroke-width="2"/><path d="M80 138 Q100 128 120 138 L118 146 Q100 138 82 146 Z" fill="#D9A52E" ${OL}/>
      <rect x="74" y="186" width="18" height="12" fill="#D9A52E"/><rect x="108" y="186" width="18" height="12" fill="#D9A52E"/>` }),
  cadet: manBody({ top: "#F4F4F2", pants: "#24345A", extra: sailorCollar("#24345A", "#1A1A1A") }),

  // 夏
  tank: manBody({ top: "#3A3F48", sleeveLen: "none", pants: "#5A6A7A",
    extra: `<path d="M70 144 Q78 140 84 150 L84 144 Z M130 144 Q122 140 116 150 L116 144 Z" fill="${SKIN}"/><path d="M86 146 Q100 154 114 146" stroke="#2A2E36" stroke-width="2" fill="none"/>` }),
  rashguard: manBody({ top: "#2A7A8C", pants: "#2A2E36",
    extra: `<path d="M70 160 L133 168" stroke="#7FD0E0" stroke-width="3"/><path d="M90 138 L110 138 L106 146 L94 146 Z" fill="#1F5C6A"/>`,
    armsExtra: `<path d="M58 176 L70 178 M130 178 L142 176" stroke="#7FD0E0" stroke-width="3"/>` }),
  marinejacket: manBody({ top: "#24345A", pants: "#F2EEE4",
    extra: `${dots([[88, 158], [88, 174], [88, 190], [112, 158], [112, 174], [112, 190]], 2.4, "#E8C86A")}
      <path d="M80 140 L94 156 L100 142 L106 156 L120 140" stroke="#F2EEE4" stroke-width="3" fill="none"/>` }),

  // 秋
  vest: manBody({ top: "#F2EEE4", sleeve: "#F2EEE4", sleeveLen: "short", pants: "#4A4036",
    extra: `<path d="M70 146 L92 146 L96 210 L67 210 Z M130 146 L108 146 L104 210 L133 210 Z" fill="#6B4430" ${OL}/>${dots([[90, 170], [90, 186]], 2, "#C9A06A")}`,
    armsExtra: `<path d="M56 166 L72 168 M128 168 L144 166" stroke="#E2DACA" stroke-width="5"/>` }),
  oilcoat: manBody({ top: "#3E4A3A", hem: 224, pants: "#2A2A30",
    extra: `<path d="M78 140 L90 132 L100 146 L110 132 L122 140 L116 150 L100 146 L84 150 Z" fill="#33402F" ${OL}/>
      <path d="M100 146 L100 224" stroke="#2A3426" stroke-width="2"/>${dots([[96, 166], [96, 186], [96, 206]], 2.2, "#C9B48A")}` }),
  navcoat: manBody({ top: "#1E2A4A", hem: 224, pants: "#F2EEE4",
    extra: `${dots([[90, 160], [90, 178], [90, 196], [110, 160], [110, 178], [110, 196]], 2.4, "#E8C86A")}
      <path d="M80 140 L94 158 L100 144 L106 158 L120 140" stroke="#E8C86A" stroke-width="2" fill="none"/>`,
    armsExtra: `<path d="M56 186 L70 188 M130 188 L144 186" stroke="#E8C86A" stroke-width="3"/>` }),

  // 第5章 ふたりの船出（Emi とおそろい）
  border: manBody({ top: "#F7F5F0", pants: "#D8C7A4",
    extra: [152, 164, 176, 188, 200].map(y => `<path d="M68 ${y} L132 ${y}" stroke="#2C3E6B" stroke-width="4"/>`).join("") }),
  sailor: manBody({ top: "#FFFFFF", pants: "#2C3E6B", extra: sailorCollar("#2C3E6B", "#C8463E") }),
  travel: manBody({ top: "#C49A6C", hem: 222, pants: "#3A3540",
    extra: `<rect x="67" y="184" width="66" height="7" fill="#9A7448"/><rect x="96" y="183" width="8" height="9" fill="#E8C86A"/>
      <path d="M80 140 L96 166 L88 140 Z M120 140 L104 166 L112 140 Z" fill="#B0875A" ${OL}/>` }),

  // 終章
  seaking: manBody({ top: "#F7F3EA", pants: "#F7F3EA", shoes: "#5A3E2A",
    back: `<path d="M64 142 L136 142 L158 236 L42 236 Z" fill="#B3312E" ${OL}/>`,
    extra: `<path d="M74 144 L126 204" stroke="#2C3E6B" stroke-width="7"/><path d="M70 144 Q100 132 130 144" stroke="#E8C86A" stroke-width="4" fill="none"/>
      ${dots([[90, 176], [110, 160]], 2.4, "#E8C86A")}`,
    armsExtra: `<circle cx="70" cy="148" r="9" fill="#E8C86A"/><circle cx="130" cy="148" r="9" fill="#E8C86A"/>` }),
  admiral: manBody({ top: "#1C2747", pants: "#1C2747",
    extra: `<path d="M76 144 L124 200" stroke="#7FB0E0" stroke-width="6"/>${dots([[88, 168], [94, 168]], 3, "#E8C86A")}
      <path d="M86 140 L100 154 L114 140" stroke="#E8C86A" stroke-width="2" fill="none"/>`,
    armsExtra: `<rect x="60" y="142" width="22" height="8" rx="3" fill="#E8C86A"/><rect x="118" y="142" width="22" height="8" rx="3" fill="#E8C86A"/>` }),
  tuxedo: manBody({ top: "#22222A", pants: "#22222A", shoes: "#111",
    extra: `<path d="M88 140 L112 140 L104 196 L96 196 Z" fill="#FFFFFF"/><path d="M80 140 L96 186 L90 140 Z M120 140 L104 186 L110 140 Z" fill="#33333D" ${OL}/>
      <path d="M92 146 L100 150 L108 146 L108 154 L100 150 L92 154 Z" fill="#B3312E"/>${dots([[100, 168], [100, 180]], 1.6, "#22222A")}` })
};


// ===== 頭の飾り・帽子 =====
const captainHat = (c) => `<path d="M58 44 Q100 16 142 44 L136 54 L64 54 Z" fill="#fff" ${OL}/><rect x="62" y="50" width="76" height="9" fill="${c}"/>
  <path d="M64 58 Q100 70 136 58 L132 64 Q100 74 68 64 Z" fill="#1A1A1A"/><circle cx="100" cy="42" r="5" fill="#E8C86A"/>`;
const marineCap = (c) => `<path d="M62 50 Q100 14 138 50 Z" fill="${c}" ${OL}/><path d="M62 50 Q100 60 138 50" stroke="#fff" stroke-width="3" fill="none"/>
  <path d="M100 52 Q124 56 146 54 Q130 64 100 60 Z" fill="${c}"/>`;
const boater = (ribbon) => `<ellipse cx="100" cy="48" rx="56" ry="10" fill="#E9CF8E" ${OL}/><path d="M72 46 L74 26 Q100 18 126 26 L128 46 Z" fill="#E9CF8E" ${OL}/>
  <rect x="73" y="36" width="54" height="8" fill="${ribbon}"/>`;

const EMI_HEAD = {
  none: "",
  ribbon: `<path d="M118 42 L134 32 L132 52 Z M150 42 L134 32 L136 52 Z" fill="#E58FA5" ${OL}/><circle cx="134" cy="42" r="4.5" fill="#D46F8A"/>`,
  straw: `<ellipse cx="100" cy="46" rx="60" ry="12" fill="#E9CF8E" ${OL}/><path d="M70 44 Q72 18 100 16 Q128 18 130 44 Z" fill="#E9CF8E" ${OL}/>
    <path d="M71 38 Q100 30 129 38" stroke="#C8463E" stroke-width="5" fill="none"/>`,
  flowerpin: flower(132, 52, "#F7C86A") + flower(142, 62, "#F2A0B0"),
  beret: `<ellipse cx="96" cy="34" rx="40" ry="14" fill="#B3312E" ${OL}/><circle cx="96" cy="20" r="3" fill="#B3312E"/>`,
  acorn: `<ellipse cx="136" cy="56" rx="5" ry="6" fill="#9A6A42"/><path d="M130 52 Q136 44 142 52 Z" fill="#6A4A30"/>
    <ellipse cx="128" cy="62" rx="4" ry="5" fill="#9A6A42"/><path d="M123 59 Q128 52 133 59 Z" fill="#6A4A30"/>
    <path d="M140 60 Q148 56 150 64" stroke="#C47A3A" stroke-width="3" fill="none"/>`,
  crown: [62, 74, 88, 100, 112, 126, 138].map((x, i) =>
    flower(x, 44 - Math.sin((i / 6) * Math.PI) * 12, ["#F7C6D0", "#FFF3B0", "#C9E4F6"][i % 3])).join(""),
  captain: captainHat("#2C3E6B"),
  mberet: `<ellipse cx="100" cy="34" rx="42" ry="13" fill="#2C3E6B" ${OL}/><circle cx="100" cy="21" r="4" fill="#C8463E"/>`,
  boater: boater("#E58FA5")
};

const MANATO_HEAD = {
  none: "",
  hachimaki: `<path d="M56 64 Q100 50 144 64 L144 72 Q100 58 56 72 Z" fill="#F7F5F0" ${OL}/><path d="M142 66 L156 58 L152 70 Z" fill="#F7F5F0" ${OL}/>`,
  cap: `<path d="M60 52 Q100 10 140 52 Z" fill="#E2713A" ${OL}/><path d="M60 52 L34 58 Q50 46 66 48 Z" fill="#C85E2E"/><circle cx="100" cy="24" r="3" fill="#C85E2E"/>`,
  sailorcap: `<path d="M64 48 Q64 26 100 24 Q136 26 136 48 Z" fill="#fff" ${OL}/><rect x="64" y="44" width="72" height="8" fill="#24345A"/>`,
  bandana: `<path d="M56 60 Q58 26 100 24 Q142 26 144 60 Q100 50 56 60 Z" fill="#B3312E" ${OL}/>${dots([[80, 40], [100, 34], [120, 40], [90, 50], [112, 50]], 2, "#fff")}
    <path d="M142 56 L160 66 L150 74 Z" fill="#B3312E"/>`,
  knit: `<path d="M58 60 Q58 18 100 16 Q142 18 142 60 Z" fill="#5A6A7A" ${OL}/><rect x="56" y="52" width="88" height="12" rx="4" fill="#4A5868" ${OL}/>
    <circle cx="100" cy="14" r="8" fill="#E8E2D6"/>`,
  navhat: `<path d="M44 52 Q100 6 156 52 Q100 40 44 52 Z" fill="#1E2A4A" ${OL}/><path d="M48 50 Q100 40 152 50" stroke="#E8C86A" stroke-width="2" fill="none"/>
    <circle cx="100" cy="32" r="4" fill="#E8C86A"/>`,
  captain: captainHat("#2C3E6B"),
  mcap: marineCap("#2C3E6B"),
  boater: boater("#2C3E6B")
};


// ===== 持ち物・相棒 =====
const kitten = `<g><ellipse cx="44" cy="232" rx="13" ry="9" fill="#F2A65A"/><circle cx="36" cy="220" r="9" fill="#F2A65A"/>
  <path d="M29 214 L30 206 L35 212 Z M43 214 L42 206 L37 212 Z" fill="#F2A65A"/><circle cx="33" cy="219" r="1.3" fill="#2A1A14"/><circle cx="39" cy="219" r="1.3" fill="#2A1A14"/>
  <path d="M56 230 Q66 222 62 214" stroke="#F2A65A" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const bird = (x, y, c) => `<g><ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="${c}"/><circle cx="${x + 6}" cy="${y - 4}" r="4.5" fill="${c}"/>
  <path d="M${x + 10} ${y - 4} L${x + 14} ${y - 3} L${x + 10} ${y - 2} Z" fill="#F2A23C"/><circle cx="${x + 7}" cy="${y - 5}" r="1" fill="#1A1A1A"/>
  <path d="M${x - 6} ${y} L${x - 12} ${y + 2} L${x - 6} ${y + 4} Z" fill="${c}"/></g>`;
const seagull = (x, y) => `<g><ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#fff" ${OL}/><circle cx="${x + 8}" cy="${y - 5}" r="5" fill="#fff" ${OL}/>
  <path d="M${x + 12} ${y - 5} L${x + 18} ${y - 4} L${x + 12} ${y - 2} Z" fill="#F2C24A"/><circle cx="${x + 9}" cy="${y - 6}" r="1" fill="#1A1A1A"/>
  <path d="M${x - 6} ${y - 2} Q${x - 2} ${y - 12} ${x + 4} ${y - 4} Z" fill="#B9C2CC"/></g>`;
const compass = (x, y) => `<g><circle cx="${x}" cy="${y}" r="10" fill="#E8C86A" ${OL}/><circle cx="${x}" cy="${y}" r="7" fill="#FFF8E6"/>
  <path d="M${x} ${y - 6} L${x + 2} ${y} L${x} ${y + 6} L${x - 2} ${y} Z" fill="#C8463E"/></g>`;

const EMI_SIDE = {
  none: "",
  bag: `<path d="M118 144 L70 196" stroke="#2C3550" stroke-width="3"/><rect x="54" y="192" width="26" height="20" rx="5" fill="#2C3550" ${OL}/>`,
  chalkboard: `<path d="M24 196 L34 244 M64 196 L54 244" stroke="#8A6A4A" stroke-width="3"/><rect x="22" y="190" width="44" height="34" rx="3" fill="#2F3B35" stroke="#8A6A4A" stroke-width="3"/>
    <path d="M30 202 L56 202 M30 210 L50 210" stroke="#F5F2EA" stroke-width="1.5"/>${flower(56, 216, "#F2A0B0")}`,
  bread: `<path d="M50 196 L80 196 L76 214 L54 214 Z" fill="#C8955A" ${OL}/><path d="M50 196 Q65 182 80 196" stroke="#A7783F" stroke-width="2" fill="none"/>
    <ellipse cx="58" cy="194" rx="7" ry="4" fill="#E8B46A"/><ellipse cx="72" cy="192" rx="8" ry="4" fill="#D99A50"/>`,
  kitten: kitten,
  mic: `<path d="M66 200 L72 176" stroke="#555" stroke-width="4" stroke-linecap="round"/><circle cx="73" cy="172" r="7" fill="#9AA4B0" ${OL}/>`,
  apples: `<path d="M48 200 L80 200 L76 220 L52 220 Z" fill="#B88A5E" ${OL}/>${dots([[56, 196], [66, 194], [76, 196], [61, 188], [71, 188]], 5.5, "#D2453E")}`,
  bird: bird(126, 138, "#7FB0E0"),
  invitation: `<rect x="56" y="186" width="26" height="18" rx="2" fill="#FFF8E6" transform="rotate(-12 69 195)" ${OL}/><circle cx="69" cy="195" r="3.5" fill="#B3312E"/>`,
  compass: compass(66, 198),
  seagull: seagull(132, 136)
};

const MANATO_SIDE = {
  none: "",
  crab: `<g><ellipse cx="40" cy="234" rx="13" ry="8" fill="#D9503E" ${OL}/><circle cx="35" cy="226" r="2" fill="#1A1A1A"/><circle cx="45" cy="226" r="2" fill="#1A1A1A"/>
    <path d="M26 230 Q18 220 24 214 Q30 220 28 226 Z M54 230 Q62 220 56 214 Q50 220 52 226 Z" fill="#D9503E"/></g>`,
  turtle: `<g><ellipse cx="42" cy="232" rx="17" ry="10" fill="#5E8F4A" ${OL}/><path d="M32 228 L52 228 M42 222 L42 240" stroke="#3E6A30" stroke-width="1.5"/>
    <circle cx="60" cy="230" r="6" fill="#9CC48A"/><circle cx="62" cy="228" r="1.2" fill="#1A1A1A"/></g>`,
  parrot: `<g><ellipse cx="130" cy="134" rx="8" ry="11" fill="#D9503E" ${OL}/><circle cx="132" cy="122" r="6" fill="#D9503E"/>
    <path d="M137 121 Q142 124 137 127 Z" fill="#F2C24A"/><circle cx="133" cy="120" r="1.2" fill="#1A1A1A"/><path d="M126 140 L122 156 L130 144 Z" fill="#3A7FD0"/></g>`
};

// Manato が右手に持つもの
const paddle = (shaft, blade) => `<path d="M150 112 L134 222" stroke="${shaft}" stroke-width="5" stroke-linecap="round"/>
  <rect x="142" y="106" width="18" height="6" rx="3" fill="${shaft}"/><path d="M126 210 L142 212 L138 248 Q130 252 122 246 Z" fill="${blade}" ${OL}/>`;

const MANATO_HAND = {
  none: "",
  paddle: paddle("#A7783F", "#C8955A"),
  bottle: `<rect x="132" y="196" width="14" height="26" rx="5" fill="#5A8FA8" ${OL}/><rect x="135" y="190" width="8" height="7" fill="#3A3A44"/>`,
  logbook: `<rect x="128" y="188" width="22" height="28" rx="2" fill="#6B4430" ${OL}/><rect x="131" y="190" width="17" height="24" fill="#F2EAD8"/>
    <path d="M134 196 L145 196 M134 202 L145 202 M134 208 L142 208" stroke="#8A7660" stroke-width="1"/>`,
  carbon: paddle("#222326", "#33363C") + `<path d="M130 216 L131 244" stroke="#4FB3C7" stroke-width="2"/>`,
  longpaddle: `<path d="M152 96 L132 232" stroke="#D8DEE6" stroke-width="4" stroke-linecap="round"/><rect x="144" y="90" width="18" height="6" rx="3" fill="#8A939E"/>
    <path d="M124 222 L140 224 L137 254 Q129 258 121 252 Z" fill="#E2713A" ${OL}/>`,
  telescope: `<g transform="rotate(-35 139 200)"><rect x="132" y="150" width="9" height="50" rx="2" fill="#B88A3E" ${OL}/><rect x="130" y="146" width="13" height="8" rx="2" fill="#8A6A2E"/></g>`,
  legend: `<ellipse cx="132" cy="232" rx="20" ry="26" fill="#FFE9A0" opacity="0.5"/>` + paddle("#E8B84A", "#F6D27A") + `<circle cx="150" cy="104" r="3" fill="#fff"/>`,
  compass: compass(140, 206),
  wheel: `<g><circle cx="150" cy="210" r="18" fill="none" stroke="#8A5A34" stroke-width="5"/><circle cx="150" cy="210" r="5" fill="#8A5A34"/>
    ${[0, 45, 90, 135].map(a => `<path d="M${150 - 26 * Math.cos(a * Math.PI / 180)} ${210 - 26 * Math.sin(a * Math.PI / 180)} L${150 + 26 * Math.cos(a * Math.PI / 180)} ${210 + 26 * Math.sin(a * Math.PI / 180)}" stroke="#8A5A34" stroke-width="3" stroke-linecap="round"/>`).join("")}</g>`
};


// ===== 背景 =====
// uid はページ内で同じ id がぶつからないようにするための印
function background(id, uid) {
  const sky = (top, low) => `<defs><linearGradient id="sky${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${low}"/></linearGradient></defs>
    <rect width="200" height="260" fill="url(#sky${uid})"/>`;
  const stars = [[20, 20], [60, 40], [150, 18], [180, 50], [110, 12], [30, 70], [170, 90]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFF6D8"/>`).join("");
  const sea = (y, c1, c2) => `<rect y="${y}" width="200" height="${260 - y}" fill="${c1}"/><path d="M0 ${y + 14} Q50 ${y + 8} 100 ${y + 14} T200 ${y + 14}" stroke="${c2}" stroke-width="2" fill="none"/>`;
  const lantern = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="8" fill="#F2A23C"/><ellipse cx="${x}" cy="${y}" rx="3" ry="5" fill="#FFE2A0"/>`;
  const house = (x, w, h, c, roof) => `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" fill="${c}"/><polygon points="${x - 4},${200 - h} ${x + w / 2},${186 - h} ${x + w + 4},${200 - h}" fill="${roof}"/>
    <rect x="${x + w / 2 - 5}" y="${206 - h}" width="10" height="10" fill="#FFF4D6"/>`;

  const scenes = {
    // 季節がめぐる小さな街（最初の背景）
    town: sky("#CFE6F2", "#F8F1E6") + house(4, 40, 70, "#F2E2CF", "#C9775A") + house(150, 46, 80, "#E8D8C8", "#7A9AB0") +
      `<rect y="200" width="200" height="60" fill="#D9C9B0"/><path d="M0 214 L200 214" stroke="#C7B496" stroke-width="1.5"/>` +
      `<rect x="16" y="150" width="5" height="50" fill="#8A6A4A"/><circle cx="18" cy="146" r="16" fill="#F7C6D0"/>
      <rect x="180" y="146" width="5" height="54" fill="#8A6A4A"/><circle cx="182" cy="140" r="16" fill="#F7C6D0"/>`,

    // Emi 夏
    matsuri: sky("#2A2A5A", "#6A4A7A") + stars + `<rect y="190" width="200" height="70" fill="#4A3A3A"/>` +
      `<path d="M0 60 Q100 90 200 60" stroke="#3A2A2A" stroke-width="1.5" fill="none"/>` +
      [20, 52, 84, 116, 148, 180].map((x, i) => lantern(x, 68 + Math.sin(i) * 4)).join("") +
      `<rect x="8" y="150" width="56" height="44" fill="#C8463E"/><rect x="138" y="150" width="56" height="44" fill="#2E5E8F"/><path d="M8 150 L64 150 L60 140 L12 140 Z M138 150 L194 150 L190 140 L142 140 Z" fill="#F5F0E6"/>`,
    sunflower: sky("#8EC8EE", "#E6F4FA") + `<rect y="180" width="200" height="80" fill="#8DBF6A"/>` +
      [[20, 176], [50, 190], [150, 186], [180, 174], [34, 214], [168, 210]].map(([x, y]) =>
        `<path d="M${x} ${y} L${x} ${y + 40}" stroke="#5E8F4A" stroke-width="3"/><circle cx="${x}" cy="${y}" r="11" fill="#F7C83A"/><circle cx="${x}" cy="${y}" r="5" fill="#8A5A2A"/>`).join(""),
    hanabi: sky("#0E1340", "#2A2470") + stars + `<rect y="196" width="200" height="64" fill="#1A2A4A"/><path d="M0 196 Q100 186 200 196" stroke="#3A4A7A" stroke-width="2" fill="none"/>` +
      [[44, 54, "#F2C95C"], [150, 44, "#F07D98"], [100, 30, "#7FD0E0"]].map(([x, y, c]) =>
        `<circle cx="${x}" cy="${y}" r="24" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="2 5"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="2 4"/>`).join(""),

    // Emi 冬
    illumination: sky("#1A2244", "#3A3A6A") + `<rect y="196" width="200" height="64" fill="#E8ECF2"/>` +
      `<polygon points="100,40 140,170 60,170" fill="#2E5E4A"/>` + dots([[90, 80], [110, 100], [84, 120], [116, 140], [100, 156], [76, 160], [124, 116]], 3, "#FFE2A0") +
      `<path d="M100 30 L103 38 L111 38 L105 43 L107 51 L100 46 L93 51 L95 43 L89 38 L97 38 Z" fill="#F7D35A"/>` +
      [[20, 30], [50, 80], [170, 60], [186, 110], [30, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join(""),
    snowforest: sky("#BFD0E0", "#EEF2F6") + `<rect y="190" width="200" height="70" fill="#FAFCFE"/>` +
      [[24, 120], [64, 100], [140, 108], [178, 124]].map(([x, y]) =>
        `<polygon points="${x},${y} ${x + 26},${y + 80} ${x - 26},${y + 80}" fill="#5E7F70"/><polygon points="${x},${y} ${x + 12},${y + 28} ${x - 12},${y + 28}" fill="#fff"/>`).join("") +
      dots([[40, 40], [90, 60], [160, 30], [120, 90], [20, 90]], 2, "#fff"),
    fireplace: `<rect width="200" height="260" fill="#E8D6BE"/><rect y="204" width="200" height="56" fill="#9A6A42"/>
      <rect x="120" y="120" width="70" height="84" fill="#B8826A"/><rect x="132" y="150" width="46" height="54" fill="#3A2A22"/>
      <path d="M140 204 Q150 168 156 190 Q162 160 170 204 Z" fill="#F2A23C"/><rect x="16" y="40" width="70" height="60" rx="4" fill="#9CB8D0"/>
      ${dots([[30, 56], [60, 70], [74, 50]], 2, "#fff")}`,

    // Manato 夏
    roughsea: sky("#5F7385", "#9DB0BE") + sea(150, "#2F4E66", "#9DB0BE") +
      `<path d="M0 170 Q30 136 60 170 Q90 136 120 170 Q150 136 180 170 L200 170 L200 194 L0 194 Z" fill="#E8F0F4" opacity="0.7"/>`,
    summersea: sky("#4FA8E0", "#CFEAF8") + `<circle cx="160" cy="44" r="18" fill="#FFF3C0"/>` + sea(150, "#2E8FB8", "#9FD8EE") +
      `<ellipse cx="60" cy="70" rx="26" ry="9" fill="#fff"/><ellipse cx="80" cy="64" rx="18" ry="8" fill="#fff"/>`,
    busyport: sky("#A9D4EE", "#F2EDE2") + sea(150, "#4F8496", "#8FC0D0") + `<rect y="200" width="200" height="60" fill="#8A6A4A"/>` +
      `<path d="M120 140 L180 140 L172 154 L128 154 Z" fill="#F5F0E6"/><path d="M150 140 L150 96 L176 136 Z" fill="#F5F0E6"/>` +
      `<path d="M20 140 L60 140 L56 150 L24 150 Z" fill="#C8463E"/><path d="M40 140 L40 112 L54 136 Z" fill="#fff"/>`,

    // Manato 冬
    stormnight: sky("#1A2030", "#3A4658") + sea(160, "#1E2C3A", "#5A6E80") +
      `<path d="M120 20 L108 60 L120 60 L104 104" stroke="#F6E7A6" stroke-width="3" fill="none"/>` +
      `<path d="M0 176 Q40 146 80 176 Q120 146 160 176 L200 176 L200 196 L0 196 Z" fill="#AFC0CC" opacity="0.5"/>`,
    northsea: sky("#9AB0C4", "#E2EAF0") + sea(156, "#3E5A70", "#B8CCD8") +
      `<polygon points="20,156 44,120 70,156" fill="#F4F8FB"/><polygon points="140,156 160,132 186,156" fill="#F4F8FB"/>` +
      dots([[30, 30], [80, 50], [130, 26], [176, 60]], 2, "#fff"),
    lighthouse: sky("#2A3458", "#7A86A8") + stars + sea(166, "#24304A", "#5A6688") +
      `<path d="M150 166 L156 80 L172 80 L178 166 Z" fill="#F4F0E6"/><path d="M152 120 L176 120 L175 132 L153 132 Z" fill="#C8463E"/>
      <rect x="152" y="68" width="24" height="14" fill="#3A3A44"/><path d="M164 74 L40 40 L40 60 Z" fill="#FFE9A0" opacity="0.4"/>`,

    // 第5章 ふたりの船出（2人共通）
    dawnport: sky("#F2B48A", "#FBE8D2") + `<circle cx="100" cy="150" r="24" fill="#FFF3D8"/>` + sea(150, "#7A8FB0", "#F2C8A8") +
      `<rect y="210" width="200" height="50" fill="#8A6A4A"/><rect x="20" y="180" width="6" height="34" fill="#5A4030"/><rect x="174" y="180" width="6" height="34" fill="#5A4030"/>`,
    ocean: sky("#7AB8E0", "#D8EEF8") + sea(140, "#2E6E9A", "#9FD0EA") +
      `<path d="M40 130 Q60 120 80 130" stroke="#fff" stroke-width="2" fill="none"/>${seagull(150, 60)}${seagull(40, 80)}`,
    deck: sky("#8EC8EE", "#E6F4FA") + sea(140, "#3E86B0", "#9FD0EA") + `<rect y="190" width="200" height="70" fill="#B8865A"/>` +
      `<path d="M0 204 L200 204 M0 222 L200 222 M0 240 L200 240" stroke="#9A6A42" stroke-width="1.5"/>` +
      `<path d="M0 176 L200 176" stroke="#F5F0E6" stroke-width="4"/>${[10, 50, 90, 130, 170].map(x => `<rect x="${x}" y="176" width="4" height="16" fill="#F5F0E6"/>`).join("")}` +
      `<path d="M30 30 L30 176 M30 40 L80 140 L30 140 Z" stroke="#8A5A34" stroke-width="3" fill="#F7F3EA"/>`,

    // 終章（Lv.100 のごほうび）
    ballroom: sky("#3A2A5A", "#8A6AA8") + `<rect y="196" width="200" height="64" fill="#E8D8F0"/><path d="M0 196 L200 196" stroke="#E8C86A" stroke-width="2"/>` +
      `<path d="M70 10 L130 10 L120 40 L80 40 Z" fill="#E8C86A"/>${dots([[80, 46], [92, 50], [100, 52], [108, 50], [120, 46]], 3, "#FFF3C0")}` +
      [20, 180].map(x => `<rect x="${x - 8}" y="60" width="16" height="136" fill="#F4ECF8"/>`).join("") +
      dots([[40, 30], [160, 30], [60, 80], [140, 80]], 2, "#FFF3C0")
  };
  return scenes[id] || scenes.town;
}


// ===== キャラ全体を組み立てる =====
function drawCharacter(who, style, uid) {
  style = style || {};
  const isEmi = who === "emi";
  const outfits = isEmi ? EMI_OUTFIT : MANATO_OUTFIT;
  const hairs = isEmi ? EMI_HAIR : MANATO_HAIR;
  const o = outfits[style.outfit] || outfits[isEmi ? "coat" : "jacket"];
  const h = hairs[style.hair] || hairs[isEmi ? "long" : "messy"];
  const head = (isEmi ? EMI_HEAD : MANATO_HEAD)[style.head] || "";
  const sides = isEmi ? EMI_SIDE : MANATO_SIDE;
  const side = style.side in sides ? sides[style.side] : (isEmi ? EMI_SIDE.bag : "");
  const hand = isEmi ? "" : (MANATO_HAND[style.hand] || "");

  // 相棒のうち、足もとにいるものは体の後ろ、肩や手にあるものは前に描く
  const sideBehind = ["kitten", "chalkboard", "crab", "turtle"].includes(style.side);

  return `<svg viewBox="0 0 200 260" class="chara-svg" role="img" aria-label="${isEmi ? "Emi" : "Manato"}のキャラクター">
    ${background(style.bg, uid)}
    <ellipse cx="100" cy="244" rx="46" ry="6" fill="#000" opacity="0.12"/>
    ${sideBehind ? side : ""}
    ${o.back || ""}${h.back}${NECK}${o.legs}${o.body}${hand}${o.arms}
    ${sideBehind ? "" : side}
    ${faceSVG(who, uid)}${h.front}${head}
  </svg>`;
}
