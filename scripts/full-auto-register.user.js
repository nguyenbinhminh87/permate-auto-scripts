// ==UserScript==
// @name         Permate Full Auto v2.0 (with Full GUI)
// @namespace    https://permate.com/
// @version      2.0
// @description  Tự động đăng ký, xác minh OTP, đăng nhập + GUI đầy đủ từ A-Z
// @match        https://permate.com/auth/partner/sign-up
// @match        https://permate.com/auth/verify-email*
// @match        https://permate.com/auth/login
// @grant        none
// ==/UserScript==

(function () {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const password = 'Minhconbo123';

  function createMainGUI(email, phone) {
    const box = document.createElement('div');
    box.id = 'permate-gui';
    box.style = `
      position:fixed;top:20px;left:20px;z-index:9999;
      background:#111;color:#fff;padding:12px;
      border-radius:10px;font-size:14px;line-height:1.6;
      box-shadow:0 0 10px #000;width:260px;
    `;
    box.innerHTML = `
      <b>👤 Permate Auto GUI</b><br>
      <div>Email: <code>${email}</code></div>
      <div>Pass: <code>${password}</code></div>
      <div>SĐT: <code>${phone}</code></div>
      <button id="startRegister" style="margin-top:8px;padding:6px;width:100%;">🚀 Auto Đăng Ký</button>
    `;
    document.body.appendChild(box);
  }

  async function autoRegisterFlow() {
    const email = 'minhconbo' + Math.floor(Math.random() * 999999) + '@gmailos.com';
    const phone = '09' + Math.floor(Math.random() * 100000000);

    localStorage.setItem('perm_email', email);
    localStorage.setItem('perm_pass', password);
    localStorage.setItem('perm_phone', phone);

    const input = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    await delay(1000);
    input('input[name="name"]', 'Minh Con Bò');
    input('input[name="phone"]', phone);
    input('input[name="email"]', email);
    input('input[name="password"]', password);
    await delay(500);
    document.querySelector('button[type="submit"]')?.click();
  }

  async function createOTPGUI(email) {
    const username = email.split('@')[0];
    const otpBox = document.createElement('div');
    otpBox.id = 'otp-gui';
    otpBox.style = `
      position:fixed;top:20px;right:20px;z-index:9999;
      background:#111;color:#fff;padding:10px;border-radius:10px;
      font-size:14px;width:250px;
    `;
    otpBox.innerHTML = `
      <b>🔐 OTP cho:</b><br><code>${email}</code><br>
      <button id="fetchOtp" style="margin-top:6px;padding:5px;width:100%;">📥 Dán mã OTP</button>
      <div id="otpResult" style="color:#0f0;margin-top:6px;"></div>
    `;
    document.body.appendChild(otpBox);

    document.getElementById('fetchOtp').onclick = async () => {
      const code = await getOTP(username);
      if (code) {
        const otpInput = document.querySelector('input[name="code"]');
        const submitBtn = document.querySelector('button[type="submit"]');
        otpInput.value = code;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('otpResult').innerText = '✅ OTP: ' + code;
        await delay(300);
        submitBtn?.click();
      } else {
        document.getElementById('otpResult').innerText = '❌ Không tìm thấy OTP';
      }
    };

    // Auto paste OTP
    for (let i = 0; i < 20; i++) {
      const code = await getOTP(username);
      if (code) {
        document.querySelector('input[name="code"]').value = code;
        document.querySelector('input[name="code"]').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('button[type="submit"]')?.click();
        document.getElementById('otpResult').innerText = '✅ OTP: ' + code;
        break;
      }
      await delay(3000);
    }
  }

  async function getOTP(username) {
    try {
      const res = await fetch(`https://gmailos.com/api/emails/${username}`);
      const data = await res.json();
      return data?.[0]?.body?.match(/\d{6}/)?.[0] || null;
    } catch {
      return null;
    }
  }

  async function autoLogin() {
    const email = localStorage.getItem('perm_email');
    const pass = localStorage.getItem('perm_pass');

    const input = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    await delay(800);
    input('input[name="email"]', email);
    input('input[name="password"]', pass);
    await delay(400);
    document.querySelector('button[type="submit"]')?.click();
  }

  // Run GUI per page
  if (location.href.includes('/sign-up')) {
    const email = 'minhconbo' + Math.floor(Math.random() * 999999) + '@gmailos.com';
    const phone = '09' + Math.floor(Math.random() * 100000000);
    createMainGUI(email, phone);
    document.addEventListener('click', e => {
      if (e.target.id === 'startRegister') autoRegisterFlow();
    });
  }

  if (location.href.includes('/verify-email')) {
    const email = localStorage.getItem('perm_email') || 'N/A';
    createOTPGUI(email);
  }

  if (location.href.includes('/login')) {
    autoLogin();
  }
})();
