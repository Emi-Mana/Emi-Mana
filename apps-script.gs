// ===== 設定 =====
const PEOPLE = {
  Emi:    { start: 53.5, goal: 49.0 },
  Manato: { start: 71.5, goal: 67.0 }
};
const END = "2026-12-31";
const TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");


// Webサイトがデータを読みに来ると、ここが呼ばれる
function doGet() {
  const entries = sheet("記録", ["日付", "名前", "体重"]).getDataRange().getDisplayValues().slice(1)
    .map(r => ({ date: r[0], name: r[1], kg: Number(r[2]) }));

  const cheers = {};
  sheet("エール", ["日付", "名前", "ひとこと"]).getDataRange().getDisplayValues().slice(1)
    .forEach(r => { cheers[r[1]] = { date: r[0], text: r[2] }; });  // 最新の1件だけ残る

  const rewards = {};
  sheet("ごほうび", ["月（2026-10の形）", "ごほうび"]).getDataRange().getDisplayValues().slice(1)
    .forEach(r => { rewards[r[0]] = r[1]; });

  const json = JSON.stringify({ entries: entries, cheers: cheers, rewards: rewards });
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}


// LINEからメッセージが届くと、ここが呼ばれる
function doPost(e) {
  const events = JSON.parse(e.postData.contents).events;
  events.forEach(handleEvent);
  return ContentService.createTextOutput("ok");
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
  return lines.join("\n");
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

// 同じ日・同じ人の記録があれば上書き、なければ追加
function saveWeight(name, kg) {
  const sh = sheet("記録", ["日付", "名前", "体重"]);
  const rows = sh.getDataRange().getDisplayValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === today() && rows[i][1] === name) {
      sh.getRange(i + 1, 3).setValue(kg);
      return;
    }
  }
  sh.appendRow([today(), name, kg]);
}

function hasRecordToday(name) {
  const rows = sheet("記録", ["日付", "名前", "体重"]).getDataRange().getDisplayValues();
  return rows.some(r => r[0] === today() && r[1] === name);
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
