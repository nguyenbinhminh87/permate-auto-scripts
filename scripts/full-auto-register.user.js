// ==UserScript==
// @name         Auto Đăng Ký Permate v1.6.3 (Final Fix)
// @namespace    https://permate.com/
// @version      1.6.3
// @description  Điền auto form đăng ký Permate thị trường Việt Nam ✔️ Có nút GUI, auto đợi form load, random hợp lệ
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tạo nút giao diện
    const box = document.createElement("div");
    box.innerHTML = `<button id="autoPermate" style="padding:6px 10px;background:#d00;color:#fff;border:none;border-radius:6px;font-weight:bold;">Auto Đăng Ký Permate</button>`;
    box.style = "position:fixed;top:20px;left:20px;z-index:9999;background:#fff;padding:10px;border-radius:8px;box-shadow:0 0 5px rgba(0,0,0,0.2);";
    document.body.appendChild(box);

    // Random helper
    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const getPhone = () => "09" + Math.floor(10000000 + Math.random() * 89999999);
    const getPassword = () => "Minh" + Math.floor(1000 + Math.random() * 8999) + "!";

    // Khi bấm nút
    document.getElementById("autoPermate").onclick = () => {
        let count = 0;

        const interval = setInterval(() => {
            const first = document.querySelector('input[placeholder="Nhập tên"]');
            const last = document.querySelector('input[placeholder="Nhập họ"]');
            const email = document.querySelector('input[placeholder="Nhập email"]');
            const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
            const pass = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');
            const confirm = document.querySelector('input[placeholder="Nhập mật khẩu"] ~ input');

            if (first && last && email && phone && pass.length >= 1) {
                const ho = "Nguyen";
                const ten = "Minh" + rand(3);
                const mail = (ho + ten).toLowerCase() + "@yopmail.com";
                const sdt = getPhone();
                const pw = getPassword();

                first.value = ten;
                last.value = ho;
                email.value = mail;
                phone.value = sdt;
                pass[0].value = pw;
                pass[1].value = pw;

                clearInterval(interval);
                alert("✅ Form đã được điền xong!\n👉 Tick CAPTCHA → Bấm Đăng ký!");
            }

            if (++count > 20) {
                clearInterval(interval);
                alert("❌ Không tìm thấy form sau 10 giây.");
            }
        }, 500);
    };
})();
