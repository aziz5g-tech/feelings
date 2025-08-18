// بيانات المشاعر المحفوظة
let feelingsData = JSON.parse(localStorage.getItem('feelingsData')) || [];

// عناصر DOM
const userSelect = document.getElementById('user-select');
const feelingSelect = document.getElementById('feeling-select');
const submitBtn = document.getElementById('submit-feeling');
const feelingsSlider = document.getElementById('feelings-slider');
const selectedAvatar = document.getElementById('selected-avatar');
const changeAvatarBtn = document.getElementById('change-avatar-btn');
const avatarModal = document.getElementById('avatar-modal');
const closeModal = document.querySelector('.close');
const avatarOptions = document.querySelectorAll('.avatar-option');

// الافتار الافتراضي
let currentAvatar = 'avatars/default.png';

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    createAvatarImages();
    displayFeelings();
    setupEventListeners();
    startAutoScroll();
});

// إنشاء صور الافتارات
function createAvatarImages() {
    // إنشاء مجلد الافتارات إذا لم يكن موجوداً
    createDefaultAvatars();
}

// إنشاء افتارات افتراضية (باستخدام صور وهمية)
function createDefaultAvatars() {
    const avatarUrls = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=1&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=2&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=3&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=4&backgroundColor=ffd93d',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=5&backgroundColor=ffb3ba',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=6&backgroundColor=bae1ff'
    ];

    // تحديث مصادر الصور في الافتارات
    avatarOptions.forEach((option, index) => {
        const img = option.querySelector('img');
        if (img && avatarUrls[index]) {
            img.src = avatarUrls[index];
            option.dataset.avatar = avatarUrls[index];
        }
    });

    // تعيين الافتار الافتراضي
    currentAvatar = avatarUrls[0];
    selectedAvatar.src = currentAvatar;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تفعيل/إلغاء تفعيل زر الإرسال
    userSelect.addEventListener('change', validateForm);
    feelingSelect.addEventListener('change', validateForm);

    // إرسال الشعور
    submitBtn.addEventListener('click', submitFeeling);

    // فتح نافذة الافتار
    changeAvatarBtn.addEventListener('click', () => {
        avatarModal.style.display = 'block';
    });

    // إغلاق نافذة الافتار
    closeModal.addEventListener('click', () => {
        avatarModal.style.display = 'none';
    });

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === avatarModal) {
            avatarModal.style.display = 'none';
        }
    });

    // اختيار افتار
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            const avatarSrc = option.dataset.avatar;
            currentAvatar = avatarSrc;
            selectedAvatar.src = avatarSrc;
            avatarModal.style.display = 'none';
        });
    });
}

// التحقق من صحة النموذج
function validateForm() {
    const userName = userSelect.value;
    const userFeeling = feelingSelect.value;
    
    submitBtn.disabled = !(userName && userFeeling);
}

// إرسال الشعور
function submitFeeling() {
    const userName = userSelect.value;
    const userFeeling = feelingSelect.value;
    const currentTime = new Date();

    // إنشاء كائن الشعور الجديد
    const newFeeling = {
        id: Date.now(),
        name: userName,
        feeling: userFeeling,
        avatar: currentAvatar,
        time: currentTime.toLocaleString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        })
    };

    // إضافة الشعور إلى المصفوفة
    feelingsData.unshift(newFeeling);

    // الحد الأقصى للمشاعر المعروضة
    if (feelingsData.length > 20) {
        feelingsData = feelingsData.slice(0, 20);
    }

    // حفظ البيانات
    localStorage.setItem('feelingsData', JSON.stringify(feelingsData));

    // إعادة تعيين النموذج
    userSelect.value = '';
    feelingSelect.value = '';
    validateForm();

    // تحديث العرض
    displayFeelings();

    // عرض رسالة نجاح
    showSuccessMessage();
}

// عرض المشاعر
function displayFeelings() {
    feelingsSlider.innerHTML = '';

    if (feelingsData.length === 0) {
        feelingsSlider.innerHTML = `
            <div class="no-feelings">
                <p>لا توجد مشاعر مشاركة بعد... كن أول من يشارك شعوره! 🌟</p>
            </div>
        `;
        return;
    }

    feelingsData.forEach((feeling, index) => {
        const feelingElement = document.createElement('div');
        feelingElement.className = 'feeling-item';
        feelingElement.style.animationDelay = `${index * 0.1}s`;
        
        feelingElement.innerHTML = `
            <img src="${feeling.avatar}" alt="افتار ${feeling.name}">
            <div class="feeling-content">
                <div class="name">${feeling.name}</div>
                <div class="feeling">${feeling.feeling}</div>
                <div class="time">${feeling.time}</div>
            </div>
        `;

        feelingsSlider.appendChild(feelingElement);
    });
}

// بدء التمرير التلقائي
function startAutoScroll() {
    setInterval(() => {
        if (feelingsData.length > 3) {
            feelingsSlider.scrollTop += 2;
            
            // إعادة التمرير إلى الأعلى عند الوصول للنهاية
            if (feelingsSlider.scrollTop >= feelingsSlider.scrollHeight - feelingsSlider.clientHeight) {
                feelingsSlider.scrollTop = 0;
            }
        }
    }, 100);
}

// عرض رسالة نجاح
function showSuccessMessage() {
    // إنشاء عنصر الرسالة
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'تم مشاركة شعورك بنجاح! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Cairo', sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 1001;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s forwards;
    `;

    // إضافة الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .no-feelings {
            text-align: center;
            padding: 50px 20px;
            color: #666;
            font-size: 1.2rem;
        }
    `;
    
    if (!document.querySelector('#success-styles')) {
        style.id = 'success-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(message);

    // إزالة الرسالة بعد 3 ثوان
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// تحديث المشاعر كل دقيقة (للمحاكاة)
function simulateActivity() {
    const names = ['سارة', 'كريم', 'نور', 'يوسف', 'لينا', 'طارق'];
    const feelings = [
        'متحمس', 'سعيد', 'هادئ', 'متململ', 'متعب', 
        'قلق', 'غير واثق', 'محبط', 'غاضب', 'مندهش'
    ];
    const avatarUrls = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=7&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=8&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=9&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=10&backgroundColor=ffd93d'
    ];

    setInterval(() => {
        // إضافة مشاعر وهمية أحياناً للتفاعل
        if (Math.random() > 0.7 && feelingsData.length < 15) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomFeeling = feelings[Math.floor(Math.random() * feelings.length)];
            const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
            const currentTime = new Date();

            const simulatedFeeling = {
                id: Date.now() + Math.random(),
                name: randomName,
                feeling: randomFeeling,
                avatar: randomAvatar,
                time: currentTime.toLocaleString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                })
            };

            feelingsData.unshift(simulatedFeeling);
            if (feelingsData.length > 20) {
                feelingsData = feelingsData.slice(0, 20);
            }
            
            localStorage.setItem('feelingsData', JSON.stringify(feelingsData));
            displayFeelings();
        }
    }, 30000); // كل 30 ثانية
}

// بدء محاكاة النشاط
setTimeout(simulateActivity, 5000);
