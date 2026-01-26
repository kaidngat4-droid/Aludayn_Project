// رمز الشهر
function checkCode(){
    const code = document.getElementById('monthCode').value;
    if(code == '012026'){ // ضع الرمز الشهري هنا
        document.getElementById('lockScreen').style.display='none';
        document.getElementById('appContent').style.display='block';
    }else{
        alert('رمز خاطئ');
    }
}

// إرسال واتساب
function sendWhatsApp(){
    let msg = "*📊 تقرير الرعاية التكاملية - مديرية العدين*\n";
    msg += "*تاريخ:* " + new Date().toLocaleDateString('ar-YE') + "\n\n";
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"], input[type="month"]');
    let hasData=false;
    inputs.forEach(input=>{
        if(input.value){
            let label = input.closest('td')? input.closest('tr').cells[0].innerText: '';
            if(label){
                msg+=`▫️ *${label}:* ${input.value}\n`;
                hasData=true;
            }
        }
    });
    if(!hasData){alert("يرجى إدخال البيانات قبل الإرسال");return;}
    window.open(`https://wa.me/967776572227?text=${encodeURIComponent(msg)}`,'_blank');
}

// حفظ PDF
function savePDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    let y = 10;
    doc.setFontSize(12);
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"], input[type="month"]');
    inputs.forEach(input=>{
        if(input.value){
            let label = input.closest('td')? input.closest('tr').cells[0].innerText:'';
            if(label){
                doc.text(`${label}: ${input.value}`,10,y);
                y+=7;
            }
        }
    });
    doc.save('report.pdf');
}