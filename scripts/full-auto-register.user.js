// ==UserScript==
// @name         Permate Auto Reg v1.6.2 (Stable)
// @namespace    https://permate.com/
// @version      1.6.2
// @description  Điền tự động form đối tác Permate, auto đợi form hiển thị rồi điền vào các trường chính xác. Có nút bấm GUI. Fix hoàn toàn lỗi không load được form ✅
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Tạo GUI
    const box = document.createElement("div");
    box.innerHTML = `<button id="minhReg" style="padding:6px 10px;background:#222;color:#fff;border:none;border-radius:5px;">Auto Đăng Ký Permate</button>`;
    box.style = "position:fixed;top:20px;left:20px;z-index:9999;background:#fff;padding:10px;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);";
    document.body.appendChild(box);

    // Random hỗ trợ
    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const getRandomPhone = () => "09" + Math.floor(10000000 + Math.random() * 89999999);

    // Xử lý khi bấm nút
    document.getElementById("minhReg").onclick = function() {
        let waitCount = 0;

        const fill = setInterval(() => {
            const first = document.querySelector('input[name="firstName"]');
            const last = document.querySelector('input[name="lastName"]');
            const email = document.querySelector('input[name="email"]');
            const phone = document.querySelector('input[name="phoneNumber"]');
            const pass = document.querySelector('input[name="password"]');
            const confirm = document.querySelector('input[name="password_confirmation"]');

            if (first && last && email && phone && pass && confirm) {
                const ho = "Nguyen", ten = "Minh" + rand(3);
                first.value = ten;
                last.value = ho;
                email.value = (ho + ten).toLowerCase() + "@yopmail.com";
                phone.value = getRandomPhone();
                pass.value = "Minh1234!";
                confirm.value = "Minh1234!";
                clearInterval(fill);
                alert("✅ Đã điền xong. Tick CAPTCHA rồi bấm Đăng ký!");
            }

            if (++waitCount > 20) {
                clearInterval(fill);
                alert("❌ Không tìm thấy form sau 10 giây!");
            }
        }, 500);
    };
})();
