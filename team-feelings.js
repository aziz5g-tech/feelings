// JavaScript لصفحة مشاكل التدريب مع الباركود

// إنشاء الباركود
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على الرابط الكامل لصفحة إضافة المشاكل
    const addProblemUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'add-feeling.html';
    
    // إنشاء الباركود باستخدام Google Charts API
    const qrDiv = document.getElementById('qrcode');
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(addProblemUrl)}`;
    qrImage.alt = 'QR Code لمشاركة المشاكل';
    qrImage.style.border = '3px solid #f8f9fa';
    qrImage.style.borderRadius = '15px';
    qrImage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    qrDiv.appendChild(qrImage);

    // تحميل وعرض المشاكل المحفوظة
    displayTrainingProblems();
    
    // تحديث المشاكل كل 30 ثانية
    setInterval(displayTrainingProblems, 30000);
});

function displayTrainingProblems() {
    const problemsSlider = document.getElementById('feelings-slider');
    const savedProblems = JSON.parse(localStorage.getItem('trainingProblems') || '[]');
    
    // تصفية المشاكل لليوم الحالي فقط
    const today = new Date().toDateString();
    const todayProblems = savedProblems.filter(problem => 
        new Date(problem.timestamp).toDateString() === today
    );
    
    if (todayProblems.length === 0) {
        problemsSlider.innerHTML = '<div class="no-feelings">لا توجد مشاكل مشاركة اليوم بعد</div>';
        return;
    }
    
    problemsSlider.innerHTML = '';
    
    todayProblems.forEach(problem => {
        const problemCard = document.createElement('div');
        problemCard.className = 'feeling-card problem-card';
        
        const timeAgo = getTimeAgo(problem.timestamp);
        
        problemCard.innerHTML = `
            <div class="feeling-header">
                <img src="${problem.avatar}" alt="افتار ${problem.name}" class="feeling-avatar">
                <div class="feeling-info">
                    <h4>${problem.name}</h4>
                    <span class="feeling-time">${timeAgo}</span>
                </div>
            </div>
            <div class="feeling-content">
                <span class="feeling-emoji">${getProblemEmoji(problem.problemType)}</span>
                <span class="feeling-text">${problem.problemType}</span>
            </div>
            ${problem.description ? `<div class="problem-description-display">${problem.description}</div>` : ''}
        `;
        
        problemsSlider.appendChild(problemCard);
    });
}

function getProblemEmoji(problemType) {
    const emojiMap = {
        'فهم المطلوب': '🤔',
        'خطأ في الكود': '�',
        'اختيار الخوارزمية': '⚡',
        'تعقيد الوقت': '⏱️',
        'تعقيد المساحة': '�',
        'البيانات الكبيرة': '�',
        'الحالات الحدية': '🎯',
        'هياكل البيانات': '🏗️',
        'تصحيح الأخطاء': '�',
        'إدارة الوقت': '⌛'
    };
    return emojiMap[problemType] || '�';
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const feelingTime = new Date(timestamp);
    const diffMs = now - feelingTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return feelingTime.toLocaleDateString('ar-SA');
}
