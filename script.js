// ===== شاشة الرمز الشهري =====
function checkCode() {
  const code = document.getElementById("monthCode").value.trim();
  const correctCode = "122026"; // الرمز الشهري الجديد
  if (!code) {
    alert("يرجى إدخال رمز الشهر");
    return;
  }
  if (code === correctCode) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
  } else {
    alert("❌ رمز الشهر غير صحيح");
  }
}

// ===== التحقق من القيم =====
function validateForm() {
  let valid = true;
  const inputs = document.querySelectorAll("input[type='number'], input[type='text'], input[type='month']");

  // إزالة أي تلوين سابق
  inputs.forEach(input => input.classList.remove("error"));

  // التحقق من الحقول الأساسية
  inputs.forEach(input => {
    const val = input.value.trim();

    // الحقول الفارغة خطأ
    if (val === "") {
      input.classList.add("error");
      valid = false;
    }

    // الأرقام السالبة خطأ
    if (input.type === "number" && Number(val) < 0) {
      input.classList.add("error");
      valid = false;
    }
    // الصفر مقبول
  });

  // ===== التحقق من التوازن =====
  // المجموع حسب النوع
  const male = Number(document.querySelector("td:contains('ذكور') + td input")?.value || 0);
  const female = Number(document.querySelector("td:contains('إناث') + td input")?.value || 0);
  const totalByGender = male + female;

  // المجموع حسب العمر
  const ageInputs = document.querySelectorAll("div.section-title:contains('عدد الحالات حسب العمر') + div.card input");
  let totalByAge = 0;
  ageInputs.forEach(inp => totalByAge += Number(inp.value || 0));

  // المجموع حسب نوع الزيارة
  const visitInputs = document.querySelectorAll("div.section-title:contains('نوع الزيارة') + div.card input");
  let totalByVisit = 0;
  visitInputs.forEach(inp => totalByVisit += Number(inp.value || 0));

  if (totalByGender !== totalByAge || totalByGender !== totalByVisit) {
    alert("⚠️ مجموع الحالات حسب النوع، العمر ونوع الزيارة غير متطابق");
    valid = false;
  }

  if (!valid) alert("⚠️ يرجى تصحيح الحقول المظللة باللون الأحمر");

  return valid;
}

// ===== حفظ PDF =====
function savePDF() {
  if (!validateForm()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(14);
  doc.text("📊 تقرير الرعاية التكاملية - مديرية العدين", 10, 15);
  doc.setFontSize(11);
  doc.text("التاريخ: " + new Date().toLocaleDateString("ar-YE"), 10, 25);

  let y = 35;
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.value) {
      let label =
        input.closest("tr")?.cells[0]?.innerText ||
        input.previousSibling?.innerText ||
        "";
      if (label) {
        doc.text(`${label}: ${input.value}`, 10, y);
        y += 7;
      }
    }
  });

  doc.save("تقرير_الرعاية_التكاملية.pdf");
}

// ===== إرسال واتساب =====
function sendWhatsApp() {
  if (!validateForm()) return;

  let msg = "*📊 تقرير الرعاية التكاملية - مديرية العدين*\n";
  msg += "*التاريخ:* " + new Date().toLocaleDateString("ar-YE") + "\n\n";

  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.value) {
      let label = input.closest("tr")?.cells[0]?.innerText || "";
      if (label) msg += `▫️ *${label}:* ${input.value}\n`;
    }
  });

  window.open(
    `https://wa.me/967776572227?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}
