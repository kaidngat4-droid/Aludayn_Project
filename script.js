// ===== شاشة الرمز الشهري =====
function checkCode() {
  const code = document.getElementById("monthCode").value;
  if (!code) {
    alert("يرجى إدخال رمز الشهر");
    return;
  }
  document.getElementById("lockScreen").style.display = "none";
  document.getElementById("appContent").style.display = "block";
}

// ===== حفظ PDF مع تحقق كامل =====
function savePDF() {

  // إزالة أخطاء سابقة
  document.querySelectorAll("input").forEach(i => i.classList.remove("error"));

  let hasError = false;

  const facility = document.getElementById("facilityName");
  const worker = document.getElementById("workerName");
  const month = document.getElementById("reportMonth");

  // تحقق من الحقول الأساسية
  [facility, worker, month].forEach(f => {
    if (!f.value.trim()) {
      f.classList.add("error");
      hasError = true;
    }
  });

  // منع الأرقام السالبة أو الفارغة
  document.querySelectorAll('input[type="number"]').forEach(i => {
    if (i.value === "" || parseInt(i.value) < 0) {
      i.classList.add("error");
      hasError = true;
    }
  });

  // تطابق الذكور + الإناث مع الأعمار
  const male = parseInt(document.getElementById("maleCount").value || 0);
  const female = parseInt(document.getElementById("femaleCount").value || 0);
  const totalGender = male + female;

  let totalAge = 0;
  document.querySelectorAll(".ageCount").forEach(i => {
    totalAge += parseInt(i.value || 0);
  });

  if (totalGender !== totalAge) {
    alert("⚠️ مجموع الذكور والإناث يجب أن يساوي مجموع الحالات حسب العمر");
    document.getElementById("maleCount").classList.add("error");
    document.getElementById("femaleCount").classList.add("error");
    document.querySelectorAll(".ageCount").forEach(i => i.classList.add("error"));
    return;
  }

  if (hasError) {
    alert("⚠️ يرجى تصحيح الحقول المظللة باللون الأحمر");
    return;
  }

  // إنشاء PDF
  const element = document.getElementById("healthForm");

  html2pdf().set({
    margin: 10,
    filename: `تقرير_${facility.value}_${month.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
}

// ===== واتساب =====
function sendWhatsApp() {
  const text = encodeURIComponent("تم إعداد تقرير الرعاية التكاملية – مديرية العدين");
  window.open(`https://wa.me/?text=${text}`, "_blank");
}
