// ==UserScript==
// @name         Auto Đăng Ký Permate v1.7.2-debug (Mobile/Cloud Fix)
// @namespace    https://permate.com/
// @version      1.7.2
// @description  Điền form Permate, in log nếu lỗi selector, tương thích cloud/mobile
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const gui = document.createElement("div");
    gui.innerHTML = `<button id="autoPermate" style="padding:8px 12px;background:#43a047;color:#fff;border:none;border-radius:6px;font-weight:bold;">🟢 Auto Đăng Ký</button>`;
    gui.style = "position:fixed;top:20px;left:20px;z-index:9999;background:#fff;padding:10px;border-radius:8px;box-shadow:0 0 6px rgba(0,0,0,0.25);";
    document.body.appendChild(gui);

    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const getPhone = () => "09" + Math.floor(10000000 + Math.random() * 89999999);
    const getPassword = () => "Minh" + Math.floor(1000 + Math.random() * 8999) + "!";

    const simulateTyping = (input, value) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    document.getElementById("autoPermate").onclick = () => {
        console.log("🔄 Bắt đầu điền form...");

        const tryFill = () => {
            const first = document.querySelector('input[placeholder="Nhập tên"]');
            const last = document.querySelector('input[placeholder="Nhập họ"]');
            const email = document.querySelector('input[placeholder="Nhập email"]');
            const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
            const passList = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');

            if (!first || !last || !email || !phone || passList.length < 2) {
                console.warn("⚠️ Không tìm thấy đủ input, đang đợi...");
                return false;
            }

            console.log("✅ Tìm thấy input. Bắt đầu nhập...");

            const ho = "Nguyen";
            const ten = "Minh" + rand(3);
            const fakeEmail = `s.${rand(3)}.${rand(2)}.${rand(2)}@gmailos.com`;
            const phoneNum = getPhone();
            const pw = getPassword();

            simulateTyping(first, ten);
            simulateTyping(last, ho);
            simulateTyping(email, fakeEmail);
            simulateTyping(phone, phoneNum);
            simulateTyping(passList[0], pw);
            simulateTyping(passList[1], pw);

            console.log(`📨 Email: ${fakeEmail}, 🔑 Pass: ${pw}`);
            alert(`✅ Điền xong!\n📧 ${fakeEmail}\n📱 ${phoneNum}\n🔐 ${pw}`);
            return true;
        };

        let tries = 0;
        const loop = setInterval(() => {
            tries++;
            if (tryFill()) clearInterval(loop);
            if (tries > 20) {
                alert("❌ Không tìm thấy input sau 10 giây!");
                clearInterval(loop);
            }
        }, 500);
    };
})();
