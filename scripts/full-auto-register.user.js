// ==UserScript==
// @name         Auto Đăng Ký Permate GUI v1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Tạo tài khoản Permate.com nhanh bằng GUI có nút bấm
// @author       Minhconbo
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ===== TẠO GIAO DIỆN (GUI) =====
    const gui = document.createElement('div');
    gui.style = `
        position: fixed;
        top: 20px; left: 20px;
        background: #fff;
        border: 2px solid #000;
        padding: 10px;
        z-index: 9999;
        font-family: sans-serif;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        border-radius: 8px;
    `;
    gui.innerHTML = `
        <h4 style="margin:0 0 10px;">Auto Reg v1.5</h4>
        <button id="regBtn" style="padding:5px 10px;">Auto Đăng Ký</button>
    `;
    document.body.appendChild(gui);

    // ===== XỬ LÝ AUTO ĐĂNG KÝ =====
    document.getElementById("regBtn").onclick = () => {
        const username = "minhconbo" + Math.floor(Math.random() * 100000);
        const email = username + "@gmail.com";
        const password = "Minh1234";

        const userInput = document.querySelector('input[name="username"]');
        const emailInput = document.querySelector('input[name="email"]');
        const passInput = document.querySelector('input[name="password"]');
        const pass2Input = document.querySelector('input[name="password_confirmation"]');
        const submitBtn = document.querySelector('button[type="submit"]');

        if (userInput && emailInput && passInput && pass2Input && submitBtn) {
            userInput.value = username;
            emailInput.value = email;
            passInput.value = password;
            pass2Input.value = password;

            setTimeout(() => {
                submitBtn.click();
            }, 500);
        } else {
            alert("Không tìm thấy form đăng ký!");
        }
    };
})();
