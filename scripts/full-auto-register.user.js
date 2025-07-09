// ==UserScript==
// @name         Permate Auto Register v1.8.5
// @namespace    https://permate.com/
// @version      1.8.5
// @description  Auto đăng ký Permate dùng @maildim.com ✔️ Mở tab maildim ✔️ Chống lỗi không load form ✔️ GUI luôn hoạt động ✔️ Full hỗ trợ mobile/permate chậm DOM load ✔️ Không kèm OTP dán tự động (riêng v2.3 sau nhé)
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

    function waitForFormReady(callback, timeout = 15000) {
        const start = Date.now();
        const check = setInterval(() => {
            const name = document.querySelector('input[name="full_name"]');
            const email = document.querySelector('input[name="email"]');
            const pass = document.querySelector('input[name="password"]');
            const confirm = document.querySelector('input[name="confirm_password"]');
            const submit = document.querySelector('button[type="submit"]');

            if (name && email && pass && confirm && submit) {
                clearInterval(check);
                callback({ name, email, pass, confirm, submit });
            }

            if (Date.now() - start > timeout) {
                clearInterval(check);
                alert("❌ Form không load kịp! Có thể do mạng hoặc web delay.");
            }
        }, 500);
    }

    function autoRegister() {
        waitForFormReady(({ name, email, pass, confirm, submit }) => {
            const randEmail = generateRandomEmail();
            const fullName = "Minhconbo™ " + Math.floor(Math.random() * 9999);
            const password = "12345678";

            simulateInput(name, fullName);
            simulateInput(email, randEmail);
            simulateInput(pass, password);
            simulateInput(confirm, password);

            localStorage.setItem("permate_last_email", randEmail);

            setTimeout(() => {
                submit.click();
                setTimeout(() => {
                    window.open("https://maildim.com/", "_blank");
                }, 1000);
            }, 800);
        });
    }

    function createGUI() {
        const gui = document.createElement("div");
        gui.innerHTML = `
            <div id="autoRegGui" style="position: fixed; bottom: 20px; left: 20px; background: #1d1d1d; color: white; padding: 12px 16px; border-radius: 12px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-size: 14px;">
                🔄 <b>Permate Auto Reg v1.8.5</b><br>
                <button id="autoRegBtn" style="margin-top: 8px; padding: 6px 12px; background: #00c851; border: none; border-radius: 6px; color: white;">Auto Đăng Ký</button>
            </div>
        `;
        document.body.appendChild(gui);
        document.getElementById("autoRegBtn").onclick = autoRegister;
    }

    // Đợi toàn bộ load xong (SPA delay + DOM ổn định)
    window.addEventListener("load", () => {
        setTimeout(() => createGUI(), 1500);
    });
})();
