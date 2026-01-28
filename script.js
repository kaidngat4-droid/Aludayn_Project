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
  const male = Number(document.querySelector(".male")?.value || 0);
  const female = Number(document.querySelector(".female")?.value || 0);
  const totalByGender = male + female;

  const ageInputs = document.querySelectorAll(".age-0-2m, .age-2m-1y, .age-1-2y, .age-2-5y");
  let totalByAge = 0;
  ageInputs.forEach(inp => totalByAge += Number(inp.value || 0));

  const visitInputs = document.querySelectorAll(".visit-primary, .visit-followup");
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

  const rows = document.querySelectorAll("table tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 2) {
      const label = cells[0].innerText.trim();
      const value = cells[1].querySelector("input")?.value || "";
      if (label && value !== "") {
        doc.text(`${label}: ${value}`, 10, y);
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

  const rows = document.querySelectorAll("table tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 2) {
      const label = cells[0].innerText.trim();
      const value = cells[1].querySelector("input")?.value || "";
      if (label && value !== "") {
        msg += `▫️ *${label}:* ${value}\n`;
      }
    }
  });

  const whatsappUrl = `https://wa.me/967776572227?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, "_blank");
}
