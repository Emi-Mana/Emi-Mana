// =====================================================
// キャラクターの絵（2Dイラスト風）
// drawCharacter("emi", { outfit, hair, item, bg }, "uid") で SVG の文字列を返す
// 絵は 200 x 250 の中に描く。重ねる順番：背景 → 後ろ髪・マント → 体 → 手 → 顔 → 前髪 → 頭の小物
// =====================================================

const SKIN = "#F7D9C4";
const HAND = `<circle cx="60" cy="192" r="7" fill="${SKIN}"/><circle cx="140" cy="192" r="7" fill="${SKIN}"/>`;
const NECK = `<rect x="92" y="122" width="16" height="16" fill="${SKIN}"/>`;

// 足と靴
function legs(color, shoe) {
  return `<rect x="82" y="196" width="14" height="32" rx="5" fill="${color}"/>
    <rect x="104" y="196" width="14" height="32" rx="5" fill="${color}"/>
    <ellipse cx="88" cy="230" rx="10" ry="5" fill="${shoe}"/>
    <ellipse cx="112" cy="230" rx="10" ry="5" fill="${shoe}"/>`;
}

// 腕。short = 半袖（肌の腕に短い袖）
function arms(color, short) {
  const left = "M66 140 Q54 166 60 190";
  const right = "M134 140 Q146 166 140 190";
  const style = 'fill="none" stroke-width="14" stroke-linecap="round"';
  if (!short) {
    return `<path d="${left}" stroke="${color}" ${style}/><path d="${right}" stroke="${color}" ${style}/>` + HAND;
  }
  return `<path d="${left}" stroke="${SKIN}" ${style}/><path d="${right}" stroke="${SKIN}" ${style}/>
    <path d="M66 140 Q61 150 60 156" stroke="${color}" ${style} stroke-width="17"/>
    <path d="M134 140 Q139 150 140 156" stroke="${color}" ${style} stroke-width="17"/>` + HAND;
}

// 顔（頭・耳・目・ほっぺ・口）
const FACE = `
  <circle cx="55" cy="96" r="7" fill="${SKIN}"/><circle cx="145" cy="96" r="7" fill="${SKIN}"/>
  <ellipse cx="100" cy="88" rx="46" ry="44" fill="${SKIN}"/>
  <ellipse cx="84" cy="96" rx="5" ry="6.5" fill="#3A2A22"/><circle cx="86" cy="93.5" r="1.8" fill="#fff"/>
  <ellipse cx="116" cy="96" rx="5" ry="6.5" fill="#3A2A22"/><circle cx="118" cy="93.5" r="1.8" fill="#fff"/>
  <ellipse cx="74" cy="107" rx="6" ry="3.5" fill="#F2A79C" opacity="0.6"/>
  <ellipse cx="126" cy="107" rx="6" ry="3.5" fill="#F2A79C" opacity="0.6"/>
  <path d="M94 111 Q100 117 106 111" fill="none" stroke="#7A4A3A" stroke-width="2" stroke-linecap="round"/>`;


// ===== Emi の髪型 =====
const EMI_HAIR_COLOR = "#3B2A24";
const EMI_BANGS = `<path d="M54 86 Q54 38 100 36 Q146 38 146 86 Q140 70 132 70 Q126 60 116 66 Q108 56 100 64 Q92 56 84 66 Q74 60 68 70 Q60 70 54 86 Z" fill="${EMI_HAIR_COLOR}"/>`;

const EMI_HAIR = {
  straight: {
    back: `<path d="M52 88 Q50 30 100 30 Q150 30 148 88 L150 168 Q126 174 114 158 L86 158 Q74 174 50 168 Z" fill="${EMI_HAIR_COLOR}"/>`,
    front: EMI_BANGS
  },
  wavy: {
    back: `<path d="M52 88 Q50 30 100 30 Q150 30 148 88 Q156 108 146 126 Q158 144 148 162 Q138 174 124 164 L76 164 Q62 174 52 162 Q42 144 54 126 Q44 108 52 88 Z" fill="#5A3A2C"/>`,
    front: EMI_BANGS.replace(EMI_HAIR_COLOR, "#5A3A2C")
  },
  pony: {
    back: `<path d="M138 50 Q178 70 168 132 Q162 152 150 142 Q160 100 134 64 Z" fill="${EMI_HAIR_COLOR}"/>
      <path d="M54 90 Q52 32 100 30 Q148 32 146 90 Z" fill="${EMI_HAIR_COLOR}"/>`,
    front: EMI_BANGS + `<circle cx="140" cy="54" r="6" fill="#E58FA5"/>`
  },
  bun: {
    back: `<circle cx="100" cy="26" r="17" fill="${EMI_HAIR_COLOR}"/>
      <path d="M54 90 Q52 32 100 30 Q148 32 146 90 Z" fill="${EMI_HAIR_COLOR}"/>`,
    front: EMI_BANGS
  }
};

