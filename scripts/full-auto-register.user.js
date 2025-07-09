// ==UserScript==
// @name         Auto Đăng Ký Permate v1.7.1 (Fix Bắt Buộc Cứng)
// @namespace    https://permate.com/
// @version      1.7.1
// @description  Điền form như người thật để không bị lỗi "bắt buộc", dùng email @gmailos.com.
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const gui = document.createElement("div");
    gui.innerHTML = `<button id="autoPermate" style="padding:8px 12px;background:#2e7d32;color:#fff;border:none;border-radius:6px;font-weight:bold;">🟢 Auto Đăng Ký</button>`;
    gui.style = "position:fixed;top:20px;left:20px;z-index:9999;background:#fff;padding:10px;border-radius:8px;box-shadow:0 0 6px rgba(0,0,0,0.25);";
    document.body.appendChild(gui);

    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const getPhone = () => "09" + Math.floor(10000000 + Math.random() * 89999999);
    const getPassword = () => "Minh" + Math.floor(1000 + Math.random() * 8999) + "!";

    const simulateTyping = (input, value) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    document.getElementById("autoPermate").onclick = () => {
        let wait = 0;

        const interval = setInterval(() => {
            const first = document.querySelector('input[placeholder="Nhập tên"]');
            const last = document.querySelector('input[placeholder="Nhập họ"]');
            const email = document.querySelector('input[placeholder="Nhập email"]');
            const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
            const passList = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');

            if (first && last && email && phone && passList.length >= 2) {
                const ho = "Nguyen";
                const ten = "Minh" + rand(4);
                const fullEmail = (ho + ten).toLowerCase() + "@gmailos.com";
                const phoneNum = getPhone();
                const pw = getPassword();

                simulateTyping(first, ten);
                simulateTyping(last, ho);
                simulateTyping(email, fullEmail);
                simulateTyping(phone, phoneNum);
                simulateTyping(passList[0], pw);
                simulateTyping(passList[1], pw);

                clearInterval(interval);
                alert(`✅ Đã điền form xong!\n📨 Email: ${fullEmail}\n🔑 Mật khẩu: ${pw}\n🧩 Tick captcha và bấm Đăng ký`);
            }

            if (++wait > 20) {
                clearInterval(interval);
                alert("❌ Không tìm thấy form sau 10 giây.");
            }
        }, 500);
    };
})();
