// ==UserScript==
// @name         Permate Vertexium Info GUI v1.0
// @version      1.0
// @description  Hiển thị email dạng @55.vertexium.net + mật khẩu Minh@123 + sao chép nhanh ✔️ Mở link inbox ✔️ Cho Minhconbo 😤
// @match        https://permate.com/auth/partner/sign-up*
// @grant        none
// ==/UserScript==

(function () {
    const prefix = Math.random().toString(36).substring(2, 10);
    const email = `${prefix}@55.vertexium.net`;
    const password = "Minh@123";

    const inboxLink = `https://viewmail.55.vertexium.net/mailbox/${prefix}`;

    function createGUI() {
        const box = document.createElement("div");
        box.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: #111; color: white; padding: 14px 16px; border-radius: 12px; z-index: 9999; box-shadow: 0 0 8px black; font-size: 14px; max-width: 270px;">
            <b>📩 Tài khoản đăng ký Permate</b><br><br>

            <b>📧 Email:</b><br>
            <span>${email}</span><br>
            <button onclick="navigator.clipboard.writeText('${email}').then(()=>alert('📋 Gmail đã sao chép'))" style="margin-top:4px;background:#444;color:white;border:none;padding:4px 8px;border-radius:6px;">📋 Sao chép Gmail</button><br><br>

            <b>🔐 Mật khẩu:</b><br>
            <span>${password}</span><br>
            <button onclick="navigator.clipboard.writeText('${password}').then(()=>alert('📋 Mật khẩu đã sao chép'))" style="margin-top:4px;background:#444;color:white;border:none;padding:4px 8px;border-radius:6px;">📋 Sao chép Mật khẩu</button><br><br>

            <a href="${inboxLink}" target="_blank" style="color:#00c851;">📬 Mở hộp thư Vertexium</a>
        </div>`;
        document.body.appendChild(box);
    }

    window.addEventListener("load", () => {
        setTimeout(createGUI, 1000);
    });
})();