// ===== Emi の服 =====
const EMI_OUTFIT = {
  // アイコンのベージュのコート＋ネイビーのバッグ
  coat: {
    legs: legs("#3A3540", "#2E2A30"),
    body: `<path d="M64 134 Q100 124 136 134 L144 212 L56 212 Z" fill="#E9DDCB"/>
      <path d="M90 132 L100 148 L110 132 Z" fill="#8C4A4A"/>
      <circle cx="100" cy="162" r="3" fill="#8A7660"/><circle cx="100" cy="182" r="3" fill="#8A7660"/>
      <path d="M128 136 L70 186" stroke="#2C3550" stroke-width="4"/>`,
    arms: arms("#E9DDCB"),
    front: `<rect x="48" y="184" width="26" height="20" rx="5" fill="#2C3550"/>`
  },
  onepiece: {
    legs: legs(SKIN, "#D9B48A"),
    body: `<path d="M68 134 Q100 126 132 134 L136 166 L150 212 Q100 222 50 212 L64 166 Z" fill="#FBF8F2"/>
      <rect x="64" y="162" width="72" height="6" fill="#D8B88A"/>`,
    arms: arms("#FBF8F2", true),
    front: ""
  },
  knit: {
    legs: legs("#E9E1D6", "#B07A5A"),
    body: `<path d="M64 170 L136 170 L146 210 L54 210 Z" fill="#E9DCC9"/>
      <path d="M80 172 L74 208 M100 172 L100 208 M120 172 L126 208" stroke="#D3C3AC" stroke-width="2"/>
      <path d="M66 134 Q100 126 134 134 L137 174 L63 174 Z" fill="#F2B8C6"/>`,
    arms: arms("#F2B8C6"),
    front: ""
  },
  dress: {
    legs: legs(SKIN, "#7B68B0"),
    body: `<path d="M70 134 Q100 128 130 134 L134 164 L152 216 Q100 228 48 216 L66 164 Z" fill="#A795D4"/>
      <path d="M66 160 L134 160 L132 168 L68 168 Z" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="80" cy="196" r="2" fill="#fff"/><circle cx="118" cy="188" r="2" fill="#fff"/><circle cx="100" cy="206" r="2" fill="#fff"/>`,
    arms: arms("#A795D4", true),
    front: ""
  },
  princess: {
    legs: legs(SKIN, "#E8C35A"),
    body: `<path d="M62 166 L138 166 L166 226 Q100 238 34 226 Z" fill="#F3D9A4"/>
      <path d="M48 214 Q100 226 152 214 L160 226 Q100 238 40 226 Z" fill="#FFFFFF" opacity="0.7"/>
      <path d="M70 134 Q100 126 130 134 L134 170 L66 170 Z" fill="#F7E3B8"/>
      <circle cx="100" cy="150" r="5" fill="#E58FA5"/>`,
    arms: `<circle cx="64" cy="142" r="12" fill="#F7E3B8"/><circle cx="136" cy="142" r="12" fill="#F7E3B8"/>` + arms("#F7E3B8", true),
    front: ""
  }
};

// ===== Emi の頭の小物 =====
const EMI_ITEM = {
  none: "",
  ribbon: `<path d="M118 44 L132 36 L130 52 Z M146 44 L132 36 L134 52 Z" fill="#E58FA5"/><circle cx="132" cy="44" r="4" fill="#D46F8A"/>`,
  flowers: [62, 76, 92, 108, 124, 138].map((x, i) =>
    `<circle cx="${x}" cy="${46 - (i === 2 || i === 3 ? 8 : i === 1 || i === 4 ? 4 : 0)}" r="6" fill="${i % 2 ? "#F7C6D0" : "#FFF3B0"}"/>`).join(""),
  tiara: `<path d="M78 42 L84 28 L92 38 L100 20 L108 38 L116 28 L122 42 Z" fill="#E8C35A"/>
    <circle cx="100" cy="30" r="3.5" fill="#7FB0E0"/>`
};


