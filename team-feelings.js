// JavaScript لصفحة مشاعر الفريق مع الباركود

// إنشاء الباركود
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على الرابط الكامل لصفحة إضافة المشاعر
    const addFeelingUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'add-feeling.html';
    
    // إنشاء الباركود باستخدام Google Charts API
    const qrDiv = document.getElementById('qrcode');
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(addFeelingUrl)}`;
    qrImage.alt = 'QR Code لمشاركة المشاعر';
    qrImage.style.border = '3px solid #f8f9fa';
    qrImage.style.borderRadius = '15px';
    qrImage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    qrDiv.appendChild(qrImage);

    // تحميل وعرض المشاعر المحفوظة
    displayTeamFeelings();
    
    // تحديث المشاعر كل 30 ثانية
    setInterval(displayTeamFeelings, 30000);
});

function displayTeamFeelings() {
    const feelingsSlider = document.getElementById('feelings-slider');
    const savedFeelings = JSON.parse(localStorage.getItem('teamFeelings') || '[]');
    
    // تصفية المشاعر لليوم الحالي فقط
    const today = new Date().toDateString();
    const todayFeelings = savedFeelings.filter(feeling => 
        new Date(feeling.timestamp).toDateString() === today
    );
    
    if (todayFeelings.length === 0) {
        feelingsSlider.innerHTML = '<div class="no-feelings">لا توجد مشاعر مشاركة اليوم بعد</div>';
        return;
    }
    
    feelingsSlider.innerHTML = '';
    
    todayFeelings.forEach(feeling => {
        const feelingCard = document.createElement('div');
        feelingCard.className = 'feeling-card';
        
        const timeAgo = getTimeAgo(feeling.timestamp);
        
        feelingCard.innerHTML = `
            <div class="feeling-header">
                <img src="${feeling.avatar}" alt="افتار ${feeling.name}" class="feeling-avatar">
                <div class="feeling-info">
                    <h4>${feeling.name}</h4>
                    <span class="feeling-time">${timeAgo}</span>
                </div>
            </div>
            <div class="feeling-content">
                <span class="feeling-emoji">${getFeelingEmoji(feeling.feeling)}</span>
                <span class="feeling-text">${feeling.feeling}</span>
            </div>
        `;
        
        feelingsSlider.appendChild(feelingCard);
    });
}

function getFeelingEmoji(feeling) {
    const emojiMap = {
        'متحمس': '😃',
        'سعيد': '😊',
        'هادئ': '😌',
        'متململ': '😐',
        'متعب': '😴',
        'قلق': '😰',
        'غير واثق': '😕',
        'محبط': '😞',
        'غاضب': '😠',
        'مندهش': '😲'
    };
    return emojiMap[feeling] || '😊';
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
