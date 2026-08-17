/**
 * CA306 — STUDIO 2560 — สคริปต์รับผลคะแนนจากเว็บแอปเข้า Google Sheet อัตโนมัติ
 *
 * วิธีติดตั้ง (ดูขั้นตอนละเอียดใน README.md):
 * 1. สร้าง Google Sheet ใหม่ (ไฟล์เปล่า ๆ)
 * 2. เมนู Extensions > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางไฟล์นี้แทน
 * 4. กด Deploy > New deployment > เลือกประเภท "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. คัดลอก Web app URL ที่ได้ ไปวางในไฟล์ app.js ที่ตัวแปร GOOGLE_SCRIPT_URL
 */

var TRACK_LABELS = {
  df: "ดิจิทัลฟิล์ม",
  imc: "นิเทศศาสตร์การตลาด",
  bc: "กระจายเสียง/สตรีมมิ่ง",
};

var BADGE_LABELS = {
  hr: "นักสิทธิมนุษยชนสากล",
  quiz: "นักสืบสิทธิพื้นฐาน",
  media: "ผู้พิทักษ์เสรีภาพสื่อ / โปรดิวเซอร์สายจริยธรรม / นักการตลาดผู้ตระหนักสิทธิผู้บริโภค",
  critical: "นักคิดผู้ไม่ด่วนสรุป",
  mediator: "ผู้ไกล่เกลี่ยสิทธิ",
  full: "นักสื่อสารผู้เท่าทันสิทธิ",
};

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("คำตอบ");
  if (!sheet) {
    sheet = ss.insertSheet("คำตอบ");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "เวลาที่ส่ง",
      "รหัสนักศึกษา",
      "ชื่อ",
      "นามสกุล",
      "สาย",
      "RightsPoints",
      "InsightPoints",
      "คะแนนรวม",
      "แบดจ์ที่ได้",
      "เหตุผลด่านบอส (Colliding Rights)",
    ]);
  }

  var data = JSON.parse(e.parameter.payload);
  var trackLabel = TRACK_LABELS[data.track] || data.track;
  var badgeLabels = (data.badges || [])
    .map(function (k) {
      return BADGE_LABELS[k] || k;
    })
    .join(", ");

  sheet.appendRow([
    data.submittedAt,
    data.studentId,
    data.firstName,
    data.lastName,
    trackLabel,
    data.rightsPoints,
    data.insightPoints,
    data.total,
    badgeLabels,
    data.bossReason,
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
