/**
 * نموذج الشكاوى - بسيط وسهل
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaintForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // إخفاء الرسائل السابقة
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // جمع البيانات
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            complaint: document.getElementById('complaint').value.trim()
        };

        // التحقق من البيانات
        if (!formData.name || !formData.phone || !formData.email || !formData.complaint) {
            showError('الرجاء ملء جميع الحقول');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showError('البريد الإلكتروني غير صحيح');
            return;
        }

        // تعطيل الزر وإظهار حالة التحميل
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جاري الإرسال...';

        try {
            // استبدل هذا الرابط برابط Google Apps Script الخاص بك
            const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvfTiskzfVk35htjeI9jSr0k7hB9JctLmBUuMqmvr6aTMyS3T6trKDzi4GNEwqhIlbKA/exec';

            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            });

            // إظهار رسالة النجاح
            showSuccess();

            // مسح النموذج
            form.reset();

            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'إرسال';

            // إخفاء رسالة النجاح بعد 5 ثواني
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('خطأ:', error);
            showError('حدث خطأ. حاول مرة أخرى');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'إرسال';
        }
    });

    function showSuccess() {
        successMessage.style.display = 'flex';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
