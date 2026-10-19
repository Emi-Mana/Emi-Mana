// =====================================================
// ゲームのデータ：物語・アイテム・レベル
// 文やアイテムを変えたいときは、このファイルだけ直せばOK
//
// しくみ
// ・スタートの体重が Lv.20、目標体重が Lv.100
// ・Lv.25 から 5 レベルごとにアイテムが届く（全16回）
// ・届いた3つから1つを選ぶ。選ばなかった2つは、もう選べない
// ・受け取ったアイテム同士なら、あとから着替えられる
// ・Lv.80〜90 は2人共通の章。同じ番号を選ぶと「おそろい」
// =====================================================

// 着せ替えの場所の名前
const SLOT_LABEL = {
  emi: { outfit: "服", hair: "髪型", head: "髪飾り・帽子", side: "持ち物", bg: "背景" },
  manato: { outfit: "装備", hair: "髪型", head: "頭", hand: "手に持つもの", side: "相棒", bg: "ステージ" }
};

// 最初から持っているもの
const DEFAULTS = {
  emi: {
    outfit: { id: "coat", name: "ベージュのコート" }, hair: { id: "long", name: "ロングヘア" },
    head: { id: "none", name: "なし" }, side: { id: "bag", name: "ネイビーのバッグ" }, bg: { id: "town", name: "季節の街" }
  },
  manato: {
    outfit: { id: "jacket", name: "モスグリーンのジャケット" }, hair: { id: "messy", name: "無造作ヘア" },
    head: { id: "none", name: "なし" }, hand: { id: "none", name: "なし" }, side: { id: "none", name: "なし" }, bg: { id: "town", name: "季節の街" }
  }
};

// 3つの方向性（選んだ数がステータスになる）
const DIRECTIONS = {
  emi: ["おしゃべり", "自然体", "仲間"],
  manato: ["腕力", "持久力", "統率力"]
};

// 章（称号にもなる）
const CHAPTERS = {
  emi: [
    [20, "序章", "見習い看板娘"], [25, "第1章 春", "春の看板娘"], [40, "第2章 夏", "夏祭りの人気者"],
    [55, "第3章 秋", "収穫祭の主役"], [70, "第4章 冬", "雪の街の灯り"], [80, "第5章 ふたりの船出", "船出のパートナー"],
    [100, "終章", "舞踏会のプリンセス"]
  ],
  manato: [
    [20, "序章", "港の見習い"], [25, "第1章 春", "見習い漕ぎ手"], [40, "第2章 夏", "外洋の航海士"],
    [55, "第3章 秋", "嵐を越える者"], [70, "第4章 冬", "船長候補"], [80, "第5章 ふたりの船出", "ふたりの船の船長"],
    [100, "終章", "大海の王"]
  ]
};

