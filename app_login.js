const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && emailValue === storedUser.email && passwordValue === storedUser.password) {
            alert("🎉 Đăng nhập thành công!");
            window.location.href = "index.html";
        } else {
            alert("❌ Sai tài khoản hoặc mật khẩu!");
        }
    });
}