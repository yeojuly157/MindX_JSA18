import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log(app.name);

const msg = document.getElementById('msg');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnGoogle = document.getElementById('btnGoogle');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.style.color = "red";
    msg.textContent = "";
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const submitBtn = loginForm.querySelector('.btn-submit');
    submitBtn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        msg.style.color = "green";
        msg.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } catch (e) {
        console.error("Lỗi khi đăng nhập: ", e);
        msg.textContent = "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.";
    } finally {
        submitBtn.disabled = false;
    }
});

btnGoogle.addEventListener('click', async () => {
    msg.style.color = "red";
    msg.textContent = "";

    try {
        const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
        const ref = doc(db, "users", user.uid);

        if (!(await getDoc(ref)).exists()) {
            await setDoc(ref, {
                fullname: user.displayName || "",
                email: user.email,
                phone: user.phoneNumber || "",
                photoURL: user.photoURL || "",
                provider: "google",
                createdAt: serverTimestamp(),
            });
        } 

        msg.style.color = "green";
        msg.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
        loginForm.reset();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } catch (e) {
        console.error("Lỗi khi đăng nhập bằng Google: ", e);
        msg.textContent = "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
    } finally {
        btnGoogle.disabled = false;
    }
});

