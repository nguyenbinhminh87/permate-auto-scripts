// ==UserScript==
// @name         FULL Auto Register Permate (Minhconbo Edition)
// @namespace    https://permate.com/
// @version      2.0
// @description  Tự động tạo acc Permate + OTP + Lưu tài khoản
// @match        https://permate.com/auth/sign-up*
// @match        https://permate.com/auth/verify*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ⚙️ Nhập số điện thoại thật ở đây để nhận OTP
    const yourPhone = "0987654321";

    // 📦 Random chuỗi ký tự
    function randomString(length) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 💾 Lưu acc vào localStorage
    function saveAccount(email, password) {
        const accList = JSON.parse(localStorage.getItem("permate_accounts") || "[]");
        accList.push({ email, password });
        localStorage.setItem("permate_accounts", JSON.stringify(accList));
        alert(`✅ Đã lưu tài khoản:\n${email} / ${password}`);
    }

    // 👉 Auto điền thông tin khi ở trang Đăng ký
    if (window.location.href.includes("/auth/sign-up")) {
        window.onload = () => {
            const name = "Minhconbo_" + randomString(5);
            const email = "minhconbo_" + randomString(6) + "@gmail.com";
            const password = "MK_" + randomString(8);

            document.querySelector('input[name="name"]').value = name;
            document.querySelector('input[name="email"]').value = email;
            document.querySelector('input[name="password"]').value = password;
            document.querySelector('input[name="phone"]').value = yourPhone;

            // Tự nhấn nút đăng ký
            setTimeout(() => {
                const btn = document.querySelector('button[type="submit"]');
                if (btn) btn.click();
            }, 1500);

            // Lưu acc tạm để dùng ở bước xác minh
            localStorage.setItem("current_account", JSON.stringify({ email, password }));
        };
    }

    // 👉 Tự điền mã OTP nếu đang ở trang xác minh
    if (window.location.href.includes("/auth/verify")) {
        window.onload = () => {
            const otp = prompt("📲 Nhập mã OTP bạn vừa nhận qua SMS:");
            const input = document.querySelector('input[name="code"]');
            const btn = document.querySelector('button[type="submit"]');

            if (otp && otp.length >= 4 && input && btn) {
                input.value = otp;
                setTimeout(() => btn.click(), 800);
            }

            // Sau khi nhập xong, lưu acc vào danh sách chính
            const account = JSON.parse(localStorage.getItem("current_account") || "{}");
            if (account.email) {
                saveAccount(account.email, account.password);
            }
        };
    }
})();
