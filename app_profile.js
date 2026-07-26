document.addEventListener("DOMContentLoaded", function () {
    checkLoginAndRender();
    window.switchTab = function (tabId, element) {
        document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));

        const targetTab = document.getElementById(tabId);
        if (targetTab) targetTab.classList.add("active");
        if (element) element.classList.add("active");
    };
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let currentUser = JSON.parse(localStorage.getItem("user")) || {};

            currentUser.fullname = document.getElementById("profileName").value.trim();
            currentUser.email = document.getElementById("profileEmail").value.trim();
            currentUser.phone = document.getElementById("profilePhone").value.trim();
            currentUser.address = document.getElementById("profileAddress").value.trim();
            localStorage.setItem("user", JSON.stringify(currentUser));

            updateSidebarUI(currentUser);
            alert("🎉 Đã cập nhật thông tin thành công!");
        });
    }
});

function checkLoginAndRender() {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const profileCardBox = document.querySelector(".profile-card-box");
    if (!savedUser || savedUser.isLoggedIn === false || (!savedUser.fullname && !savedUser.email)) {
        if (profileCardBox) {
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
        return;
    }
    fillProfileData(savedUser);
}
function fillProfileData(user) {
    const name = user.fullname || user.name || "";

    if (document.getElementById("profileName")) document.getElementById("profileName").value = name;
    if (document.getElementById("profileEmail")) document.getElementById("profileEmail").value = user.email || "";
    if (document.getElementById("profilePhone")) document.getElementById("profilePhone").value = user.phone || "";
    if (document.getElementById("profileAddress")) document.getElementById("profileAddress").value = user.address || "";

    updateSidebarUI(user);
}

function updateSidebarUI(user) {
    const name = user.fullname || user.name || "Khách hàng";
    if (document.getElementById("sidebarName")) document.getElementById("sidebarName").textContent = name;
    if (document.getElementById("sidebarEmail")) document.getElementById("sidebarEmail").textContent = user.email || "";
    if (document.getElementById("userAvatar") && user.avatar) {
        document.getElementById("userAvatar").src = user.avatar;
    }
}

function logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        let currentUser = JSON.parse(localStorage.getItem("user")) || {};
        currentUser.isLoggedIn = false;
        localStorage.setItem("user", JSON.stringify(currentUser));
        window.location.reload();
    }
}