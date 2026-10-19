// =====================================================
// ゲームのデータ：称号・ステータス・レベルで解放される着せ替え・食事のアドバイス
// 数字や文を変えたいときは、このファイルだけ直せばOK
// =====================================================

const GAME = {
  emi: {
    titles: [[20, "見習いレディ"], [40, "カフェの常連"], [60, "海辺のヒロイン"], [80, "舞踏会の主役"], [100, "夢の国のプリンセス"]],
    stats: ["かがやき", "笑顔", "自信"],
    slots: {
      outfit: { label: "服", items: [
        { id: "coat", name: "ベージュのコート", lv: 20 },
        { id: "onepiece", name: "白いワンピース", lv: 40 },
        { id: "knit", name: "ピンクのニット", lv: 60 },
        { id: "dress", name: "ラベンダーのドレス", lv: 80 },
        { id: "princess", name: "プリンセスドレス", lv: 100 }
      ] },
      hair: { label: "髪型", items: [
        { id: "straight", name: "ストレート", lv: 20 },
        { id: "wavy", name: "ゆる巻き", lv: 35 },
        { id: "pony", name: "ポニーテール", lv: 55 },
        { id: "bun", name: "おだんご", lv: 75 }
      ] },
      item: { label: "髪飾り", items: [
        { id: "none", name: "なし", lv: 20 },
        { id: "ribbon", name: "リボン", lv: 50 },
        { id: "flowers", name: "花かんむり", lv: 80 },
        { id: "tiara", name: "ティアラ", lv: 90 }
      ] },
      bg: { label: "背景", items: [
        { id: "beach", name: "昼の海辺", lv: 20 },
        { id: "cafe", name: "海辺のカフェ", lv: 30 },
        { id: "flowers", name: "花畑", lv: 50 },
        { id: "sunset", name: "夕暮れの海", lv: 70 },
        { id: "castle", name: "夜のお城", lv: 90 },
        { id: "fireworks", name: "夢の国の花火", lv: 100 }
      ] }
    }
  },

  manato: {
    titles: [[20, "見習い漕ぎ手"], [40, "波乗り戦士"], [60, "荒波の騎士"], [80, "海の勇者"], [100, "大海の王"]],
    stats: ["STR", "STA", "SPD"],
    slots: {
      outfit: { label: "装備", items: [
        { id: "jacket", name: "冒険者のジャケット", lv: 20 },
        { id: "paddler", name: "パドラースーツ", lv: 40 },
        { id: "knight", name: "騎士の鎧", lv: 60 },
        { id: "hero", name: "勇者のマント", lv: 80 },
        { id: "king", name: "王の鎧", lv: 100 }
      ] },
      hair: { label: "髪型", items: [
        { id: "natural", name: "ナチュラル", lv: 20 },
        { id: "short", name: "短髪", lv: 45 },
        { id: "twoblock", name: "ツーブロック", lv: 70 },
        { id: "hero", name: "勇者ヘア", lv: 90 }
      ] },
      item: { label: "武器", items: [
        { id: "none", name: "素手", lv: 20 },
        { id: "paddle", name: "木のパドル", lv: 30 },
        { id: "sword", name: "鋼の剣", lv: 60 },
        { id: "carbon", name: "カーボンパドル", lv: 70 },
        { id: "legend", name: "伝説の櫂", lv: 90 }
      ] },
      bg: { label: "ステージ", items: [
        { id: "grass", name: "はじまりの草原", lv: 20 },
        { id: "port", name: "港町", lv: 30 },
        { id: "waves", name: "荒波の海", lv: 50 },
        { id: "volcano", name: "火山", lv: 80 },
        { id: "sky", name: "天空の城", lv: 100 }
      ] }
    }
  }
};


