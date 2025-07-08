// ==UserScript==
// @name         Auto Đăng Ký Permate GUI v1.6
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Tự động điền form tại trang đăng ký partner Permate, có GUI với nút bấm, random họ tên, email, sdt, mật khẩu mạnh ✔️
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
        <h4 style="margin:0 0 10px;">Auto Reg v1.6</h4>
        <button id="regBtn" style="padding:5px 10px;">Auto Đăng Ký</button>
    `;
    document.body.appendChild(gui);

    // Random chuỗi
    const randomStr = (length = 5) => Math.random().toString(36).substring(2, 2 + length);

    document.getElementById("regBtn").onclick = () => {
        const ho = "Nguyen";
        const ten = "Minh" + randomStr();
        const email = (ho + ten).toLowerCase() + "@yopmail.com";
        const password = "Minh1234!";
        const sdt = "09" + Math.floor(10000000 + Math.random() * 89999999);

        try {
            // Thay đúng tên field của form mới
            document.querySelector('input[name="first_name"]').value = ten;
            document.querySelector('input[name="last_name"]').value = ho;
            document.querySelector('input[name="email"]').value = email;
            document.querySelector('input[name="phone"]').value = sdt;
            document.querySelector('input[name="password"]').value = password;
            document.querySelector('input[name="password_confirmation"]').value = password;

            alert("✅ Form đã được điền. Tick CAPTCHA rồi tự bấm Đăng ký!");
        } catch (e) {
            alert("❌ Không tìm thấy form – có thể selector đã đổi hoặc chưa load xong.");
        }
    };
})();
