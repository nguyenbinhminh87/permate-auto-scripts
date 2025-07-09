// ==UserScript==
// @name         Permate Full Auto v2.2.2 (Fix mobile form load)
// @namespace    https://permate.com/
// @version      2.2.2
// @description  Fix không điền form khi bấm "Auto Đăng Ký" trên mobile (Kiwi, Yandex), auto OTP + login
// @match        https://permate.com/auth/partner/sign-up
// @match        https://permate.com/auth/verify-email*
// @match        https://permate.com/auth/login
// @grant        none
// ==/UserScript==

(function () {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const password = 'Minhconbo123';

  function randomEmail() {
    const prefix = 'minhconbo' + Math.floor(Math.random() * 1000000);
    return {
      full: prefix + '@maildim.com',
      name: prefix
    };
  }

  function createMainGUI(email, phone) {
    const box = document.createElement('div');
    box.id = 'permate-gui';
    box.style = `
      position:fixed;top:20px;left:20px;z-index:9999;
      background:#111;color:#fff;padding:12px;
      border-radius:10px;font-size:14px;line-height:1.6;
      box-shadow:0 0 10px #000;width:270px;
    `;
    box.innerHTML = `
      <b>👤 Permate Auto GUI</b><br>
      <div>Email: <code>${email}</code></div>
      <div>Pass: <code>${password}</code></div>
      <div>SĐT: <code>${phone}</code></div>
      <button id="startRegister" style="margin-top:8px;padding:6px;width:100%;">🚀 Auto Đăng Ký</button>
    `;
    document.body.appendChild(box);

    const btn = document.getElementById('startRegister');
    if (btn) {
      btn.onclick = async () => {
        console.log('🚀 Bắt đầu auto đăng ký...');
        await startRegister(email, phone);
      };
    }
  }

  async function waitForInput(selector, maxTries = 10) {
    for (let i = 0; i < maxTries; i++) {
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(500);
    }
    return null;
  }

  async function startRegister(email, phone) {
    localStorage.setItem('perm_email', email);
    localStorage.setItem('perm_pass', password);
    localStorage.setItem('perm_phone', phone);

    const setInput = async (selector, value) => {
      const el = await waitForInput(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✏️ Điền: ${selector} = ${value}`);
      } else {
        console.warn(`❌ Không tìm thấy input: ${selector}`);
      }
    };

    await setInput('input[name="name"]', 'Minh Con Bò');
    await setInput('input[name="phone"]', phone);
    await setInput('input[name="email"]', email);
    await setInput('input[name="password"]', password);
    await setInput('input[name="confirmPassword"]', password);
    await delay(500);
    const btn = await waitForInput('button[type="submit"]');
    btn?.click();
    console.log('📨 Đã gửi form đăng ký!');
  }

  async function createOTPGUI(email, username) {
    const otpBox = document.createElement('div');
    otpBox.id = 'otp-gui';
    otpBox.style = `
      position:fixed;top:20px;right:20px;z-index:9999;
      background:#111;color:#fff;padding:10px;border-radius:10px;
      font-size:14px;width:260px;
    `;
    otpBox.innerHTML = `
      <b>🔐 OTP cho:</b><br><code>${email}</code><br>
      <a href="https://maildim.com/mailbox/${username}" target="_blank" style="color:#0af;text-decoration:underline;" >📬 Mở hộp thư</a><br>
      <button id="fetchOtp" style="margin-top:6px;padding:5px;width:100%;">📥 Dán mã OTP</button>
      <div id="otpStatus" style="color:#ff0;margin-top:6px;">⏳ Đang chờ OTP...</div>
    `;
    document.body.appendChild(otpBox);

    document.getElementById('fetchOtp').onclick = async () => {
      const code = await getOTPFromMaildim(username);
      if (code) {
        const otpInput = document.querySelector('input[name="code"]');
        otpInput.value = code;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('otpStatus').innerText = '✅ OTP: ' + code;
        await delay(300);
        document.querySelector('button[type="submit"]')?.click();
      } else {
        document.getElementById('otpStatus').innerText = '❌ Không tìm thấy OTP';
      }
    };

    for (let i = 0; i < 30; i++) {
      const code = await getOTPFromMaildim(username);
      if (code) {
        document.querySelector('input[name="code"]').value = code;
        document.querySelector('input[name="code"]').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('button[type="submit"]')?.click();
        document.getElementById('otpStatus').innerText = '✅ OTP: ' + code;
        break;
      }
      document.getElementById('otpStatus').innerText = `⏳ Đang chờ OTP... (${i + 1}/30)`;
      await delay(3000);
    }
  }

  async function getOTPFromMaildim(username) {
    try {
      const res = await fetch(`https://maildim.com/mailbox/${username}`);
      const html = await res.text();
      const match = html.match(/>(\d{6})<\/strong>/);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  }

  async function autoLogin() {
    const email = localStorage.getItem('perm_email');
    const pass = localStorage.getItem('perm_pass');

    const input = async (selector, value) => {
      const el = await waitForInput(selector);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    await input('input[name="email"]', email);
    await input('input[name="password"]', pass);
    await delay(400);
    document.querySelector('button[type="submit"]')?.click();
  }

  // === ENTRY POINT ===
  if (location.href.includes('/sign-up')) {
    const emailData = randomEmail();
    const email = emailData.full;
    const username = emailData.name;
    const phone = '09' + Math.floor(Math.random() * 100000000);
    createMainGUI(email, phone);
  }

  if (location.href.includes('/verify-email')) {
    const email = localStorage.getItem('perm_email');
    const username = email.split('@')[0];
    createOTPGUI(email, username);
  }

  if (location.href.includes('/login')) {
    autoLogin();
  }
})();
