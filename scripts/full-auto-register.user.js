// ==UserScript==
// @name         Auto Đăng Ký Permate v1.8.1 + GUI OTP
// @namespace    https://permate.com/
// @version      1.8.1
// @description  Tự động điền form Permate + Tự động nhập OTP vào 6 ô input
// @match        https://permate.com/auth/partner/sign-up*
// @match        https://permate.com/auth/email-verification*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const GUI = document.createElement("div");
    GUI.innerHTML = `
    <button id="autoReg" style="padding:8px 12px;margin-right:8px;background:#4caf50;color:#fff;border:none;border-radius:6px;font-weight:bold;">🟢 Auto Đăng Ký</button>
    <button id="autoOtp" style="padding:8px 12px;background:#2196f3;color:#fff;border:none;border-radius:6px;font-weight:bold;">🧩 Auto OTP</button>
    `;
    GUI.style = "position:fixed;top:15px;left:15px;z-index:9999;background:#fff;padding:10px;border-radius:8px;box-shadow:0 0 6px rgba(0,0,0,0.25);";
    document.body.appendChild(GUI);

    const rand = len => Math.random().toString(36).substring(2, 2 + len);
    const simulateInput = (el, value) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    const getRandomEmail = () => {
        const email = `s.${rand(3)}.${rand(2)}.${rand(2)}@mail.tm`;
        localStorage.setItem("perm_last_email", email);
        return email;
    };

    const getStoredEmail = () => localStorage.getItem("perm_last_email") || "";

    const fillForm = () => {
        const first = document.querySelector('input[placeholder="Nhập tên"]');
        const last = document.querySelector('input[placeholder="Nhập họ"]');
        const email = document.querySelector('input[placeholder="Nhập email"]');
        const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]');
        const passwords = document.querySelectorAll('input[placeholder="Nhập mật khẩu"]');

        if (!first || !last || !email || !phone || passwords.length < 2) {
            alert("❌ Không tìm thấy đầy đủ các ô input");
            return;
        }

        const ten = "Minh" + rand(3);
        const ho = "Nguyen";
        const mail = getRandomEmail();
        const phoneNum = "09" + Math.floor(10000000 + Math.random() * 89999999);
        const pw = "Minh" + rand(4) + "!";

        simulateInput(first, ten);
        simulateInput(last, ho);
        simulateInput(email, mail);
        simulateInput(phone, phoneNum);
        simulateInput(passwords[0], pw);
        simulateInput(passwords[1], pw);

        alert(`✅ Điền xong form\n📧 ${mail}\n📱 ${phoneNum}\n🔐 ${pw}`);

        setTimeout(() => {
            window.open("https://mail.tm/en", "_blank");
        }, 1000);
    };

    const autoFillOtp = async () => {
        const email = getStoredEmail();
        if (!email) {
            alert("❌ Không tìm thấy email đã dùng để đăng ký!");
            return;
        }

        const login = async () => {
            const res = await fetch("https://api.mail.tm/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: email, password: "123456" })
            });

            if (res.status !== 201 && res.status !== 200) return null;
            const tokenRes = await fetch("https://api.mail.tm/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: email, password: "123456" })
            });
            const tokenData = await tokenRes.json();
            return tokenData.token;
        };

        const token = await login();
        if (!token) {
            alert("❌ Không đăng nhập được vào mail.tm API");
            return;
        }

        const messagesRes = await fetch("https://api.mail.tm/messages", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const messages = await messagesRes.json();
        const latest = messages["hydra:member"]?.[0];

        if (!latest) {
            alert("❌ Không tìm thấy email nào");
            return;
        }

        const detailRes = await fetch(`https://api.mail.tm/messages/${latest.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const detail = await detailRes.json();
        const codeMatch = detail.text.match(/\d{6}/);

        if (!codeMatch) {
            alert("❌ Không tìm thấy mã OTP trong email");
            return;
        }

        const otp = codeMatch[0].split("");
        const inputs = document.querySelectorAll('input[type="tel"]');
        if (inputs.length < 6) {
            alert("❌ Không tìm thấy đủ 6 ô nhập mã");
            return;
        }

        otp.forEach((digit, i) => simulateInput(inputs[i], digit));
        alert(`✅ Nhập xong mã: ${otp.join("")}`);
    };

    document.getElementById("autoReg").onclick = fillForm;
    document.getElementById("autoOtp").onclick = autoFillOtp;
})();
