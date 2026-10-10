document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkoutForm");
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const qrContainer = document.getElementById("qrContainer");
    const displayTotal = document.getElementById("displayTotal");
    const vietQrImg = document.getElementById("vietQrImg");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalAmount = 0;
    cart.forEach(item => {
        const qty = parseInt(item.quantity) || 1;
        const price = parseInt(item.pricePerUnit) || 5000;
        totalAmount += qty * price;
    });
    if (displayTotal) {
        displayTotal.textContent = totalAmount.toLocaleString('vi-VN') + " đ";
    }
    const bankBin = "970422"; 
    const accountNumber = "123456789"; 
    const accountName = encodeURIComponent("CONG TY TNHH IN NHANH NEW VISION");
    const addInfo = encodeURIComponent("Thanh toan don hang in");

    if (vietQrImg) {
        vietQrImg.src = `https://api.vietqr.io/image/${bankBin}-${accountNumber}-V97Z9G3.jpg?accountName=${accountName}&amount=${totalAmount}&addInfo=${addInfo}`;
    }

    const cartCountEl = document.querySelector(".cart-count");
    if (cartCountEl) {
        cartCountEl.textContent = cart.length.toString();
    }

    function toggleQRCode() {
        const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
        if (selectedMethod === "Chuyển khoản") {
            qrContainer.classList.add("active");
        } else {
            qrContainer.classList.remove("active");
        }
    }

    paymentOptions.forEach(option => {
        option.addEventListener("change", toggleQRCode);
    });
    toggleQRCode();

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullname = document.getElementById("fullname").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const selectedMethod = document.querySelector('input[name="payment"]:checked').value;

            if (cart.length === 0) {
                alert("Giỏ hàng của bạn đang trống!");
                window.location.href = "index.html";
                return;
            }

            alert(`🎉 Cảm ơn ${fullname}!\nĐơn hàng trị giá ${totalAmount.toLocaleString('vi-VN')} đ đã được khởi tạo thành công.\nPhương thức: ${selectedMethod}`);
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        });
    }
});