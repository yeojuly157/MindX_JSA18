import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let pendingAvatar = null;

console.log(app.name);

window.switchTab = function (tabId, element) {
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add("active");
    if (element) element.classList.add("active");
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        renderNotLoggedIn();
        return;
    }

    let data = {};
    try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) data = snap.data();
    } catch (err) {
        console.error("Lỗi đọc hồ sơ", err);
    }

    fillProfileData({
        fullname: data.fullname || user.displayName || "",
        email: user.email || data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        avatar: data.avatar || data.photoURL || user.photoURL || ""
    });
});

function renderNotLoggedIn() {
    const profileCardBox = document.querySelector(".profile-card-box");
    if (!profileCardBox) return;
    profileCardBox.innerHTML = `
        <div class="not-logged-in-box">
            <div class="lock-icon-wrapper">
                <i class="bi bi-shield-lock-fill"></i>
            </div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập tài khoản để xem và quản lý thông tin hồ sơ cá nhân cũng như lịch sử đơn hàng.</p>
            <a href="login.html" class="btn-login-now">
                <i class="bi bi-box-arrow-in-right"></i> Đăng nhập ngay
            </a>
        </div>
    `;
}

function fillProfileData(user) {
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };
    set("profileName", user.fullname);
    set("profileEmail", user.email);
    set("profilePhone", user.phone);
    set("profileAddress", user.address);

    const emailInput = document.getElementById("profileEmail");
    if (emailInput) emailInput.readOnly = true;

    updateSidebarUI(user);
}

function updateSidebarUI(user) {
    const name = user.fullname || "Khách hàng";
    const nameEl = document.getElementById("sidebarName");
    const emailEl = document.getElementById("sidebarEmail");
    const avatarEl = document.getElementById("userAvatar");

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = user.email || "";
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
}

const profileForm = document.getElementById("profileForm");
if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return;

        const fullname = document.getElementById("profileName").value.trim();
        const phone = document.getElementById("profilePhone").value.trim();
        const address = document.getElementById("profileAddress").value.trim();

        if (!/^(0|\+84)\d{9}$/.test(phone)) {
            alert("Số điện thoại không hợp lệ.");
            return;
        }

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            await updateProfile(user, { displayName: fullname });

            const dataToSave = {
                fullname,
                phone,
                address,
                updatedAt: serverTimestamp()
            };
            if (pendingAvatar) dataToSave.avatar = pendingAvatar;   

            await setDoc(doc(db, "users", user.uid), dataToSave, { merge: true });

            pendingAvatar = null;  
            updateSidebarUI({ fullname, email: user.email });
            alert("🎉 Đã cập nhật thông tin thành công!");
        } catch (err) {
            console.error("Lỗi cập nhật", err);
            alert("Cập nhật thất bại, vui lòng thử lại.");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

function resizeImage(file, size = 256) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;

            const min = Math.min(img.width, img.height);
            const sx = (img.width - min) / 2;
            const sy = (img.height - min) / 2;
            canvas.getContext("2d").drawImage(img, sx, sy, min, min, 0, 0, size, size);

            resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Không đọc được ảnh"));
        };
        img.src = url;
    });
}

const avatarInput = document.getElementById("avatarInput");

if (avatarInput) {
    avatarInput.addEventListener("change", async () => {
        const file = avatarInput.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn một tệp ảnh.");
            avatarInput.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB.");
            avatarInput.value = "";
            return;
        }

        try {
            pendingAvatar = await resizeImage(file);
            document.getElementById("userAvatar").src = pendingAvatar;
        } catch (err) {
            console.error("Lỗi đọc ảnh", err);
        } finally {
            avatarInput.value = "";
        }
    });
}

window.logout = async function () {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất không?")) return;
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (err) {
        console.error("Lỗi đăng xuất", err);
    }
};