// ===== Manato の髪型 =====
const MANATO_HAIR = {
  natural: {
    back: `<path d="M52 92 Q48 34 100 30 Q152 34 148 92 Z" fill="#1F1D22"/>`,
    front: `<path d="M50 90 Q44 40 98 30 Q156 30 152 90 Q146 72 138 70 L134 80 Q124 62 108 66 L104 54 Q94 68 80 64 L76 78 Q64 72 50 90 Z" fill="#1F1D22"/>`
  },
  short: {
    back: `<path d="M54 88 Q52 36 100 34 Q148 36 146 88 Z" fill="#1F1D22"/>`,
    front: `<path d="M54 80 Q54 38 100 36 Q146 38 146 80 Q132 64 100 62 Q68 64 54 80 Z" fill="#1F1D22"/>`
  },
  twoblock: {
    back: `<path d="M54 92 Q52 40 100 36 Q148 40 146 92 Z" fill="#5A5560"/>`,
    front: `<path d="M56 76 Q60 28 104 28 Q150 30 146 76 Q128 54 96 58 Q74 60 56 76 Z" fill="#1F1D22"/>`
  },
  hero: {
    back: `<path d="M52 92 Q48 34 100 30 Q152 34 148 92 Z" fill="#D9A73E"/>`,
    front: `<path d="M48 92 L40 60 L60 66 L56 36 L78 50 L84 22 L100 44 L116 20 L122 50 L144 36 L140 66 L160 60 L152 92 Q140 70 100 66 Q60 70 48 92 Z" fill="#E8B84A"/>`
  }
};

// ===== Manato の装備 =====
const MANATO_OUTFIT = {
  // アイコンのモスグリーンのジャケット＋茶色の襟
  jacket: {
    back: "",
    legs: legs("#3A3A3E", "#2A2420"),
    body: `<path d="M62 134 Q100 124 138 134 L142 204 L58 204 Z" fill="#4A5340"/>
      <path d="M94 136 L106 136 L106 204 L94 204 Z" fill="#7D6A55"/>
      <path d="M78 130 L92 152 L100 138 L108 152 L122 130 Q100 124 78 130 Z" fill="#6A4A34"/>
      <rect x="68" y="176" width="20" height="12" rx="2" fill="#3F4736"/><rect x="112" y="176" width="20" height="12" rx="2" fill="#3F4736"/>`,
    arms: arms("#4A5340")
  },
  paddler: {
    back: "",
    legs: legs(SKIN, "#2A2E36") + `<rect x="78" y="194" width="44" height="14" fill="#2A2E36"/>`,
    body: `<path d="M64 134 Q100 126 136 134 L138 200 L62 200 Z" fill="#2F6F8F"/>
      <path d="M70 140 L130 140 L132 186 L68 186 Z" fill="#E2713A"/>
      <path d="M70 158 L130 158 M70 172 L130 172" stroke="#1F2A33" stroke-width="3"/>`,
    arms: arms("#2F6F8F")
  },
  knight: {
    back: "",
    legs: legs("#8A939E", "#4A4F57"),
    body: `<path d="M62 134 Q100 126 138 134 L140 204 L60 204 Z" fill="#B9C2CC"/>
      <path d="M100 136 L100 200" stroke="#8A939E" stroke-width="3"/>
      <rect x="60" y="188" width="80" height="8" fill="#6A4A34"/><rect x="94" y="186" width="12" height="12" fill="#D9B24C"/>`,
    arms: arms("#9AA4B0") + `<circle cx="64" cy="140" r="13" fill="#CBD3DC"/><circle cx="136" cy="140" r="13" fill="#CBD3DC"/>`
  },
  hero: {
    back: `<path d="M62 136 L138 136 L156 226 L44 226 Z" fill="#B3312E"/>`,
    legs: legs("#3A3A4A", "#5A3E2A"),
    body: `<path d="M64 134 Q100 126 136 134 L138 204 L62 204 Z" fill="#2E4E8F"/>
      <path d="M64 134 Q100 126 136 134 L136 142 Q100 134 64 142 Z" fill="#D9B24C"/>
      <rect x="62" y="186" width="76" height="7" fill="#D9B24C"/>`,
    arms: arms("#2E4E8F")
  },
  king: {
    back: `<path d="M60 136 L140 136 L160 228 L40 228 Z" fill="#5B2C83"/><path d="M40 222 L160 222 L160 228 L40 228 Z" fill="#F5F0E6"/>`,
    legs: legs("#B8932E", "#7A5A1E"),
    body: `<path d="M62 134 Q100 124 138 134 L140 204 L60 204 Z" fill="#D9B24C"/>
      <path d="M80 146 L120 146 L114 176 L86 176 Z" fill="#E8C86A"/>
      <circle cx="100" cy="160" r="6" fill="#B3312E"/>`,
    arms: arms("#C9A23E") + `<circle cx="64" cy="140" r="13" fill="#E8C86A"/><circle cx="136" cy="140" r="13" fill="#E8C86A"/>`
  }
};

