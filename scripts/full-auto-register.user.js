// ==UserScript==
// @name         Auto Đăng Ký Permate GUI v1.6.1
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Auto điền form Permate có GUI và tự đợi form render (fix lỗi chưa load) ✅
// @author       Minhconbo
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Giao diện
    const gui = document.createElement('div');
    gui.style = `
        position: fixed;
        top: 20px; left: 20px;
        background: #fff;
        border: 2px solid #000;
        padding: 10px;
        z-index: 9999;
        font-family: sans-serif;
        border-radius: 8px;
    `;
    gui.innerHTML = `
        <h4 style="margin:0 0 10px;">Auto Reg v1.6.1</h4>
        <button id="regBtn" style="padding:5px 10px;">Auto Đăng Ký</button>
    `;
    document.body.appendChild(gui);

    // Hàm random chuỗi
    const randomStr = (length = 5) => Math.random().toString(36).substring(2, 2 + length);

    // Bắt sự kiện click nút
    document.getElementById("regBtn").onclick = () => {
        let attempts = 0;

        const checkForm = setInterval(() => {
            const last = document.querySelector('input[name="lastName"]');
            const first = document.querySelector('input[name="firstName"]');
            const email = document.querySelector('input[name="email"]');
            const phone = document.querySelector('input[name="phoneNumber"]');
            const pass = document.querySelector('input[name="password"]');
            const pass2 = document.querySelector('input[name="password_confirmation"]');

            if (last && first && email && phone && pass && pass2) {
                const ho = "Nguyen";
                const ten = "Minh" + randomStr();
                const mail = (ho + ten).toLowerCase() + "@yopmail.com";
                const sdt = "09" + Math.floor(10000000 + Math.random() * 89999999);
                const pw = "Minh1234!";

                last.value = ho;
                first.value = ten;
                email.value = mail;
                phone.value = sdt;
                pass.value = pw;
                pass2.value = pw;

                clearInterval(checkForm);
                alert("✅ Form đã được điền, tick CAPTCHA và bấm Đăng ký!");
            }

            if (++attempts > 20) {
                clearInterval(checkForm);
                alert("❌ Form không load được sau 10 giây!");
            }
        }, 500);
    };
})();