// 食事のアドバイス。曜日ごと（0=日曜 … 6=土曜）
const ADVICE = {
  emi: {
    note: "食事は抜かずに、量と中身で整えましょう。体重は1週間に0.5kgまでのペースが、リバウンドしないコツです。",
    days: [
      { title: "作り置きの日", tips: [
        "鶏むね肉やゆで卵を作り置きすると、平日の朝ごはんやお弁当がラクになります",
        "具だくさんの味噌汁やスープを多めに作っておくと、夜の食べすぎを防げます",
        "お出かけのおやつは、2人で半分こくらいがちょうどいいです"] },
      { title: "朝ごはんをそろえる", tips: [
        "朝はおにぎり＋ゆで卵＋ヨーグルトのように、主食とたんぱく質をそろえましょう",
        "朝しっかり食べると、昼までの間食が自然と減ります",
        "時間がない日はバナナと牛乳だけでも、抜くよりずっといいです"] },
      { title: "コンビニランチ", tips: [
        "おにぎり1個＋サラダチキン＋野菜スープの組み合わせが手軽です",
        "菓子パンだけの日は、ゆで卵やチーズでたんぱく質を1つ足しましょう",
        "サラダから食べると、血糖値の上がり方がゆるやかになります"] },
      { title: "飲み物を見直す", tips: [
        "甘いカフェラテを無糖のラテやお茶に変えるだけで、差が出ます",
        "水やお茶をこまめに。のどの渇きは空腹とまちがえやすいです",
        "夕方のおやつは、ヨーグルトやナッツひとつかみがおすすめです"] },
      { title: "鉄分をとる", tips: [
        "赤身の肉や魚、小松菜、豆腐で鉄分を。疲れにくくなります",
        "鉄分は、果物や野菜のビタミンCと一緒にとると吸収されやすいです",
        "食後すぐのコーヒーや紅茶は、少し時間をあけるのがおすすめです"] },
      { title: "外食・飲み会", tips: [
        "最初に枝豆・サラダ・お刺身などを頼みましょう",
        "お酒の合間に水を1杯ずつ。翌日のむくみが減ります",
        "しめのラーメンより、次の日の朝ごはんをしっかりと"] },
      { title: "休日のリズム", tips: [
        "休みの日も3食のリズムをくずさないのが、リバウンドしないコツです",
        "ブランチにするなら、たんぱく質と野菜をしっかり入れて",
        "よく歩く日は、そのぶん楽しく食べて大丈夫です"] }
    ]
  },

  manato: {
    note: "練習日はしっかり食べてエネルギーを確保。体重は平日で少しずつ落とすと、筋肉を残したまま絞れます。",
    days: [
      { title: "練習日：回復", tips: [
        "練習後30分以内に、たんぱく質＋炭水化物（おにぎり＋プロテイン、牛丼など）",
        "練習日はエネルギーを削らない。減量は平日でつくります",
        "夜は鶏・魚・豆腐などのたんぱく質と野菜で、体の回復を優先"] },
      { title: "調整日", tips: [
        "運動が少ない日は、主食をいつもの2/3くらいに",
        "たんぱく質は毎食、手のひら1枚分を目安に",
        "揚げ物は週2回までにすると、無理なく体重が落ちます"] },
      { title: "昼ごはん", tips: [
        "定食はご飯を普通盛りに。大盛りはやめておきましょう",
        "丼ものや麺だけより、主菜と副菜がある定食を",
        "午後の間食は、プロテインバーやヨーグルトに"] },
      { title: "夜ごはん", tips: [
        "夜はご飯を少なめにして、おかずと汁物でおなかを満たす",
        "寝る3時間前までに食べ終えると、翌朝が軽くなります",
        "晩酌は週2〜3回までに。おつまみはたんぱく質系を"] },
      { title: "筋肉を守る", tips: [
        "平日に軽く漕ぐ・走る日は、その前後だけ炭水化物を足して",
        "たんぱく質は体重1kgあたり1.6gくらいを目安に",
        "野菜・きのこ・海藻でかさ増しすると、満足感が続きます"] },
      { title: "週末に備える", tips: [
        "金曜の夜から炭水化物を少しずつ戻して、土曜の練習に備えましょう",
        "飲み会は控えめに。翌日の長い練習に響きます",
        "水分をいつもより多めにとっておきましょう"] },
      { title: "練習日：長時間", tips: [
        "漕ぐ2〜3時間前に、おにぎり・パン・バナナなどの炭水化物をしっかり",
        "1時間以上漕ぐときは、1時間に30〜60gの糖質（ジェル・バナナ・スポーツドリンク）を補給",
        "汗で塩分も出ます。水だけでなく、スポーツドリンクや塩タブレットも"] }
    ]
  }
};


// ===== レベルの計算 =====
// スタートの体重を Lv.20、目標体重を Lv.100 として、7日平均の体重からレベルを出す
function rawLevel(person, avgKg) {
  const progress = (person.start - avgKg) / (person.start - person.goal);
  return 20 + 80 * progress;
}

function levelOf(person, avgKg) {
  return Math.min(Math.max(Math.floor(rawLevel(person, avgKg)), 1), 100);
}

// 今のレベルの中で、どれくらい次に近づいたか（0〜1）
function expOf(person, avgKg) {
  const lv = levelOf(person, avgKg);
  if (lv >= 100) return 1;
  return Math.min(Math.max(rawLevel(person, avgKg) - lv, 0), 1);
}

// ステータスの数字（見た目の楽しさ用）
function statsOf(lv) {
  return [lv * 10, lv * 7 + 30, lv * 5 + 50];
}

// 次のレベルまであと何kgか
function kgToNextLevel(person, avgKg, lv) {
  if (lv >= 100) return 0;
  const perLevel = (person.start - person.goal) / 80;
  const nextKg = person.start - (lv + 1 - 20) * perLevel;
  return Math.max(avgKg - nextKg, 0);
}

// 今のレベルの称号
function titleOf(key, lv) {
  let title = GAME[key].titles[0][1];
  GAME[key].titles.forEach(([need, name]) => { if (lv >= need) title = name; });
  return title;
}

// まだ解放されていない中で、いちばん近いもの
function nextUnlock(key, lv) {
  let next = null;
  for (const slot in GAME[key].slots) {
    GAME[key].slots[slot].items.forEach(item => {
      if (item.lv > lv && (!next || item.lv < next.lv)) next = item;
    });
  }
  return next;
}

// 選んだものがまだ解放されていなければ、解放ずみの中で最後のものにする
function safeStyle(key, style, lv) {
  const result = {};
  for (const slot in GAME[key].slots) {
    const items = GAME[key].slots[slot].items.filter(i => i.lv <= lv);
    const chosen = items.find(i => i.id === (style || {})[slot]);
    result[slot] = (chosen || items[items.length - 1] || GAME[key].slots[slot].items[0]).id;
  }
  return result;
}