// ===== Manato の武器（右手に持つ） =====
const MANATO_ITEM = {
  none: "",
  paddle: `<path d="M150 112 L134 222" stroke="#A7783F" stroke-width="5" stroke-linecap="round"/>
    <rect x="142" y="106" width="18" height="6" rx="3" fill="#A7783F"/>
    <path d="M126 210 L142 212 L138 244 Q130 248 122 242 Z" fill="#C8955A"/>`,
  sword: `<g transform="rotate(18 140 192)">
    <path d="M137 186 L137 112 L140 104 L143 112 L143 186 Z" fill="#DDE3EA"/>
    <rect x="128" y="184" width="24" height="5" rx="2" fill="#8A6A3A"/>
    <rect x="137" y="189" width="6" height="16" fill="#5A3E2A"/></g>`,
  carbon: `<path d="M150 112 L134 222" stroke="#222326" stroke-width="5" stroke-linecap="round"/>
    <rect x="142" y="106" width="18" height="6" rx="3" fill="#222326"/>
    <path d="M126 210 L142 212 L138 244 Q130 248 122 242 Z" fill="#33363C"/>
    <path d="M131 216 L132 240" stroke="#4FB3C7" stroke-width="2"/>`,
  legend: `<ellipse cx="132" cy="228" rx="18" ry="24" fill="#FFE9A0" opacity="0.5"/>
    <path d="M150 112 L134 222" stroke="#E8B84A" stroke-width="5" stroke-linecap="round"/>
    <rect x="142" y="106" width="18" height="6" rx="3" fill="#E8B84A"/>
    <path d="M126 210 L142 212 L138 244 Q130 248 122 242 Z" fill="#F6D27A"/>
    <circle cx="146" cy="104" r="3" fill="#fff"/>`
};

// 王の鎧のときは王冠をのせる
const CROWN = `<path d="M74 44 L78 22 L90 34 L100 16 L110 34 L122 22 L126 44 Z" fill="#E8B84A"/>
  <circle cx="100" cy="30" r="3.5" fill="#B3312E"/>`;


