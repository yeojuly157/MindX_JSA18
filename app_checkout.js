document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkoutForm");
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const qrContainer = document.getElementById("qrContainer");
    const displayTotal = document.getElementById("displayTotal");
    const vietQrImg = document.getElementById("vietQrImg");

    // 1. Lấy thông tin giỏ hàng & tính tổng tiền thực tế
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalAmount = 0;

    cart.forEach(item => {
        const qty = parseInt(item.quantity) || 1;
        const price = parseInt(item.pricePerUnit) || 5000;
        totalAmount += qty * price;
    });

    // Cập nhật số tiền hiển thị
    if (displayTotal) {
        displayTotal.textContent = totalAmount.toLocaleString('vi-VN') + " đ";
    }

    // 2. Tạo URL VietQR động theo số tiền thực tế của đơn hàng
    const bankBin = "970422"; // Mã BIN ngân hàng MBBank
    const accountNumber = "123456789"; // Thay số tài khoản thực tế của bạn
    const accountName = encodeURIComponent("CONG TY TNHH IN NHANH NEW VISION");
    const addInfo = encodeURIComponent("Thanh toan don hang in");

    if (vietQrImg) {
        vietQrImg.src = `https://api.vietqr.io/image/${bankBin}-${accountNumber}-V97Z9G3.jpg?accountName=${accountName}&amount=${totalAmount}&addInfo=${addInfo}`;
    }

    // 3. Cập nhật số đếm badge giỏ hàng ở Header
    const cartCountEl = document.querySelector(".cart-count");
    if (cartCountEl) {
        cartCountEl.textContent = cart.length.toString();
    }

    // 4. Bật/Tắt khung QR Code khi chuyển đổi Phương thức thanh toán
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

    // Chạy hàm kiểm tra ngay lần đầu load trang
    toggleQRCode();

    // 5. Xử lý khi nhấn Submit "Hoàn tất đặt hàng"
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

            // Xóa sạch giỏ hàng sau khi đặt thành công & quay về trang chủ
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        });
    }
});