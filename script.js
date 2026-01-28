// ===== شاشة الرمز الشهري =====
function checkCode() {
  const code = document.getElementById("monthCode").value.trim();

  if (!code) {
    alert("يرجى إدخال رمز الشهر");
    return;
  }

  // الرمز الشهري المحدد
  const correctCode = "122026"; 

  if (code === correctCode) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
  } else {
    alert("❌ رمز الشهر غير صحيح");
  }
}

// ===== التحقق من صحة القيم =====
function validateForm() {
  let valid = true;
  const inputs = document.querySelectorAll("input[type='number'], input[type='text'], input[type='month']");
  
  // إزالة تمييز الأخطاء القديم
  inputs.forEach(input => input.classList.remove("error"));

  // تحقق من الحقول
  inputs.forEach(input => {
    if (!input.value) {
      input.classList.add("error");
      valid = false;
    } else if (input.type === "number" && Number(input.value) < 0) {
      input.classList.add("error");
      valid = false;
    }
  });

  // تحقق من إجمالي عدد الحالات
  const male = Number(document.querySelectorAll("input")[2].value) || 0;
  const female = Number(document.querySelectorAll("input")[3].value) || 0;
  const totalBySex = male + female;

  const ageInputs = document.querySelectorAll("input[type='number']");
  let totalByAge = 0;
  for (let i = 4; i <= 7; i++) totalByAge += Number(ageInputs[i].value) || 0;

  const visitInputs = document.querySelectorAll("input[type='number']");
  const totalVisit = (Number(visitInputs[0].value) || 0) + (Number(visitInputs[1].value) || 0);

  if (totalBySex !== totalByAge || totalBySex !== totalVisit) {
    alert("⚠️ إجمالي الحالات حسب النوع يجب أن يساوي إجمالي الحالات حسب العمر ونوع الزيارة");
    valid = false;
  }

  if (!valid) alert("⚠️ يرجى تصحيح الحقول المظللة باللون الأحمر");
  return valid;
}

// ===== حفظ PDF =====
function savePDF() {
  if (!validateForm()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setFontSize(14);
  doc.text("📊 تقرير الرعاية التكاملية - مديرية العدين", 10, 15);
  doc.setFontSize(11);
  doc.text("التاريخ: " + new Date().toLocaleDateString("ar-YE"), 10, 25);

  let y = 35;
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.value) {
      let label = input.closest("tr")?.cells[0]?.innerText || input.previousSibling?.innerText || "";
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
