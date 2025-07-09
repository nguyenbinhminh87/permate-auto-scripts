// ==UserScript==
// @name         Permate Auto Login (full-auto-register.user.js)
// @namespace    https://permate.com/
// @version      1.8.4
// @description  Tự động đăng nhập Permate với email @gmailos.com đã đăng ký trước đó
// @match        https://permate.com/auth/login*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const simulateInput = (el, value) => {
        if (!el) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // Tự động login nếu có sẵn email/password
    if (location.href.includes('/auth/login')) {
        const loginInterval = setInterval(() => {
            const emailInput = document.querySelector('input[placeholder="Nhập email"]');
            const passInput = document.querySelector('input[placeholder="Nhập mật khẩu"]');
            const loginBtn = document.querySelector('button[type="submit"]');

            if (!emailInput || !passInput || !loginBtn) return;

            clearInterval(loginInterval);

            // Lấy email/password từ localStorage
            let email = localStorage.getItem("permEmail") || "";
            let password = localStorage.getItem("permPass") || "";

            // Ưu tiên email @gmailos.com
            if (!email.endsWith("@gmailos.com")) {
                const keys = Object.keys(localStorage);
                const matchKey = keys.find(k => localStorage[k].includes("@gmailos.com"));
                if (matchKey) email = localStorage[matchKey];
            }

            // Nếu vẫn không có thì dừng
            if (!email || !password) return console.warn("⚠️ Không tìm thấy email hoặc mật khẩu để login!");

            simulateInput(emailInput, email);
            simulateInput(passInput, password);

            setTimeout(() => loginBtn.click(), 1000);
        }, 1000);
    }
})();
