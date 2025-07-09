// ==UserScript==
// @name         Permate Full Auto v1.9
// @namespace    https://permate.com/
// @version      1.9
// @description  Đăng ký, nhận OTP, xác minh và đăng nhập tự động
// @match        https://permate.com/auth/partner/sign-up
// @match        https://permate.com/auth/verify-email*
// @match        https://permate.com/auth/login
// @grant        none
// ==/UserScript==

(function() {
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  const randEmail = () => 'minhconbo' + Math.floor(Math.random() * 999999) + '@gmailos.com';
  const password = 'Minhconbo123';

  async function autoRegister() {
    if (!location.href.includes('/sign-up')) return;

    const email = randEmail();
    localStorage.setItem('perm_email', email);
    localStorage.setItem('perm_pass', password);

    const input = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) {
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    await sleep(1000);
    input('input[name="name"]', 'Minh Con Bò');
    input('input[name="phone"]', '09' + Math.floor(Math.random() * 100000000));
    input('input[name="email"]', email);
    input('input[name="password"]', password);

    await sleep(800);
    document.querySelector('button[type="submit"]')?.click();
  }

  async function autoVerifyOTP() {
    if (!location.href.includes('/verify-email')) return;

    const email = localStorage.getItem('perm_email') || '';
    if (!email.includes('@gmailos.com')) return;

    const otpInput = document.querySelector('input[name="code"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    const GUI = document.createElement('div');
    GUI.style = 'position:fixed;top:10px;right:10px;background:#111;color:#fff;padding:10px;z-index:9999;border-radius:8px;';
    GUI.innerHTML = `<b>Đang lấy OTP cho:</b><br><code>${email}</code><br><button id="pasteOtpBtn">Dán mã OTP</button><div id="otpCode" style="margin-top:5px;color:#0f0;"></div>`;
    document.body.appendChild(GUI);

    async function fetchOTP() {
      const username = email.split('@')[0];
      try {
        const res = await fetch(`https://gmailos.com/api/emails/${username}`);
        const data = await res.json();
        const otp = (data[0]?.body || '').match(/\d{6}/)?.[0];
        if (otp) {
          document.getElementById('otpCode').innerText = 'Mã OTP: ' + otp;
          return otp;
        }
      } catch (e) {}
      return null;
    }

    document.getElementById('pasteOtpBtn').onclick = async () => {
      const code = await fetchOTP();
      if (code && otpInput) {
        otpInput.value = code;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(500);
        submitBtn?.click();
      }
    };

    // Tự động thử sau vài giây
    for (let i = 0; i < 20; i++) {
      const otp = await fetchOTP();
      if (otp) {
        otpInput.value = otp;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(300);
        submitBtn?.click();
        break;
      }
      await sleep(3000);
    }
  }

  async function autoLogin() {
    if (!location.href.includes('/login')) return;

    const email = localStorage.getItem('perm_email');
    const pass = localStorage.getItem('perm_pass');
    if (!email || !pass) return;

    const input = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) {
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    await sleep(800);
    input('input[name="email"]', email);
    input('input[name="password"]', pass);
    await sleep(600);
    document.querySelector('button[type="submit"]')?.click();
  }

  // Run all
  autoRegister();
  autoVerifyOTP();
  autoLogin();
})();
