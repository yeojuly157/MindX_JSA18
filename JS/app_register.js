import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
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
const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const fullnameInput = document.getElementById('fullname');
const btnGoogle = document.getElementById('btnGoogle');


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.style.color = "red";
    msg.textContent = "";
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const phone = phoneInput.value.trim();
    const submitBtn = registerForm.querySelector('.btn-submit');


    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    if (!strongPassword.test(password)) {
        msg.textContent = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        return;
    }

    if (password !== confirmPassword) {
        msg.textContent = "Mật khẩu và xác nhận mật khẩu không khớp.";
        return;
    }

    if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
        msg.textContent = "Số điện thoại không hợp lệ.";
        return;
    }

    submitBtn.disabled = true;

    try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(newUser.user, { displayName: fullname });

        await setDoc(doc(db, "users", newUser.user.uid), {
            fullname: fullname,
            email: email,
            phone: phone,
            createdAt: serverTimestamp(),
        });

        msg.style.color = "green";
        msg.textContent = "Đăng ký thành công!";
        registerForm.reset();

        await signOut(auth);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (e) {
        console.error("Lỗi lưu người dùng", e);
        msg.style.color = "red";
        if (e.code === "auth/email-already-in-use") {
            msg.textContent = "Email này đã được đăng ký.";
        } else {
            msg.textContent = "Đăng ký thất bại. Vui lòng thử lại.";
        }
    } finally {
        submitBtn.disabled = false; //Chặn bấm đăng ký nhiều lần
    }
})

btnGoogle.addEventListener('click', async () => {
    msg.style.color = "red";
    msg.textContent = "";
    btnGoogle.disabled = true;

    try {
        const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
        const ref = doc(db, "users", user.uid);

        if (!(await getDoc(ref)).exists()) {
            await setDoc(ref, {
                fullname: user.displayName,
                email: user.email,
                phone: user.phoneNumber || "",
                createdAt: serverTimestamp(),
            });
        }

        msg.style.color = "green";
        msg.textContent = "Đăng ký thành công";

        await signOut(auth);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (e) {
        console.error("Lỗi đăng ký bằng Google", e);
        msg.style.color = "red";
        msg.textContent = "Đăng ký bằng Google thất bại. Vui lòng thử lại.";
    } finally {
        btnGoogle.disabled = false;
    }
})