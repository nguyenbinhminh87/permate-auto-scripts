// ==UserScript==
// @name         Permate Full Auto v1.9.1
// @namespace    https://permate.com/
// @version      1.9.1
// @description  Đăng ký + OTP + Đăng nhập tự động trên Permate.com (Fix GUI)
// @match        https://permate.com/auth/partner/sign-up
// @match        https://permate.com/auth/verify-email*
// @match        https://permate.com/auth/login
// @grant        none
// ==/UserScript==

(function () {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const randomEmail = () => 'minhconbo' + Math.floor(Math.random() * 1000000) + '@gmailos.com';
  const password = 'Minhconbo123';

  async function autoRegister() {
    if (!location.href.includes('/sign-up')) return;

    const email = randomEmail();
    localStorage.setItem('perm_email', email);
    localStorage.setItem('perm_pass', password);

    function simulateInput(selector, value) {
      const el = document.querySelector(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    await delay(1000);
    simulateInput('input[name="name"]', 'Minh Con Bò');
    simulateInput('input[name="phone"]', '09' + Math.floor(Math.random() * 100000000));
    simulateInput('input[name="email"]', email);
    simulateInput('input[name="password"]', password);
    await delay(800);

    document.querySelector('button[type="submit"]')?.click();
  }

  async function autoOTP() {
    if (!location.href.includes('/verify-email')) return;

    const email = localStorage.getItem('perm_email');
    const username = email.split('@')[0];
    const otpInput = document.querySelector('input[name="code"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    const GUI = document.createElement('div');
    GUI.style = `
      position:fixed;top:20px;right:20px;z-index:9999;
      background:#111;color:#fff;padding:10px;border-radius:10px;
      font-size:14px;width:auto;max-width:90%;
    `;
    GUI.innerHTML = `
      <div><b>Email:</b> <code>${email}</code></div>
      <button id="pasteOtpBtn" style="margin-top:5px;padding:5px;">Dán mã OTP</button>
      <div id="otpCode" style="margin-top:6px;color:#0f0;"></div>
    `;
    document.body.appendChild(GUI);

    async function fetchOtpCode() {
      try {
        const res = await fetch(`https://gmailos.com/api/emails/${username}`);
        const data = await res.json();
        const body = data?.[0]?.body || '';
        const otp = body.match(/\d{6}/)?.[0];
        if (otp) {
          document.getElementById('otpCode').innerText = 'Mã OTP: ' + otp;
          return otp;
        }
      } catch (e) {
        console.warn('OTP fetch error:', e);
      }
      return null;
    }

    document.getElementById('pasteOtpBtn').onclick = async () => {
      const otp = await fetchOtpCode();
      if (otp && otpInput) {
        otpInput.value = otp;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        await delay(300);
        submitBtn?.click();
      }
    };

    // Auto try trong 60 giây
    for (let i = 0; i < 20; i++) {
      const otp = await fetchOtpCode();
      if (otp) {
        otpInput.value = otp;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        await delay(300);
        submitBtn?.click();
        break;
      }
      await delay(3000);
    }
  }

  async function autoLogin() {
    if (!location.href.includes('/login')) return;

    const email = localStorage.getItem('perm_email');
    const pass = localStorage.getItem('perm_pass');
    if (!email || !pass) return;

    function simulateInput(selector, value) {
      const el = document.querySelector(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    await delay(800);
    simulateInput('input[name="email"]', email);
    simulateInput('input[name="password"]', pass);
    await delay(600);
    document.querySelector('button[type="submit"]')?.click();
  }

  autoRegister();
  autoOTP();
  autoLogin();
})();
