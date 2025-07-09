// ==UserScript==
// @name         Auto Đăng Ký Permate v1.6.7 (Fix Every Where)
// @namespace    https://permate.com/
// @version      1.6.7
// @description  Auto điền form Permate ổn định, chống lỗi form, không auto submit
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Giao diện nút
    const box = document.createElement("div");
    box.innerHTML = `<button id="autoPermate" style="padding:8px 12px;background:#d00;color:#fff;border:none;border-radius:6px;font-weight:bold;">🚀 Auto Đăng Ký Permate</button>`;
    box.style = "position:fixed;top:20px;left:20px;z-index:9999;background:#fff;padding:10px;border-radius:10px;box-shadow:0 0 6px rgba(0,0,0,0.3);font-family:sans-serif;";
    document.body.appendChild(box);

    // Tạo random
    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const getPhone = () => "09" + Math.floor(10000000 + Math.random() * 89999999);
    const getPassword = () => "Minh" + Math.floor(1000 + Math.random() * 8999) + "!";

    // Bấm nút
    document.getElementById("autoPermate").onclick = () => {
        let count = 0;
        const timer = setInterval(() => {
            const first = document.querySelector('input[name="firstName"]');
            const last = document.querySelector('input[name="lastName"]');
            const email = document.querySelector('input[name="email"]');
            const phone = document.querySelector('input[name="phoneNumber"]');
            const pass1 = document.querySelector('input[name="password"]');
            const pass2 = document.querySelector('input[name="confirmPassword"]');

            if (first && last && email && phone && pass1 && pass2) {
                const ho = "Nguyen";
                const ten = "Minh" + rand(3);
                const mail = (ho + ten).toLowerCase() + "@yopmail.com";
                const sdt = getPhone();
                const pw = getPassword();

                first.value = ten;
                last.value = ho;
                email.value = mail;
                phone.value = sdt;
                pass1.value = pw;
                pass2.value = pw;

                [first, last, email, phone, pass1, pass2].forEach(i => {
                    i.dispatchEvent(new Event("input", { bubbles: true }));
                });

                clearInterval(timer);
                alert(`✅ Đã điền!\n📩 ${mail}\n📞 ${sdt}\n🔒 ${pw}\n👉 Tick CAPTCHA rồi bấm Đăng ký`);
            }

            if (++count > 20) {
                clearInterval(timer);
                alert("❌ Không tìm thấy form. Có thể Permate đã đổi giao diện.");
            }
        }, 500);
    };
})();
