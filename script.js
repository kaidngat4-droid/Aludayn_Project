/*************************************************
 * إعدادات عامة (تُعدّل من هنا فقط)
 *************************************************/
const MONTH_CODE = "122026"; // 🔐 رمز الدخول الشهري

/*************************************************
 * شاشة الرمز الشهري
 *************************************************/
function checkCode() {
  const code = document.getElementById("monthCode").value;

  if (!code) {
    alert("يرجى إدخال رمز الشهر");
    return;
  }

  if (code === MONTH_CODE) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
  } else {
    alert("❌ رمز الدخول غير صحيح");
  }
}

/*************************************************
 * التحقق من القيم المدخلة
 *************************************************/
function validateForm() {
  let valid = true;
  const inputs = document.querySelectorAll("input[type='number']");

  inputs.forEach(input => {
    input.classList.remove("error");

    if (input.value === "" || Number(input.value) < 0) {
      input.classList.add("error");
      valid = false;
    }
  });

  if (!valid) {
    alert("⚠️ يرجى تصحيح الحقول المظللة باللون الأحمر");
  }

  return valid;
}

/*************************************************
 * حفظ التقرير PDF
 *************************************************/
function savePDF() {
  if (!validateForm()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(14);
  doc.text("📊 تقرير الرعاية التكاملية - مديرية العدين", 10, 15);
  doc.setFontSize(11);
  doc.text(
    "التاريخ: " + new Date().toLocaleDateString("ar-YE"),
    10,
    25
  );

  let y = 35;
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.value) {
      const label =
        input.closest("tr")?.cells[0]?.innerText || "";

      if (label) {
        doc.text(`${label}: ${input.value}`, 10, y);
        y += 7;
      }
    }
  });

  doc.save("تقرير_الرعاية_التكاملية.pdf");
}

/*************************************************
 * إرسال التقرير عبر واتساب
 *************************************************/
function sendWhatsApp() {
  if (!validateForm()) return;

  let msg = "*📊 تقرير الرعاية التكاملية - مديرية العدين*\n";
  msg +=
    "*التاريخ:* " +
    new Date().toLocaleDateString("ar-YE") +
    "\n\n";

  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.value) {
      const label =
        input.closest("tr")?.cells[0]?.innerText || "";
      if (label) {
        msg += `▫️ *${label}:* ${input.value}\n`;
      }
    }
  });

  window.open(
    `https://wa.me/967776572227?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}
