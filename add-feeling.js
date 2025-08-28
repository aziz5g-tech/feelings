// JavaScript لصفحة إضافة المشاكل في التدريب

let selectedAvatar = 'avatars/default.svg';

document.addEventListener('DOMContentLoaded', function() {
    const userSelect = document.getElementById('user-select');
    const problemSelect = document.getElementById('feeling-select');
    const problemDescription = document.getElementById('problem-description');
    const submitBtn = document.getElementById('submit-feeling');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarModal = document.getElementById('avatar-modal');
    const selectedAvatarImg = document.getElementById('selected-avatar');

    // التحقق من تعبئة الحقول
    function checkFormValidity() {
        const isValid = userSelect.value && problemSelect.value;
        submitBtn.disabled = !isValid;
        submitBtn.style.opacity = isValid ? '1' : '0.5';
    }

    userSelect.addEventListener('change', checkFormValidity);
    problemSelect.addEventListener('change', checkFormValidity);

    // إرسال المشكلة
    submitBtn.addEventListener('click', function() {
        const userName = userSelect.value;
        const problemType = problemSelect.value;
        const description = problemDescription.value.trim();
        
        if (!userName || !problemType) {
            alert('يرجى تعبئة الحقول المطلوبة');
            return;
        }

        // حفظ المشكلة في localStorage
        const problemData = {
            name: userName,
            problemType: problemType,
            description: description,
            avatar: selectedAvatar,
            timestamp: new Date().toISOString()
        };

        // الحصول على المشاكل المحفوظة مسبقاً
        let savedProblems = JSON.parse(localStorage.getItem('trainingProblems') || '[]');
        
        // إضافة المشكلة الجديدة
        savedProblems.push(problemData);
        
        // حفظ في localStorage
        localStorage.setItem('trainingProblems', JSON.stringify(savedProblems));

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