// レベルごとの物語と、届く3つのアイテム（順番は DIRECTIONS と同じ）
const STORY = {
  emi: [
    { lv: 25, slot: "outfit", title: "看板娘デビュー", text: "街角のパン屋さんで、看板娘として働くことになった。最初の仕事着を選ぼう。", items: [
      { id: "apron", name: "花柄のエプロン", desc: "「かわいいね」とお客さんとの会話がはずむ" },
      { id: "linen", name: "リネンのワンピース", desc: "朝の光になじむ、着心地のいい一枚" },
      { id: "denim", name: "おそろいのデニムエプロン", desc: "お店のみんなとおそろいの仕事着" }] },
    { lv: 30, slot: "head", title: "春祭りの準備", text: "街に春祭りの飾りが増えてきた。髪に何をつける？", items: [
      { id: "ribbon", name: "ピンクのリボン", desc: "遠くからでも見つけてもらえる目印" },
      { id: "straw", name: "麦わら帽子", desc: "日なたの散歩にぴったり" },
      { id: "flowerpin", name: "手作りの花ピン", desc: "友だちが作ってくれた春の花" }] },
    { lv: 35, slot: "side", title: "いつも一緒", text: "お店に、いつも一緒のものができた。", items: [
      { id: "chalkboard", name: "手書きの黒板看板", desc: "今日のおすすめを書いて、お客さんを呼びこむ" },
      { id: "bread", name: "焼きたてパンのかご", desc: "香りで街の人が集まってくる" },
      { id: "kitten", name: "なついた子猫", desc: "お店の前に毎朝やってくる小さな仲間" }] },
    { lv: 40, slot: "hair", title: "夏の訪れ", text: "夏が来た。暑い日にぴったりの髪型は？", items: [
      { id: "pony", name: "ポニーテール", desc: "元気に揺れて、話しかけられやすい" },
      { id: "bun", name: "ゆるいおだんご", desc: "首もとが涼しい、肩の力が抜けた髪型" },
      { id: "braid", name: "友だちと編んだ三つ編み", desc: "おしゃべりしながら編んでもらった" }] },
    { lv: 45, slot: "outfit", title: "夏祭りの夜", text: "街の夏祭り。何を着ていく？", items: [
      { id: "yukata", name: "朝顔の浴衣", desc: "屋台のおじさんにも声をかけられる" },
      { id: "summer", name: "白いサマードレス", desc: "夜風が気持ちいい、軽やかな一枚" },
      { id: "happi", name: "お祭りのはっぴ", desc: "みんなと一緒にお神輿をかつぐ" }] },
    { lv: 50, slot: "bg", title: "夏の思い出", text: "この夏いちばんの思い出の場所は？", items: [
      { id: "matsuri", name: "屋台の並ぶ通り", desc: "ちょうちんの下で話がつきない" },
      { id: "sunflower", name: "ひまわり畑", desc: "街はずれの、ひとりじめの場所" },
      { id: "hanabi", name: "河原の花火", desc: "みんなで並んで見上げた夜空" }] },
    { lv: 55, slot: "side", title: "収穫祭の役目", text: "秋の収穫祭。頼まれた役目は？", items: [
      { id: "mic", name: "司会のマイク", desc: "収穫祭のステージで街をもりあげる" },
      { id: "apples", name: "りんごのかご", desc: "果樹園でもいだ、真っ赤なりんご" },
      { id: "bird", name: "肩にとまる小鳥", desc: "いつのまにか仲良くなった秋の友だち" }] },
    { lv: 60, slot: "head", title: "秋のおしゃれ", text: "木の葉が色づいてきた。秋のおしゃれを一つ。", items: [
      { id: "beret", name: "赤いベレー帽", desc: "「似合うね」と話題になる" },
      { id: "acorn", name: "どんぐりの髪飾り", desc: "森の散歩で拾った秋のかけら" },
      { id: "crown", name: "みんなで編んだ花かんむり", desc: "収穫祭の仲間からの贈りもの" }] },
    { lv: 65, slot: "outfit", title: "収穫祭のダンス", text: "収穫祭のダンスに着ていく服は？", items: [
      { id: "bordeaux", name: "ボルドーのワンピース", desc: "ダンスの誘いが止まらない" },
      { id: "cardigan", name: "ニットのカーディガン", desc: "ふわっとあたたかい、いつもの自分" },
      { id: "check", name: "チェックのジャンパースカート", desc: "友だちと色ちがいでそろえた" }] },
    { lv: 70, slot: "bg", title: "雪の街の灯り", text: "街に雪が降った。冬の夜をどこで過ごす？", items: [
      { id: "illumination", name: "イルミネーションの広場", desc: "人が集まる、街いちばんの灯り" },
      { id: "snowforest", name: "雪の森", desc: "音のない白い世界をひとり歩く" },
      { id: "fireplace", name: "暖炉のあるカフェ", desc: "常連さんたちと囲む、あたたかい場所" }] },
    { lv: 75, slot: "hair", title: "冬の決意", text: "春になったら、港へ行こうと決めた。髪型を変えてみよう。", items: [
      { id: "wavy", name: "ゆる巻きロング", desc: "大人っぽくて、会話が弾む" },
      { id: "bob", name: "ショートボブ", desc: "身軽になって、どこへでも行ける" },
      { id: "halfup", name: "編みこみハーフアップ", desc: "友だちが旅立ちの日のために編んでくれた" }] },
    { lv: 80, slot: "outfit", title: "港での再会", text: "港で、航海士のあの人と出会った。船旅の服を選ぼう。（2人が同じ番号を選ぶとおそろい）", items: [
      { id: "marine", name: "マリンワンピース", desc: "船の上でもいちばん目立つ" },
      { id: "sailor", name: "セーラーブラウス", desc: "潮風になじむ、動きやすい服" },
      { id: "travel", name: "旅のコート", desc: "遠い大陸まで一緒に行く覚悟の一着" }] },
    { lv: 85, slot: "head", title: "甲板の上で", text: "船が港を出た。甲板でかぶる帽子は？（同じ番号でおそろい）", items: [
      { id: "captain", name: "キャプテン帽", desc: "船員さんたちに「船長！」と呼ばれる" },
      { id: "mberet", name: "マリンベレー", desc: "風に飛ばされにくい、旅の相棒" },
      { id: "boater", name: "リボンのカンカン帽", desc: "2人で選んだ、おそろいのリボン" }] },
    { lv: 90, slot: "bg", title: "ふたりの航路", text: "ふたりの船が進む景色を選ぼう。（同じ番号でおそろい）", items: [
      { id: "dawnport", name: "夜明けの港", desc: "見送りに来てくれた街の人たち" },
      { id: "ocean", name: "大海原", desc: "どこまでも続く青い海" },
      { id: "deck", name: "船の甲板", desc: "仲間と過ごす、にぎやかな船の上" }] },
    { lv: 95, slot: "side", title: "旅のお守り", text: "新しい大陸が見えてきた。お守りに持っていくのは？", items: [
      { id: "invitation", name: "舞踏会の招待状", desc: "夢の国から届いた、金色の封筒" },
      { id: "compass", name: "金の羅針盤", desc: "迷っても、ふたりの行き先を指してくれる" },
      { id: "seagull", name: "旅の友のカモメ", desc: "港からずっとついてきた仲間" }] },
    { lv: 100, slot: "outfit", title: "夢の舞踏会", text: "夢の国の舞踏会に、ふたりで招かれた。最後のドレスを選ぼう。（背景「舞踏会」も届きます）", items: [
      { id: "rose", name: "ローズのドレス", desc: "会場中の視線を集める一着" },
      { id: "starry", name: "星空のドレス", desc: "夜空のように落ち着いた、わたしらしいドレス" },
      { id: "floral", name: "花のドレス", desc: "街のみんなの花で飾った、思い出のドレス" }] }
  ],

  manato: [
    { lv: 25, slot: "hand", title: "港の見習い", text: "港の船で、見習いとして働きはじめた。最初の相棒になる道具は？", items: [
      { id: "paddle", name: "木のパドル", desc: "まずは漕ぐ力をきたえる" },
      { id: "bottle", name: "航海用の水筒", desc: "長い時間、漕ぎつづけるために" },
      { id: "logbook", name: "航海日誌", desc: "船のことを学び、仲間に伝える" }] },
    { lv: 30, slot: "outfit", title: "見習いの仕事着", text: "船長から仕事着が支給された。どれを選ぶ？", items: [
      { id: "workshirt", name: "袖まくりのワークシャツ", desc: "力仕事にはこれがいちばん" },
      { id: "raincoat", name: "防水ジャケット", desc: "雨でも波でも、一日中働ける" },
      { id: "cadet", name: "見習い船員の制服", desc: "きちんとした身なりで信頼を得る" }] },
    { lv: 35, slot: "head", title: "日差しの港", text: "春の日差しが強くなってきた。頭に何をつける？", items: [
      { id: "hachimaki", name: "ねじりはちまき", desc: "気合いを入れて、重い荷を運ぶ" },
      { id: "cap", name: "日よけキャップ", desc: "長い航海でも体力を守る" },
      { id: "sailorcap", name: "見習いの船員帽", desc: "船の一員として認められた証" }] },
    { lv: 40, slot: "side", title: "外洋の仲間", text: "はじめての外洋で、仲間ができた。", items: [
      { id: "crab", name: "はさみ自慢のカニ", desc: "力くらべで仲良くなった" },
      { id: "turtle", name: "長旅のウミガメ", desc: "何日も一緒に泳いでくれる" },
      { id: "parrot", name: "号令をまねるオウム", desc: "船員たちに号令を伝えてくれる" }] },
    { lv: 45, slot: "outfit", title: "夏の外洋", text: "外洋の日差しは強い。夏の装備を選ぼう。", items: [
      { id: "tank", name: "タンクトップ", desc: "鍛えた腕で、波をねじふせる" },
      { id: "rashguard", name: "ラッシュガード", desc: "日差しから体を守り、長く漕げる" },
      { id: "marinejacket", name: "マリンジャケット", desc: "外洋の船乗りたちに一目置かれる" }] },
    { lv: 50, slot: "bg", title: "はじめての航海", text: "はじめての航海の舞台は？", items: [
      { id: "roughsea", name: "荒波の海", desc: "力で波を越える" },
      { id: "summersea", name: "夏の外洋", desc: "どこまでも漕いでいける青い海" },
      { id: "busyport", name: "にぎやかな港", desc: "船乗りたちが集まる、航海の始まりの場所" }] },
    { lv: 55, slot: "hand", title: "嵐の予感", text: "秋、嵐の季節が来た。備える道具は？", items: [
      { id: "carbon", name: "カーボンパドル", desc: "強く、速く、水をつかむ" },
      { id: "longpaddle", name: "長距離用パドル", desc: "軽くて、何時間でも漕げる" },
      { id: "telescope", name: "望遠鏡", desc: "嵐を先に見つけ、船を導く" }] },
    { lv: 60, slot: "hair", title: "嵐のあと", text: "嵐で髪が乱れた。どうする？", items: [
      { id: "short", name: "短髪", desc: "潮風に負けない、すっきりした頭" },
      { id: "wolf", name: "ウルフヘア", desc: "長い航海のあいだに伸びた髪" },
      { id: "slick", name: "オールバック", desc: "船員たちの前に立つ顔つき" }] },
    { lv: 65, slot: "outfit", title: "嵐を越える", text: "大きな嵐が来る。嵐を越える装備は？", items: [
      { id: "vest", name: "革のベスト", desc: "腕を自由に動かして、全力で漕ぐ" },
      { id: "oilcoat", name: "オイルコート", desc: "雨も波も通さず、一晩中漕ぎつづける" },
      { id: "navcoat", name: "航海士のコート", desc: "船員を率いて、嵐の中を進む" }] },
    { lv: 70, slot: "bg", title: "冬の航海", text: "冬の海へ。どこを進む？", items: [
      { id: "stormnight", name: "嵐の夜の海", desc: "いちばん荒れた海を越えていく" },
      { id: "northsea", name: "冬の北の海", desc: "氷の浮かぶ、長い長い航路" },
      { id: "lighthouse", name: "灯台の岬", desc: "仲間の船を導く光のそばで" }] },
    { lv: 75, slot: "head", title: "船長への道", text: "船長になる日が近づいてきた。頭には？", items: [
      { id: "bandana", name: "赤いバンダナ", desc: "力強さの証" },
      { id: "knit", name: "ニット帽", desc: "冬の長い航海でも頭を冷やさない" },
      { id: "navhat", name: "航海士の帽子", desc: "船を率いる者の帽子" }] },
    { lv: 80, slot: "outfit", title: "港での再会", text: "港で、街の看板娘と出会った。船旅の服を選ぼう。（2人が同じ番号を選ぶとおそろい）", items: [
      { id: "border", name: "マリンボーダー", desc: "船の上でいちばん動きやすい" },
      { id: "sailor", name: "セーラー服", desc: "潮風になじむ、船乗りの正装" },
      { id: "travel", name: "旅のコート", desc: "遠い大陸まで一緒に行く覚悟の一着" }] },
    { lv: 85, slot: "head", title: "甲板の上で", text: "船が港を出た。甲板でかぶる帽子は？（同じ番号でおそろい）", items: [
      { id: "captain", name: "キャプテン帽", desc: "ついに船長になった" },
      { id: "mcap", name: "マリンキャップ", desc: "風に強い、旅の相棒" },
      { id: "boater", name: "カンカン帽", desc: "2人で選んだ、おそろいのリボン" }] },
    { lv: 90, slot: "bg", title: "ふたりの航路", text: "ふたりの船が進む景色を選ぼう。（同じ番号でおそろい）", items: [
      { id: "dawnport", name: "夜明けの港", desc: "見送りに来てくれた街の人たち" },
      { id: "ocean", name: "大海原", desc: "どこまでも続く青い海" },
      { id: "deck", name: "船の甲板", desc: "仲間と過ごす、にぎやかな船の上" }] },
    { lv: 95, slot: "hand", title: "新しい大陸", text: "新しい大陸が見えてきた。最後の航海で手にするのは？", items: [
      { id: "legend", name: "伝説の櫂", desc: "大海を漕ぎきった者だけが持てる櫂" },
      { id: "compass", name: "金の羅針盤", desc: "どんなに遠くても、ふたりの行き先を指す" },
      { id: "wheel", name: "船の舵輪", desc: "船と仲間のすべてを預かる" }] },
    { lv: 100, slot: "outfit", title: "夢の舞踏会", text: "夢の国の舞踏会に、ふたりで招かれた。最後の正装を選ぼう。（背景「舞踏会」も届きます）", items: [
      { id: "seaking", name: "大海の王の正装", desc: "海を越えてきた力の証" },
      { id: "admiral", name: "提督の礼服", desc: "長い航海をやりとげた者の誇り" },
      { id: "tuxedo", name: "タキシード", desc: "仲間を率いてきた、落ち着いた大人の装い" }] }
  ]
};

