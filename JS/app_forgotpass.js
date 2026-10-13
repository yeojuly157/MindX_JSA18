import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

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

    if (!email) {
        msg.style.color = "red";
        msg.textContent = "Vui lòng nhập email của bạn.";
        return;
    }

    btnGetCode.disabled = true;
    
    try {
        const usersRef = collection(db, "users"); 
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            msg.style.color = "red";
            msg.textContent = "Email này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
            btnGetCode.disabled = false;
            return;
        }
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