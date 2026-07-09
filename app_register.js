const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const fullnameInput = document.getElementById('fullname');

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            alert("❌ Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("❌ Mật khẩu quá yếu! Mật khẩu phải có ít nhất 8 ký tự, bao gồm: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (ví dụ: @, $, !, %, *, ?, &).");
            return; 
        }
        const userData = {
            fullname: fullname,
            email: email,
            phone: phone,
            password: password
        };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("🎉 Đăng ký tài khoản thành công!");
        window.location.href = "login.html"; 
    });
}