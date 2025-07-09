// ==UserScript==
// @name         Permate Reg Info Display v1.0
// @version      1.0
// @description  Hiển thị thông tin đăng ký đã tạo sẵn ✔️ Sao chép Gmail + mật khẩu ✔️ Link mở maildim ✔️ Hỗ trợ mobile Quetta/Kiwi ✔️ Dành cho anh Minhconbo 😎
// @match        https://permate.com/auth/partner/sign-up
// @grant        none
// ==/UserScript==

(function () {
    const email = Math.random().toString(36).substring(2, 10) + "@maildim.com";
    const password = "12345678";
    localStorage.setItem("permate_last_email", email);

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("📋 Đã sao chép: " + text);
        });
    }

    function createPanel() {
        const box = document.createElement("div");
        box.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: #111; color: white; padding: 14px 16px; border-radius: 12px; z-index: 9999; box-shadow: 0 0 8px black; font-size: 14px; max-width: 250px;">
            <b>📩 Thông tin đăng ký</b><br><br>
            <b>📧 Gmail:</b><br>
            <span id="regEmail">${email}</span><br>
            <button onclick="navigator.clipboard.writeText('${email}').then(()=>alert('📋 Đã sao chép Gmail'))" style="margin-top:4px; background:#444;color:white;border:none;padding:4px 8px;border-radius:6px;">📋 Sao chép Gmail</button><br><br>

            <b>🔐 Mật khẩu:</b><br>
            <span>${password}</span><br>
            <button onclick="navigator.clipboard.writeText('${password}').then(()=>alert('📋 Đã sao chép mật khẩu'))" style="margin-top:4px; background:#444;color:white;border:none;padding:4px 8px;border-radius:6px;">📋 Sao chép mật khẩu</button><br><br>

            <a href="https://maildim.com/" target="_blank" style="color:#00c851;">📬 Mở maildim.com</a>
        </div>`;
        document.body.appendChild(box);
    }

    window.addEventListener("load", () => {
        setTimeout(() => createPanel(), 1000);
    });
})();
