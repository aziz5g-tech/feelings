// JavaScript لصفحة إضافة المشاعر

let selectedAvatar = 'avatars/default.svg';

document.addEventListener('DOMContentLoaded', function() {
    const userSelect = document.getElementById('user-select');
    const feelingSelect = document.getElementById('feeling-select');
    const submitBtn = document.getElementById('submit-feeling');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarModal = document.getElementById('avatar-modal');
    const selectedAvatarImg = document.getElementById('selected-avatar');

    // التحقق من تعبئة الحقول
    function checkFormValidity() {
        const isValid = userSelect.value && feelingSelect.value;
        submitBtn.disabled = !isValid;
        submitBtn.style.opacity = isValid ? '1' : '0.5';
    }

    userSelect.addEventListener('change', checkFormValidity);
    feelingSelect.addEventListener('change', checkFormValidity);

    // إرسال المشاعر
    submitBtn.addEventListener('click', function() {
        const userName = userSelect.value;
        const userFeeling = feelingSelect.value;
        
        if (!userName || !userFeeling) {
            alert('يرجى تعبئة جميع الحقول');
            return;
        }

        // حفظ المشاعر في localStorage
        const feelingData = {
            name: userName,
            feeling: userFeeling,
            avatar: selectedAvatar,
            timestamp: new Date().toISOString()
        };

        // الحصول على المشاعر المحفوظة مسبقاً
        let savedFeelings = JSON.parse(localStorage.getItem('teamFeelings') || '[]');
        
        // إضافة المشاعر الجديدة
        savedFeelings.push(feelingData);
        
        // حفظ في localStorage
        localStorage.setItem('teamFeelings', JSON.stringify(savedFeelings));

        // عرض رسالة النجاح
        showSuccessMessage();
    });

    // فتح نافذة اختيار الافتار
    changeAvatarBtn.addEventListener('click', function() {
        avatarModal.style.display = 'block';
    });

    // إغلاق نافذة الافتار
    const closeBtn = avatarModal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        avatarModal.style.display = 'none';
    });

    // اختيار الافتار
    const avatarOptions = avatarModal.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            const avatarFile = this.dataset.avatar;
            selectedAvatar = `avatars/${avatarFile}`;
            selectedAvatarImg.src = selectedAvatar;
            avatarModal.style.display = 'none';
        });
    });

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', function(e) {
        if (e.target === avatarModal) {
            avatarModal.style.display = 'none';
        }
    });
});

function showSuccessMessage() {
    const successModal = document.getElementById('success-modal');
    successModal.style.display = 'block';
    
    // إخفاء الرسالة تلقائياً بعد 3 ثوان
    setTimeout(() => {
        successModal.style.display = 'none';
        goToTeamFeelings();
    }, 3000);
}

function goToTeamFeelings() {
    window.location.href = 'index.html';
}
