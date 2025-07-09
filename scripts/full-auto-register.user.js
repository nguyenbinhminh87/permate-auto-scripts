// ==UserScript==
// @name         Permate Auto Register v1.8.3
// @namespace    https://permate.com/
// @version      1.8.3
// @description  Đăng ký Permate tự động với email @maildim.com ✔️ Auto mở tab maildim.com để lấy OTP ✔️ Có GUI "Auto Đăng Ký" ✔️ Không kèm OTP tự dán (đang tách riêng)
// @author       Minhconbo
// @match        https://permate.com/auth/partner/sign-up
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function generateRandomEmail() {
        const prefix = Math.random().toString(36).substring(2, 10);
        return prefix + "@maildim.com";
    }

    function simulateInput(el, value) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function autoRegister() {
        const nameField = document.querySelector('input[name="full_name"]');
        const emailField = document.querySelector('input[name="email"]');
        const passwordField = document.querySelector('input[name="password"]');
        const confirmField = document.querySelector('input[name="confirm_password"]');
        const submitBtn = document.querySelector('button[type="submit"]');

        if (nameField && emailField && passwordField && confirmField) {
            const randomEmail = generateRandomEmail();
            const fullName = "Minhconbo™ " + Math.floor(Math.random() * 10000);
            const password = "12345678";

            simulateInput(nameField, fullName);
            simulateInput(emailField, randomEmail);
            simulateInput(passwordField, password);
            simulateInput(confirmField, password);

            localStorage.setItem("permate_last_email", randomEmail);

            if (submitBtn) {
                setTimeout(() => {
                    submitBtn.click();
                    // Mở tab maildim sau khi submit
                    setTimeout(() => {
                        window.open("https://maildim.com/", "_blank");
                    }, 1000);
                }, 800);
            }
        } else {
            alert("❌ Không tìm thấy trường nhập – Có thể DOM đã đổi.");
        }
    }

    function createGUI() {
        const gui = document.createElement("div");
        gui.innerHTML = `
            <div id="autoRegGui" style="position: fixed; bottom: 20px; left: 20px; background: #222; color: white; padding: 10px 15px; border-radius: 12px; z-index: 9999; box-shadow: 0 0 8px rgba(0,0,0,0.4); font-size: 14px;">
                ✅ Permate Auto Reg v1.8.3<br>
                <button id="autoRegBtn" style="margin-top: 6px; padding: 5px 10px; background: #00c851; border: none; border-radius: 6px; color: white;">Auto Đăng Ký</button>
            </div>
        `;
        document.body.appendChild(gui);
        document.getElementById("autoRegBtn").onclick = autoRegister;
    }

    window.addEventListener("load", () => {
        setTimeout(() => createGUI(), 1000);
    });
})();
