// ==UserScript==
// @name         Auto Đăng Ký Permate v1.8.2 (Gmailos GUI OTP)
// @namespace    https://permate.com/
// @version      1.8.2
// @description  Đăng ký + hiện OTP từ gmailos.com ngay trên màn hình, không mở tab
// @match        https://permate.com/auth/partner/sign-up*
// @match        https://permate.com/auth/email-verification*
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

    const GUI = document.createElement("div");
    GUI.innerHTML = `
    <button id="autoReg" style="padding:8px 12px;margin-right:8px;background:#4caf50;color:#fff;border:none;border-radius:6px;font-weight:bold;">🟢 Auto Đăng Ký</button>
    <button id="autoOtp" style="padding:8px 12px;background:#2196f3;color:#fff;border:none;border-radius:6px;font-weight:bold;">🧩 Auto OTP</button>
    <div id="otpDisplay" style="margin-top:8px;color:#000;font-weight:bold;"></div>`;
    GUI.style = "position:fixed;top:15px;left:15px;z-index:9999;background:#fff;padding:12px;border-radius:10px;box-shadow:0 0 8px rgba(0,0,0,0.3);";
    document.body.appendChild(GUI);

    // Auto đăng ký
    document.getElementById("autoReg").onclick = () => {
        const first = document.querySelector('input[placeholder="Nhập tên"]');
        const last = document.querySelector('input[placeholder="Nhập họ"]');
        const email = document.querySelector('input[placeholder="Nhập email"]');
        const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
        const passwords = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');

        if (!first || !last || !email || !phone || passwords.length < 2) return alert("Không tìm thấy ô input");

        const ho = "Nguyen";
        const ten = "Minh" + rand(3);
        const mail = `s.${rand(3)}.${rand(3)}.${rand(2)}@gmailos.com`;
        const phoneNum = "09" + Math.floor(10000000 + Math.random() * 89999999);
        const pw = "Minh" + rand(4) + "!";

        simulateInput(first, ten);
        simulateInput(last, ho);
        simulateInput(email, mail);
        simulateInput(phone, phoneNum);
        simulateInput(passwords[0], pw);
        simulateInput(passwords[1], pw);

        alert(`📨 Email: ${mail}\n📱 Phone: ${phoneNum}\n🔐 Pass: ${pw}`);
        localStorage.setItem("permEmail", mail);
    };

    // Auto OTP GUI
    document.getElementById("autoOtp").onclick = async () => {
        const email = localStorage.getItem("permEmail");
        if (!email) return alert("Không tìm thấy email đã dùng!");

        const otpDiv = document.getElementById("otpDisplay");
        otpDiv.innerText = "🔎 Đang tìm mã từ gmailos.com...";

        try {
            const html = await fetch(`https://gmailnator.com/inbox/${email}`).then(res => res.text());
            const otpMatch = html.match(/[\s>](\d{6})[\s<]/);
            if (!otpMatch) return (otpDiv.innerText = "❌ Không tìm thấy mã OTP");

            const code = otpMatch[1];
            otpDiv.innerHTML = `📬 Gmailos.com<br><span id="otpCode" style="font-size:20px;color:red;cursor:pointer;">🔐 Mã OTP: ${code}</span>`;

            document.getElementById("otpCode").onclick = () => {
                const inputs = document.querySelectorAll('input[type="tel"]');
                if (inputs.length < 6) return alert("❌ Không tìm thấy đủ 6 ô nhập mã");
                [...code].forEach((c, i) => simulateInput(inputs[i], c));
            };
        } catch (e) {
            otpDiv.innerText = "⚠️ Lỗi khi tải mã OTP";
        }
    };
})();
