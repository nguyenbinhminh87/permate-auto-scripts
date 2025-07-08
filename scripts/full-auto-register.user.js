// ==UserScript==
// @name         Tạo ACC Permate khi bấm nút
// @namespace    https://permate.com/
// @version      1.5
// @description  Bấm nút để tạo tài khoản Permate, tránh lỗi auto chạy
// @match        https://permate.com/auth/sign-up*
// @match        https://permate.com/auth/verify*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const yourPhone = "0987654321";

    function randomString(length) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    }

    function saveAccount(email, password) {
        const accList = JSON.parse(localStorage.getItem("permate_accounts") || "[]");
        accList.push({ email, password });
        localStorage.setItem("permate_accounts", JSON.stringify(accList));
        alert(`✅ Đã lưu: ${email} / ${password}`);
    }

    // ---------------- SIGN-UP PAGE ----------------
    if (location.href.includes("/auth/sign-up")) {
        window.onload = () => {
            const createBtn = document.createElement("button");
            createBtn.innerText = "🚀 Tạo tài khoản Permate";
            Object.assign(createBtn.style, {
                position: "fixed", top: "10px", left: "10px", zIndex: 9999,
                background: "#007bff", color: "#fff", border: "none",
                padding: "10px 14px", borderRadius: "8px", cursor: "pointer"
            });
            document.body.appendChild(createBtn);

            createBtn.onclick = () => {
                const name = "Minhconbo_" + randomString(5);
                const email = "minhconbo_" + randomString(6) + "@gmail.com";
                const password = "MK_" + randomString(8);

                document.querySelector('input[name="name"]').value = name;
                document.querySelector('input[name="email"]').value = email;
                document.querySelector('input[name="password"]').value = password;
                document.querySelector('input[name="phone"]').value = yourPhone;

                localStorage.setItem("current_account", JSON.stringify({ email, password }));

                setTimeout(() => {
                    const btn = document.querySelector('button[type="submit"]');
                    if (btn) btn.click();
                }, 1000);
            };
        };
    }

    // ---------------- VERIFY PAGE ----------------
    if (location.href.includes("/auth/verify")) {
        window.onload = () => {
            const account = JSON.parse(localStorage.getItem("current_account") || "{}");
            const otp = prompt(`📲 Nhập OTP cho ${account.email}:`);
            const input = document.querySelector('input[name="code"]');
            const btn = document.querySelector('button[type="submit"]');

            if (otp && otp.length >= 4 && input && btn) {
                input.value = otp;
                setTimeout(() => btn.click(), 800);
            }

            if (account.email) {
                saveAccount(account.email, account.password);
            }
        };
    }
})();
