// ==UserScript==
// @name         Permate Auto Login v1.8.5 (with GUI Toggle)
// @namespace    https://permate.com/auth/partner/sign-up?
// @version      1.8.5
// @description  Tự động đăng nhập vào Permate với email đã đăng ký (ưu tiên @gmailos.com), có giao diện bật/tắt.
// @match        https://permate.com/auth/partner/sign-up?*
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

    const createToggleGUI = () => {
        const toggle = document.createElement('div');
        toggle.style.position = 'fixed';
        toggle.style.bottom = '20px';
        toggle.style.right = '20px';
        toggle.style.background = '#222';
        toggle.style.color = '#0f0';
        toggle.style.padding = '8px 14px';
        toggle.style.borderRadius = '8px';
        toggle.style.zIndex = '9999';
        toggle.style.fontSize = '14px';
        toggle.style.fontFamily = 'monospace';
        toggle.style.cursor = 'pointer';
        toggle.style.userSelect = 'none';
        toggle.id = 'permAutoLoginToggle';

        const state = localStorage.getItem('permAutoLogin') || 'on';
        toggle.innerText = state === 'on' ? '🔓 Auto Login: ON' : '🔒 Auto Login: OFF';

        toggle.onclick = () => {
            const current = localStorage.getItem('permAutoLogin') || 'on';
            const next = current === 'on' ? 'off' : 'on';
            localStorage.setItem('permAutoLogin', next);
            toggle.innerText = next === 'on' ? '🔓 Auto Login: ON' : '🔒 Auto Login: OFF';
        };

        document.body.appendChild(toggle);
    };

    const autoLogin = () => {
        const emailInput = document.querySelector('input[placeholder="Nhập email"]');
        const passInput = document.querySelector('input[placeholder="Nhập mật khẩu"]');
        const loginBtn = document.querySelector('button[type="submit"]');

        if (!emailInput || !passInput || !loginBtn) return;

        let email = localStorage.getItem("permEmail") || "";
        let password = localStorage.getItem("permPass") || "";

        if (!email.endsWith("@gmailos.com")) {
            const keys = Object.keys(localStorage);
            const matchKey = keys.find(k => localStorage[k].includes("@gmailos.com"));
            if (matchKey) email = localStorage[matchKey];
        }

        if (!email || !password) return console.warn("⚠️ Không tìm thấy email hoặc mật khẩu để login!");

        simulateInput(emailInput, email);
        simulateInput(passInput, password);
        setTimeout(() => loginBtn.click(), 1000);
    };

    const init = () => {
        const guiEnabled = document.readyState === 'complete' || document.readyState === 'interactive';
        if (guiEnabled) {
            createToggleGUI();
            const loginState = localStorage.getItem('permAutoLogin') || 'on';
            if (loginState === 'on') {
                const wait = setInterval(() => {
                    const emailInput = document.querySelector('input[placeholder="Nhập email"]');
                    const passInput = document.querySelector('input[placeholder="Nhập mật khẩu"]');
                    const loginBtn = document.querySelector('button[type="submit"]');
                    if (emailInput && passInput && loginBtn) {
                        clearInterval(wait);
                        autoLogin();
                    }
                }, 500);
            }
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }
    };

    init();
})();
