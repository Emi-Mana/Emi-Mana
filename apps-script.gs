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

  const cheers = {};
  rows("エール", ["日付", "名前", "ひとこと"])
    .forEach(r => { cheers[r[1]] = { date: r[0], text: r[2] }; });  // 最新の1件だけ残る

  // 月は「2026/10/01」と表示されていても「2026-10」にそろえる
  const rewards = {};
  sheet("ごほうび", ["月（2026-10の形）", "ごほうび"]).getDataRange().getDisplayValues().slice(1)
    .forEach(r => { rewards[r[0].replace(/\//g, "-").slice(0, 7)] = r[1]; });

  const styles = {};
  rows("着せ替え", STYLE_HEADER)
    .forEach(r => { styles[r[0]] = { outfit: r[1], hair: r[2], item: r[3], bg: r[4] }; });

  const json = JSON.stringify({ entries: entries, cheers: cheers, rewards: rewards, styles: styles });
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}


// LINEからのメッセージと、サイトからの着せ替えの保存が届くと、ここが呼ばれる
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === "style") saveStyle(body.name, body.style);
  else (body.events || []).forEach(handleEvent);
  return ContentService.createTextOutput("ok");
}


// ===== 着せ替え =====
// シート「着せ替え」：名前 / 服 / 髪型 / 小物 / 背景。1人1行で上書きする
const STYLE_HEADER = ["名前", "服", "髪型", "小物", "背景"];

function saveStyle(name, style) {
  if (!PEOPLE[name] || !style) return;
  const clean = v => String(v || "").slice(0, 20);
  const row = [name, clean(style.outfit), clean(style.hair), clean(style.item), clean(style.bg)];

  const sh = sheet("着せ替え", STYLE_HEADER);
  const i = rows("着せ替え", STYLE_HEADER).findIndex(r => r[0] === name);
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
    const message = text.replace(/^エール[\s　]*/, "").slice(0, 80);
    if (!message) {
      reply(ev.replyToken, "「エール がんばろう！」のように、エールのあとに言葉を続けて送ってください。");
      return;
    }
    sheet("エール", ["日付", "名前", "ひとこと"]).appendRow([today(), name, message]);
    reply(ev.replyToken, "エールを送りました。サイトのエールタブに表示されます。");
    return;
  }

  const kg = Number(text);
  if (!(kg >= 30 && kg <= 150)) {
    reply(ev.replyToken, "体重を数字だけで送ってください（例：53.2）\nエールは「エール がんばろう！」のように送れます。");
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
  lines.push("", "ごはんのひとこと：" + tipOf(name));
  return lines.join("\n");
}

// 食事のひとこと。日付で順番に変わる
const TIPS = {
  Emi: [
    "朝はおにぎり＋ゆで卵など、主食とたんぱく質をそろえて。抜かないのがいちばんの近道です",
    "コンビニならおにぎり＋サラダチキン＋スープが手軽です",
    "甘いラテを無糖に変えるだけでも差が出ます",
    "おやつはヨーグルトやナッツひとつかみに",
    "赤身の肉や魚、小松菜で鉄分を。疲れにくくなります",
    "休みの日も3食のリズムを守るとリバウンドしにくいです"
  ],
  Manato: [
    "練習のない日は、主食をいつもの2/3くらいに",
    "たんぱく質は毎食、手のひら1枚分を目安に",
    "夜はご飯少なめ、おかずと汁物でおなかを満たしましょう",
    "揚げ物は週2回までにすると無理なく落ちます",
    "晩酌は週2〜3回まで。おつまみはたんぱく質系を"
  ],
  // Manato の土日（長時間の練習日）
  ManatoTraining: [
    "長く漕ぐ日は、2〜3時間前に炭水化物をしっかり。練習日は削らないこと",
    "1時間以上漕ぐときは、1時間に30〜60gの糖質と、水分・塩分を補給",
    "練習後30分以内に、たんぱく質＋炭水化物で回復を"
  ]
};

function tipOf(name) {
  const now = new Date();
  const weekday = Number(Utilities.formatDate(now, "Asia/Tokyo", "u"));  // 1=月 … 7=日
  const list = name === "Manato" && weekday >= 6 ? TIPS.ManatoTraining : TIPS[name];
  const dayNumber = Math.floor(now.getTime() / 86400000);
  return list[dayNumber % list.length];
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
