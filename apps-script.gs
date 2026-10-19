// ===== 設定 =====
const PEOPLE = {
  Emi:    { start: 53.5, goal: 49.0 },
  Manato: { start: 71.5, goal: 67.0 }
};
const END = "2026-12-31";
const TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");


// Webサイトがデータを読みに来ると、ここが呼ばれる
function doGet() {
  const entries = rows("記録", ["日付", "名前", "体重"])
    .map(r => ({ date: r[0], name: r[1], kg: Number(r[2]) }));

  // エールは新しい順に、最大300件
  const cheers = sheet("エール履歴", CHEER_HEADER).getDataRange().getDisplayValues().slice(1)
    .map(r => ({ at: r[0], from: r[1], to: r[2], text: r[3] }))
    .reverse().slice(0, 300);

  // 月は「2026/10/01」と表示されていても「2026-10」にそろえる
  const rewards = {};
  sheet("ごほうび", ["月（2026-10の形）", "ごほうび"]).getDataRange().getDisplayValues().slice(1)
    .forEach(r => { rewards[r[0].replace(/\//g, "-").slice(0, 7)] = r[1]; });

  const avatars = {};
  rows("アバター", AVATAR_HEADER).forEach(r => {
    try { avatars[r[0]] = { picks: JSON.parse(r[1] || "{}"), equip: JSON.parse(r[2] || "{}") }; } catch (err) {}
  });

  const advice = { Emi: adviceOf("Emi"), Manato: adviceOf("Manato") };

  const json = JSON.stringify({ entries: entries, cheers: cheers, rewards: rewards, avatars: avatars, advice: advice });
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}


// LINEからのメッセージと、サイトからのアイテム・着せ替えの保存が届くと、ここが呼ばれる
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === "avatar") saveAvatar(body.name, body.picks, body.equip);
  else if (body.action === "cheer") sendCheer(body.from, body.text);
  else (body.events || []).forEach(handleEvent);
  return ContentService.createTextOutput("ok");
}


// ===== エール =====
// シート「エール履歴」：日時 / 送った人 / 受け取った人 / エール
const CHEER_HEADER = ["日時", "送った人", "受け取った人", "エール"];
const SITE_URL = "https://emi-mana.github.io/Emi-Mana/#cheer";

// エールを保存して、相手のLINEに通知する
function sendCheer(from, text) {
  if (!PEOPLE[from]) return false;
  text = String(text || "").trim().slice(0, 200);
  if (!text) return false;

  const to = from === "Emi" ? "Manato" : "Emi";
  const at = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd HH:mm");
  // 先頭の ' は、シートに日時へ自動変換させず文字のまま残すため
  sheet("エール履歴", CHEER_HEADER).appendRow(["'" + at, from, to, text]);

  userIdsOf(to).forEach(id => push(id, from + "からエールが届きました\n「" + text + "」\n\n返事はこちらから\n" + SITE_URL));
  return true;
}

// その名前で登録しているLINEのID
function userIdsOf(name) {
  const members = {};
  rows("メンバー", ["LINEのID", "名前"]).forEach(r => { members[r[0]] = r[1]; });
  return Object.keys(members).filter(id => members[id] === name);
}


// ===== アイテムと着せ替え =====
// シート「アバター」：名前 / 受け取ったアイテム / 着ているもの（どちらもJSONの文字）。1人1行で上書きする
const AVATAR_HEADER = ["名前", "受け取ったアイテム", "着ているもの"];

function saveAvatar(name, picks, equip) {
  if (!PEOPLE[name]) return;
  const row = [name, JSON.stringify(picks || {}).slice(0, 2000), JSON.stringify(equip || {}).slice(0, 1000)];
  const sh = sheet("アバター", AVATAR_HEADER);
  const i = rows("アバター", AVATAR_HEADER).findIndex(r => r[0] === name);
  if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
}


function handleEvent(ev) {
  if (ev.type !== "message" || ev.message.type !== "text") return;

  const text = toHalfWidth(ev.message.text.trim());
  const userId = ev.source.userId;

  // 「Emi」か「Manato」と送ると、その人として登録
  if (PEOPLE[text]) {
    setName(userId, text);
    reply(ev.replyToken, text + " さんとして登録しました。\n毎日の体重を数字で送ってください（例：53.2）");
    return;
  }

  const name = getName(userId);
  if (!name) {
    reply(ev.replyToken, "はじめに「Emi」か「Manato」と送ってください。");
    return;
  }

  // 「エール ○○」と送ると、相手へのひとことを保存
  if (text.startsWith("エール")) {
    const message = text.replace(/^エール[\s　]*/, "").slice(0, 200);
    if (!message) {
      reply(ev.replyToken, "「エール がんばろう！」のように、エールのあとに言葉を続けて送ってください。");
      return;
    }
    sendCheer(name, message);
    reply(ev.replyToken, "エールを送りました。");
    return;
  }

  const kg = Number(text);
  if (!(kg >= 30 && kg <= 150)) {
    reply(ev.replyToken, "体重を数字だけで送ってください（例：53.2）\nエールはサイトのエールタブから送れます。");
    return;
  }

  saveWeight(name, kg);
  reply(ev.replyToken, resultMessage(name, kg));
}


// ===== 返信の文 =====
function resultMessage(name, kg) {
  const p = PEOPLE[name];
  const left = kg - p.goal;
  const lost = p.start - kg;
  const days = Math.ceil((new Date(END + "T00:00:00+09:00") - new Date()) / 86400000);

  const lines = [
    name + " " + kg.toFixed(1) + "kg を記録しました",
    "スタートから " + (lost >= 0 ? "-" : "+") + Math.abs(lost).toFixed(1) + "kg",
    left <= 0 ? "目標クリア！" : "目標まであと " + left.toFixed(1) + "kg（残り" + days + "日）"
  ];

  const partner = name === "Emi" ? "Manato" : "Emi";
  lines.push(hasRecordToday(partner) ? partner + "さんも今日記録済み" : partner + "さんは今日まだです");
  const advice = adviceOf(name);
  lines.push("", "ごはんのひとこと（" + advice.label + "）", advice.tip);
  return lines.join("\n");
}

// ===== 食事のアドバイス =====
// 体重の動きで「状態」を決めて、その状態のアドバイスを日替わりで1つ出す
// 1人18個。1か月に同じものを見るのは2回くらい
const STATE_LABEL = {
  normal: "いつもの日", down: "順調に減っています", up: "増えた日", plateau: "停滞期", training: "練習日"
};

const ADVICE = {
  Emi: {
    normal: [
      "朝はおにぎり＋ゆで卵＋ヨーグルトのように、主食とたんぱく質をそろえましょう",
      "コンビニなら、おにぎり1個＋サラダチキン＋野菜スープが手軽です",
      "甘いカフェラテを無糖のラテやお茶に変えるだけで、差が出ます",
      "赤身の肉や魚、小松菜、豆腐で鉄分を。疲れにくくなります",
      "夕方のおやつは、ヨーグルトやナッツひとつかみがおすすめです",
      "飲み会では最初に枝豆・サラダ・お刺身を。お酒の合間に水を1杯ずつ"
    ],
    down: [
      "いいペースです。このまま3食のリズムを続けましょう",
      "減っているときこそ、たんぱく質をしっかり。肌や髪のツヤを守れます",
      "もっと減らそうと量を削らず、今の食べ方を続けるのがいちばんの近道です",
      "週末にスイーツを1つ楽しむくらいなら、ペースはくずれません"
    ],
    up: [
      "1日で増えた分は、ほとんどが水分や塩分です。食事を抜かず、いつも通りに戻しましょう",
      "むくみには、バナナ・アボカド・海藻などカリウムの多い食べ物と、こまめな水分を",
      "前日に食べすぎたら、今日は野菜と汁物を多めに。主食は少なめでも抜かないで",
      "生理前は体重が増えやすい時期です。気にしすぎず、7日平均で見ましょう"
    ],
    plateau: [
      "停滞は体が慣れてきたサイン。2週間ほどで動き出すことが多いので、続けましょう",
      "量を減らすより、たんぱく質と野菜を増やして中身を変えてみましょう",
      "1駅歩く、階段を使うなど、日常の動きを少し足すと停滞が抜けやすいです",
      "睡眠が短いと食欲が増えやすくなります。いつもより30分早く寝てみて"
    ]
  },
  Manato: {
    training: [
      "漕ぐ2〜3時間前に、おにぎり・パン・バナナなどの炭水化物をしっかり。練習日は削らないこと",
      "1時間以上漕ぐときは、1時間に30〜60gの糖質（ジェル・バナナ・スポーツドリンク）を補給",
      "汗で塩分も出ます。水だけでなく、スポーツドリンクや塩タブレットも",
      "練習後30分以内に、たんぱく質＋炭水化物で回復を（おにぎり＋プロテイン、牛丼など）"
    ],
    normal: [
      "練習のない日は、主食をいつもの2/3くらいに",
      "たんぱく質は毎食、手のひら1枚分を目安に",
      "揚げ物は週2回までにすると、無理なく体重が落ちます",
      "晩酌は週2〜3回まで。おつまみは焼き鳥や刺身などたんぱく質系を"
    ],
    down: [
      "いいペース。練習日は食べる、平日は控えめ、のメリハリを続けましょう",
      "筋肉を落とさないよう、たんぱく質は体重1kgあたり1.6gくらいを確保",
      "練習で力が出ないと感じたら、練習前の炭水化物を増やして調整を"
    ],
    up: [
      "長い練習の翌日は、筋肉にためた糖と水分で体重が増えることがあります。7日平均で見ましょう",
      "塩分の多い食事の翌日はむくみやすいです。水をしっかり飲んで、野菜を多めに",
      "前日に食べすぎたら、今日は主食を少なめにして、おかずと汁物でおなかを満たす",
      "夜遅い食事が続いていないかチェック。寝る3時間前までに食べ終えるのが理想です"
    ],
    plateau: [
      "停滞は体が慣れたサイン。平日の夜の主食だけ、もう少し減らしてみましょう",
      "野菜・きのこ・海藻でかさ増しすると、量を減らしても満足できます",
      "間食や飲み物のカロリーを見直すと、停滞が抜けることが多いです"
    ]
  }
};

// 体重の動きから状態を決める
function weightState(name) {
  const weekday = Number(Utilities.formatDate(new Date(), "Asia/Tokyo", "u"));  // 1=月 … 7=日
  if (name === "Manato" && weekday >= 6) return "training";

  const list = rows("記録", ["日付", "名前", "体重"])
    .filter(r => r[1] === name)
    .map(r => ({ date: r[0], kg: Number(r[2]) }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  if (list.length < 2) return "normal";

  // 前回の記録より0.3kg以上増えた
  const last = list[list.length - 1];
  if (last.kg - list[list.length - 2].kg >= 0.3) return "up";

  // 直近7日の平均と、その前の7日の平均をくらべる
  const daysAgo = d => (new Date(last.date) - new Date(d)) / 86400000;
  const average = items => items.length ? items.reduce((s, e) => s + e.kg, 0) / items.length : null;
  const now = average(list.filter(e => daysAgo(e.date) < 7));
  const before = average(list.filter(e => daysAgo(e.date) >= 7 && daysAgo(e.date) < 14));
  if (before === null) return "normal";

  const diff = now - before;
  if (diff <= -0.2) return "down";
  if (diff < 0.2) return "plateau";
  return "up";
}

// 今日のアドバイス（状態の中から日替わり）
function adviceOf(name) {
  const state = weightState(name);
  const list = ADVICE[name][state];
  const dayNumber = Math.floor(Date.now() / 86400000);
  return { state: state, label: STATE_LABEL[state], tip: list[dayNumber % list.length] };
}


// ===== シートの読み書き =====
// シート「記録」：日付 / 名前 / 体重　　シート「メンバー」：LINEのID / 名前
function sheet(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
  }
  return sh;
}

function today() {
  return Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
}

// 見出しを除いた行。1列目の日付は、シートが日付に変換していても「2026-10-19」の形にそろえる
function rows(name, header) {
  return sheet(name, header).getDataRange().getValues().slice(1).map(r => {
    r[0] = r[0] instanceof Date ? Utilities.formatDate(r[0], "Asia/Tokyo", "yyyy-MM-dd") : String(r[0]);
    return r;
  });
}

// 同じ日・同じ人の記録があれば上書き、なければ追加
function saveWeight(name, kg) {
  const list = rows("記録", ["日付", "名前", "体重"]);
  const i = list.findIndex(r => r[0] === today() && r[1] === name);
  if (i >= 0) {
    sheet("記録", []).getRange(i + 2, 3).setValue(kg);  // +2 は見出しの1行と、1から数える分
    return;
  }
  sheet("記録", []).appendRow([today(), name, kg]);
}

function hasRecordToday(name) {
  return rows("記録", ["日付", "名前", "体重"]).some(r => r[0] === today() && r[1] === name);
}

function setName(userId, name) {
  sheet("メンバー", ["LINEのID", "名前"]).appendRow([userId, name]);
}

function getName(userId) {
  const rows = sheet("メンバー", ["LINEのID", "名前"]).getDataRange().getValues();
  let name = "";
  rows.forEach(r => { if (r[0] === userId) name = r[1]; });  // 最後に登録した名前を使う
  return name;
}


// ===== 毎朝6時の通知 =====
// 最初に1回だけ、エディタで setupMorningReminder を選んで「実行」する
function setupMorningReminder() {
  // 同じ通知が2つできないように、前のものを消してから作る
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "morningReminder")
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("morningReminder").timeBased()
    .atHour(6).nearMinute(0).everyDays(1).inTimezone("Asia/Tokyo").create();
}

// 登録している人それぞれに、朝のメッセージを送る
function morningReminder() {
  const days = Math.ceil((new Date(END + "T00:00:00+09:00") - new Date()) / 86400000);

  // LINEのID → 名前（同じIDは最後に登録した名前を使う）
  const members = {};
  rows("メンバー", ["LINEのID", "名前"]).forEach(r => { if (PEOPLE[r[1]]) members[r[0]] = r[1]; });

  for (const userId in members) {
    const name = members[userId];
    const lines = ["おはようございます、" + name + "さん。", "今日の体重を数字で送ってください（例：" + PEOPLE[name].goal.toFixed(1) + "）"];
    const last = lastWeight(name);
    if (last) lines.push("目標まであと " + Math.max(last - PEOPLE[name].goal, 0).toFixed(1) + "kg");
    if (days > 0) lines.push("夢の国まで あと" + days + "日");
    push(userId, lines.join("\n"));
  }
}

// その人のいちばん新しい体重
function lastWeight(name) {
  const list = rows("記録", ["日付", "名前", "体重"]).filter(r => r[1] === name).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return list.length ? Number(list[list.length - 1][2]) : null;
}

function push(userId, text) {
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + TOKEN },
    payload: JSON.stringify({ to: userId, messages: [{ type: "text", text: text }] })
  });
}


// ===== LINEへの返信 =====
function reply(replyToken, text) {
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + TOKEN },
    payload: JSON.stringify({ replyToken: replyToken, messages: [{ type: "text", text: text }] })
  });
}

// 全角の数字（５３．２）も読めるようにする
function toHalfWidth(s) {
  return s.replace(/[０-９．]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
}
