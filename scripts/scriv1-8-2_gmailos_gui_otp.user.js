// ==UserScript==
// @name         Auto Register Permate v1.8.3 (Open Gmailos Web)
// @namespace    https://permate.com/
// @version      1.8.3
// @description  Tự điền form, mở Gmailos.com để bạn tự xem mã OTP. Không GUI, không tự dán mã.
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const simulateInput = (el, value) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    if (location.href.includes("/auth/partner/sign-up")) {
        const interval = setInterval(() => {
            const first = document.querySelector('input[placeholder="Nhập tên"]');
            const last = document.querySelector('input[placeholder="Nhập họ"]');
            const email = document.querySelector('input[placeholder="Nhập email"]');
            const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
            const passwords = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');
            const btn = document.querySelector('button[type=submit]');

            if (!first || !last || !email || !phone || passwords.length < 2 || !btn) return;

            clearInterval(interval);

            const ho = "Nguyen";
            const ten = "Minh" + rand(3);
            const mail = `minhconbo${rand(4)}@gmailos.com`;
            const phoneNum = "09" + Math.floor(10000000 + Math.random() * 89999999);
            const pw = "Minh" + rand(4) + "!";

            simulateInput(first, ten);
            simulateInput(last, ho);
            simulateInput(email, mail);
            simulateInput(phone, phoneNum);
            simulateInput(passwords[0], pw);
            simulateInput(passwords[1], pw);

            localStorage.setItem("permEmail", mail);

            setTimeout(() => btn.click(), 1500); // nhấn nút sau khi điền
        }, 1000);
    }

    // Mở tab gmailos.com khi sang trang xác minh
    if (location.href.includes("/auth/email-verification")) {
        const email = localStorage.getItem("permEmail");
        if (email) {
            const gmailUrl = `https://gmailnator.com`;
            setTimeout(() => {
                window.open(gmailUrl, "_blank");
            }, 1500);
        }
    }
})();
