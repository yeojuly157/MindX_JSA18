document.addEventListener("DOMContentLoaded", function () {
    const cartContent = document.getElementById("cartContent");
    const cartCountElement = document.querySelector(".cart-count");
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length === 0) {
        const dummyProduct = {
            id: 101,
            name: "In Danh Thiếp / Name Card Cao Cấp (Ép kim, Bo góc)",
            price: 350000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1616628188502-413f2fe46e5e?w=500&auto=format&fit=crop&q=60" // Ảnh mockup name card cực sang trọng
        };
        cart = [dummyProduct];
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    if (cartContent) {
        if (cart.length > 0) {
            let html = "";
            let totalAmount = 0;

            cart.forEach(item => {
                totalAmount += item.price * item.quantity;
                html += `
                    <div class="cart-item-card">
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p style="color: #6C7A9C; margin-top: 4px;">Số lượng: ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                    </div>
                `;
            });

            html += `
                <div class="cart-summary">
                    <span style="font-size: 19px; font-weight: 700; color: #445B8B;">Tổng cộng: ${totalAmount.toLocaleString('vi-VN')}đ</span>
                    <a href="checkout.html" class="btn-checkout">Tiến hành thanh toán</a>
                </div>
            `;
            cartContent.innerHTML = html;
        } else {
            cartContent.innerHTML = `
                <div class="empty-cart-message">
                    <i class="bi bi-cart-x" style="font-size: 60px; color: #6C7A9C; display: block; margin-bottom: 15px;"></i>
                    <h3 style="color: #445B8B; font-weight: 600;">Giỏ hàng của bạn đang trống!</h3>
                    <p style="margin-bottom: 25px; color: #6C7A9C; font-size: 16px;">Hãy quay lại chọn các dịch vụ in ấn chất lượng nhé.</p>
                    <a href="index.html" class="btn-checkout">Quay lại trang chủ</a>
                </div>
            `;
        }
    }
});