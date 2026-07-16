document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkoutForm");
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const qrContainer = document.getElementById("qrContainer");

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

            const selectedMethod = document.querySelector('input[name="payment"]:checked').value;

            alert(`🎉 Thanh toán thành công bằng phương thức: ${selectedMethod}!`);

            localStorage.setItem("cart", JSON.stringify([]));
            window.location.href = "cart.html";
        });
    }
});