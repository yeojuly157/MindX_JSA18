import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const msg = document.getElementById('msg');
const btnGetCode = document.getElementById('btnGetCode');

let cooldownTimer = null;

function startCooldown(seconds = 60) {
    clearInterval(cooldownTimer);
    let left = seconds;
    btnGetCode.disabled = true;
    btnGetCode.textContent = `Gửi lại (${left}s)`;

    cooldownTimer = setInterval(() => {
        left--;
        if (left <= 0) {
            clearInterval(cooldownTimer);
            btnGetCode.disabled = false;
            btnGetCode.textContent = "Gửi liên kết";
        } else {
            btnGetCode.textContent = `Gửi lại (${left}s)`;
        }
    }, 1000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const email = emailInput.value.trim();
    btnGetCode.disabled = true;

    try {
        await sendPasswordResetEmail(auth, email, {
            url: new URL("login.html", window.location.href).href,
        });
        msg.style.color = "green";
        msg.textContent = "Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.";
        startCooldown();
    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "Không gửi được email, vui lòng thử lại.";
        console.error("Lỗi gửi liên kết", err);
        btnGetCode.disabled = false;
    }
});