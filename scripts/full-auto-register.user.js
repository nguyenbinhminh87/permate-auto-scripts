// ==UserScript==
// @name         Auto Đăng Ký Permate GUI v1.6 FIX
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto điền form partner Permate (đã sửa selector), có GUI nút bấm, random tên/sdt/email/pass ✅
// @author       Minhconbo
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Giao diện đơn giản
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

    // Hàm random
    const randomStr = (length = 4) => Math.random().toString(36).substring(2, 2 + length);

    document.getElementById("regBtn").onclick = () => {
        const ho = "Nguyen";
        const ten = "Minh" + randomStr();
        const email = (ho + ten).toLowerCase() + "@yopmail.com";
        const password = "Minh1234!";
        const sdt = "09" + Math.floor(10000000 + Math.random() * 89999999);

        try {
            document.querySelector('input[name="lastName"]').value = ho;
            document.querySelector('input[name="firstName"]').value = ten;
            document.querySelector('input[name="email"]').value = email;
            document.querySelector('input[name="phoneNumber"]').value = sdt;
            document.querySelector('input[name="password"]').value = password;
            document.querySelector('input[name="password_confirmation"]').value = password;

            alert("✅ Đã điền xong. Tick CAPTCHA rồi bấm Đăng ký!");
        } catch (e) {
            alert("❌ Form chưa load xong hoặc selector sai.");
        }
    };
})();
