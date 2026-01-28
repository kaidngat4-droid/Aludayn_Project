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

// ===== التحقق من القيم قبل الحفظ =====
function validateForm() {
  let valid = true;
  const inputs = document.querySelectorAll("#healthForm input");

  inputs.forEach(input => input.classList.remove("error"));

  inputs.forEach(input => {
    const val = input.value.trim();
    if (val === "" || (input.type === "number" && Number(val) < 0)) {
      input.classList.add("error");
      valid = false;
    }
  });

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
  const inputs = document.querySelectorAll("#healthForm input");

  inputs.forEach(input => {
    if (input.value) {
      const label = input.closest("tr")?.cells[0]?.innerText || "";
      if (label) {
        doc.text(`${label}: ${input.value}`, 10, y);
        y += 7;
      }
    }
  });

  doc.save("تقرير_IMCI.pdf");
}

// ===== إرسال واتساب =====
function sendWhatsApp() {
  if (!validateForm()) return;

  let msg = "*📊 تقرير الرعاية التكاملية - مديرية العدين*\n";
  msg += "*التاريخ:* " + new Date().toLocaleDateString("ar-YE") + "\n\n";

  const inputs = document.querySelectorAll("#healthForm input");
  inputs.forEach(input => {
    if (input.value) {
      const label = input.closest("tr")?.cells[0]?.innerText || "";
      if (label) msg += `▫️ *${label}:* ${input.value}\n`;
    }
  });

  window.open(
    `https://wa.me/967776572227?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

// ===== جمع البيانات من النموذج =====
function collectFormData() {
  const data = [];
  const inputs = document.querySelectorAll("#healthForm input");

  inputs.forEach(input => {
    const label = input.closest("tr")?.cells[0]?.innerText?.trim() || "";
    if (label) {
      data.push({
        "البند": label,
        "القيمة": input.value === "" ? 0 : input.value
      });
    }
  });

  return data;
}

// ===== حفظ Excel =====
function saveExcel() {
  const data = collectFormData();
  if (data.length === 0) {
    alert("لا توجد بيانات للحفظ");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير IMCI");

  XLSX.writeFile(workbook, "تقرير_IMCI.xlsx");
}

// ===== حفظ CSV =====
function saveCSV() {
  const data = collectFormData();
  if (data.length === 0) {
    alert("لا توجد بيانات للحفظ");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "تقرير_IMCI.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