// Lv.100 で選んだときに一緒に届く背景
const FINAL_BONUS = { slot: "bg", id: "ballroom", name: "夢の国の舞踏会" };

// 2人共通の章（同じ番号を選ぶとおそろい）
const PAIR_LEVELS = [80, 85, 90];


// ===== レベルの計算 =====
// スタートの体重を Lv.20、目標体重を Lv.100 として、7日平均の体重からレベルを出す
function rawLevel(person, avgKg) {
  return 20 + 80 * (person.start - avgKg) / (person.start - person.goal);
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

// 次のレベルまであと何kgか
function kgToNextLevel(person, avgKg, lv) {
  if (lv >= 100) return 0;
  const perLevel = (person.start - person.goal) / 80;
  return Math.max(avgKg - (person.start - (lv + 1 - 20) * perLevel), 0);
}

// 今の章と称号
function chapterOf(key, lv) {
  let found = CHAPTERS[key][0];
  CHAPTERS[key].forEach(c => { if (lv >= c[0]) found = c; });
  return { name: found[1], title: found[2] };
}


// ===== アイテムの受け取り =====
// picks は { "25": "apron", "30": "straw", ... }（レベル → 選んだアイテムのid）

// まだ選んでいない、届いているアイテム（いちばん低いレベルから）
function pendingStory(key, lv, picks) {
  return STORY[key].find(s => s.lv <= lv && !picks[s.lv]) || null;
}

// 次にアイテムが届くレベル
function nextStoryLevel(key, lv) {
  const next = STORY[key].find(s => s.lv > lv);
  return next ? next.lv : null;
}

// 場所ごとに、持っているアイテムの一覧（最初から持っているもの＋受け取ったもの）
function ownedItems(key, picks) {
  const owned = {};
  for (const slot in SLOT_LABEL[key]) owned[slot] = [DEFAULTS[key][slot]];
  STORY[key].forEach(s => {
    const item = s.items.find(i => i.id === picks[s.lv]);
    if (item) owned[s.slot].push(item);
  });
  if (picks[100]) owned[FINAL_BONUS.slot].push(FINAL_BONUS);
  // 頭や持ち物は「なし」も選べるようにする
  ["head", "side", "hand"].forEach(slot => {
    if (owned[slot] && !owned[slot].some(i => i.id === "none")) owned[slot].push({ id: "none", name: "なし" });
  });
  return owned;
}

// 着ているもの。持っていないものは、最初の服にもどす
function equippedStyle(key, picks, equip) {
  const owned = ownedItems(key, picks);
  const style = {};
  for (const slot in owned) {
    const want = (equip || {})[slot];
    style[slot] = owned[slot].some(i => i.id === want) ? want : DEFAULTS[key][slot].id;
  }
  return style;
}

// 方向性ごとに、いくつ選んだか（ステータス）
function directionCounts(key, picks) {
  const counts = [0, 0, 0];
  STORY[key].forEach(s => {
    const index = s.items.findIndex(i => i.id === picks[s.lv]);
    if (index >= 0) counts[index]++;
  });
  return counts;
}

// 2人が同じ番号を選んだ章（おそろい）
function pairMatches(picksEmi, picksManato) {
  return PAIR_LEVELS.filter(lv => {
    const e = STORY.emi.find(s => s.lv === lv).items.findIndex(i => i.id === picksEmi[lv]);
    const m = STORY.manato.find(s => s.lv === lv).items.findIndex(i => i.id === picksManato[lv]);
    return e >= 0 && e === m;
  });
}
