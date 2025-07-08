// ==UserScript==
// @name         Quản lý tài khoản Permate
// @namespace    https://permate.com/
// @version      1.0
// @description  Hiển thị và quản lý danh sách tài khoản Permate đã lưu
// @match        https://permate.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tạo nút mở giao diện quản lý
    const btn = document.createElement("button");
    btn.innerText = "📂 Quản lý ACC Permate";
    Object.assign(btn.style, {
        position: "fixed", top: "10px", right: "10px", zIndex: 9999,
        padding: "8px 12px", background: "#4CAF50", color: "#fff",
        border: "none", borderRadius: "8px", cursor: "pointer"
    });
    document.body.appendChild(btn);

    btn.onclick = () => {
        const accs = JSON.parse(localStorage.getItem("permate_accounts") || "[]");

        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed", top: "60px", right: "10px", zIndex: 9999,
            background: "#fff", padding: "12px", border: "1px solid #ccc",
            borderRadius: "10px", maxHeight: "400px", overflowY: "auto",
            width: "300px", fontFamily: "Arial, sans-serif"
        });

        container.innerHTML = `<h3>📋 Tài khoản đã lưu (${accs.length})</h3>`;

        if (!accs.length) {
            container.innerHTML += "<p><i>Chưa có tài khoản nào.</i></p>";
        } else {
            accs.forEach((acc, i) => {
                const accDiv = document.createElement("div");
                Object.assign(accDiv.style, {
                    marginBottom: "10px", padding: "6px",
                    border: "1px solid #eee", borderRadius: "6px",
                    background: "#f9f9f9"
                });

                accDiv.innerHTML = `
                    <b>${acc.email}</b><br>
                    <code>${acc.password}</code><br>
                    <button onclick="copyToClipboard('${acc.email} / ${acc.password}')">📋 Copy</button>
                    <button onclick="deleteOne(${i})">❌ Xoá</button>
                `;
                container.appendChild(accDiv);
            });

            container.innerHTML += `<button onclick="deleteAll()" style="margin-top:10px;background:red;color:white;padding:5px 10px;border-radius:6px;">🧹 Xoá TẤT CẢ</button>`;
        }

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Đóng";
        closeBtn.style.display = "block";
        closeBtn.style.marginTop = "10px";
        closeBtn.onclick = () => container.remove();
        container.appendChild(closeBtn);

        document.body.appendChild(container);
    };

    // 📋 Copy acc
    window.copyToClipboard = text => {
        navigator.clipboard.writeText(text);
        alert("📋 Đã copy: " + text);
    };

    // ❌ Xoá 1 acc
    window.deleteOne = index => {
        const accs = JSON.parse(localStorage.getItem("permate_accounts") || "[]");
        accs.splice(index, 1);
        localStorage.setItem("permate_accounts", JSON.stringify(accs));
        location.reload();
    };

    // 🧹 Xoá toàn bộ acc
    window.deleteAll = () => {
        if (confirm("⚠️ Bạn chắc chắn muốn xoá toàn bộ tài khoản đã lưu?")) {
            localStorage.removeItem("permate_accounts");
            location.reload();
        }
    };
})();