// ===== 背景 =====
// uid はページ内で同じ id がぶつからないようにするための印
function background(id, uid) {
  const sky = (top, low) => `<defs><linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${low}"/></linearGradient></defs>
    <rect width="200" height="250" fill="url(#g${uid})"/>`;
  const stars = [[20, 20], [60, 40], [150, 18], [180, 50], [110, 12], [30, 70]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFF6D8"/>`).join("");

  const scenes = {
    beach:  sky("#BFE0F0", "#F4EBDD") + `<rect y="150" width="200" height="40" fill="#6FA8C0"/><rect y="186" width="200" height="64" fill="#EADCC2"/>`,
    cafe:   `<rect width="200" height="250" fill="#EAD9C4"/><rect x="24" y="30" width="70" height="80" rx="4" fill="#BFE0F0"/>
            <rect x="106" y="30" width="70" height="80" rx="4" fill="#BFE0F0"/><rect y="200" width="200" height="50" fill="#B88A5E"/>
            <circle cx="170" cy="176" r="18" fill="#7FA36A"/><rect x="164" y="186" width="12" height="16" fill="#9C6B45"/>`,
    flowers: sky("#DCEFF5", "#F6F1E4") + `<path d="M0 180 Q100 150 200 180 L200 250 L0 250 Z" fill="#A9D18E"/>` +
            [[20, 200], [50, 215], [160, 205], [185, 225], [35, 238], [170, 240]]
              .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${i % 2 ? "#F7C6D0" : "#FFF3B0"}"/>`).join(""),
    sunset: sky("#F2A27E", "#F9DEC0") + `<circle cx="150" cy="140" r="22" fill="#FBEBD8"/><rect y="150" width="200" height="100" fill="#5A6E8C"/>`,
    castle: sky("#141B48", "#4A3A7A") + stars + `<rect y="190" width="200" height="60" fill="#1E2550"/>
            <g fill="#2A2560"><rect x="20" y="150" width="50" height="40"/><polygon points="18,152 30,120 42,152"/><polygon points="48,152 60,120 72,152"/>
            <rect x="140" y="150" width="44" height="40"/><polygon points="138,152 162,112 186,152"/></g>`,
    fireworks: sky("#0E1340", "#3A2470") + stars + `<rect y="200" width="200" height="50" fill="#1A1240"/>` +
            [[40, 50, "#F2C95C"], [160, 40, "#F07D98"], [100, 30, "#7FD0E0"]].map(([x, y, c]) =>
              `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="2 5"/><circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="2 4"/>`).join(""),

    grass:  sky("#A9D4EE", "#E6F2F6") + `<rect y="170" width="200" height="80" fill="#8DBF6A"/><path d="M80 250 Q100 200 120 170 L128 170 Q110 210 110 250 Z" fill="#D8C79A"/>
            <circle cx="30" cy="160" r="16" fill="#5E8F4A"/><circle cx="176" cy="156" r="20" fill="#5E8F4A"/>`,
    port:   sky("#A9D4EE", "#F2EDE2") + `<rect y="150" width="200" height="100" fill="#4F8496"/><rect y="200" width="200" height="50" fill="#8A6A4A"/>
            <path d="M140 140 L180 140 L172 152 L148 152 Z" fill="#F5F0E6"/><path d="M160 140 L160 104 L178 136 Z" fill="#F5F0E6"/>`,
    waves:  sky("#5F7385", "#9DB0BE") + `<rect y="160" width="200" height="90" fill="#2F4E66"/>
            <path d="M0 170 Q30 140 60 170 Q90 140 120 170 Q150 140 180 170 L200 170 L200 190 L0 190 Z" fill="#E8F0F4" opacity="0.7"/>`,
    volcano: sky("#5A1E1E", "#E2713A") + `<polygon points="40,200 100,90 160,200" fill="#2A1A1A"/><path d="M92 104 L100 90 L108 104 L104 150 L96 150 Z" fill="#F2A23C"/>
            <rect y="196" width="200" height="54" fill="#3A2222"/>`,
    sky:    sky("#B9C4F0", "#F6E8F0") + `<ellipse cx="40" cy="200" rx="40" ry="12" fill="#fff"/><ellipse cx="170" cy="215" rx="40" ry="12" fill="#fff"/>
            <ellipse cx="150" cy="80" rx="34" ry="10" fill="#fff"/><g fill="#8A7FB8"><rect x="134" y="54" width="32" height="24"/><polygon points="132,56 150,30 168,56"/></g>`
  };
  return scenes[id] || scenes.beach;
}


// ===== キャラ全体を組み立てる =====
function drawCharacter(who, style, uid) {
  let back, legsPart, body, armsPart, front, item, hairBack, hairFront, head = "";

  if (who === "emi") {
    const o = EMI_OUTFIT[style.outfit] || EMI_OUTFIT.coat;
    const h = EMI_HAIR[style.hair] || EMI_HAIR.straight;
    back = ""; legsPart = o.legs; body = o.body; armsPart = o.arms; front = o.front;
    item = ""; hairBack = h.back; hairFront = h.front;
    head = EMI_ITEM[style.item] || "";
  } else {
    const o = MANATO_OUTFIT[style.outfit] || MANATO_OUTFIT.jacket;
    const h = MANATO_HAIR[style.hair] || MANATO_HAIR.natural;
    back = o.back; legsPart = o.legs; body = o.body; armsPart = o.arms; front = "";
    item = MANATO_ITEM[style.item] || ""; hairBack = h.back; hairFront = h.front;
    head = style.outfit === "king" ? CROWN : "";
  }

  return `<svg viewBox="0 0 200 250" class="chara-svg" role="img" aria-label="${who === "emi" ? "Emi" : "Manato"}のキャラクター">
    ${background(style.bg, uid)}
    <ellipse cx="100" cy="234" rx="44" ry="6" fill="#000" opacity="0.12"/>
    ${back}${hairBack}${NECK}${legsPart}${body}${item}${armsPart}${front}${FACE}${hairFront}${head}
  </svg>`;
}
