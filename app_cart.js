document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    updateHeaderCartBadge();
});

function renderCart() {
    const cartContent = document.getElementById("cartContent");
    if (!cartContent) return;

    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Trường hợp GIỎ HÀNG TRỐNG
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; margin: 30px 0;">
                <i class="bi bi-cart-x" style="font-size: 60px; color: #94a3b8;"></i>
                <h3 style="font-size: 22px; color: #445B8B; margin: 15px 0 10px 0; font-weight: 700;">Giỏ hàng của bạn đang trống!</h3>
                <p style="color: #64748B; font-size: 16px; margin-bottom: 25px;">Hãy chọn các sản phẩm in ấn phù hợp để tiếp tục.</p>
                <a href="index.html" style="display: inline-block; padding: 12px 28px; background-color: #445B8B; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 10px; transition: 0.2s;">
                    <i class="bi bi-arrow-left"></i> Quay lại trang chủ
                </a>
            </div>
        `;
        updateHeaderCartBadge();
        return;
    }

    // Trường hợp CÓ SẢN PHẨM trong giỏ
    let grandTotal = 0;
    let itemsHTML = "";

    cart.forEach((item, index) => {
        const itemTitle = item.title || "Sản phẩm in ấn";
        const itemQty = parseInt(item.quantity) || 1;
        const itemUnitPrice = parseInt(item.pricePerUnit) || 5000;
        const itemTotal = itemQty * itemUnitPrice;
        const itemImg = item.image || "https://placehold.co/100x100?text=In+Nhanh";
        const fileName = (item.fileName && item.fileName !== "Không có file") ? item.fileName : null;

        grandTotal += itemTotal;

        itemsHTML += `
            <div class="cart-item-card" style="display: flex; align-items: center; justify-content: space-between; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 16px; gap: 20px; flex-wrap: wrap;">
                <!-- Thông tin & Ảnh sản phẩm -->
                <div style="display: flex; align-items: center; gap: 20px; flex: 1; min-width: 280px;">
                    <img src="${itemImg}" alt="${itemTitle}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid #f1f5f9;">
                    <div>
                        <h4 style="font-size: 18px; font-weight: 700; color: #445B8B; margin: 0 0 6px 0;">${itemTitle}</h4>
                        <p style="margin: 0; color: #64748B; font-size: 14px;">Đơn giá: <strong>${itemUnitPrice.toLocaleString('vi-VN')} đ</strong></p>
                        ${fileName ? `<p style="margin: 6px 0 0 0; color: #445B8B; font-size: 13px; font-style: italic; background: #f0f4f9; padding: 4px 10px; border-radius: 6px; display: inline-block;"><i class="bi bi-paperclip"></i> ${fileName}</p>` : ''}
                    </div>
                </div>

                <!-- Thay đổi Số lượng -->
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 14px; color: #64748B;">Số lượng:</span>
                    <input type="number" value="${itemQty}" min="1" onchange="updateCartQuantity(${index}, this.value)" 
                        style="width: 75px; height: 38px; text-align: center; font-size: 16px; font-weight: 600; color: #334155; border: 1.5px solid #cbd5e1; border-radius: 8px; outline: none;">
                </div>

                <!-- Thành tiền & Nút xóa -->
                <div style="display: flex; align-items: center; gap: 20px; justify-content: flex-end; min-width: 180px;">
                    <span style="font-size: 20px; font-weight: 700; color: #445B8B;">${itemTotal.toLocaleString('vi-VN')} đ</span>
                    <button onclick="removeCartItem(${index})" title="Xóa sản phẩm" 
                        style="background: #fee2e2; border: none; color: #ef4444; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;">
                        <i class="bi bi-trash-fill" style="font-size: 16px;"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Render toàn bộ HTML giỏ hàng và tổng tiền
    cartContent.innerHTML = `
        <div class="cart-wrapper" style="margin: 30px 0;">
            <!-- Danh sách món hàng -->
            <div class="cart-items-list">
                ${itemsHTML}
            </div>

            <!-- Khung Tổng Tiền & Nút Thanh Toán -->
            <div class="cart-summary-box" style="margin-top: 25px; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                <button onclick="clearCart()" style="background: transparent; border: 1px solid #cbd5e1; color: #64748B; padding: 10px 18px; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500;">
                    <i class="bi bi-trash"></i> Xóa tất cả
                </button>

                <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                    <div style="font-size: 18px; color: #334155; font-weight: 600;">
                        Tổng cộng: <span style="font-size: 26px; font-weight: 700; color: #445B8B; margin-left: 8px;">${grandTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <button onclick="checkout()" style="padding: 12px 32px; background-color: #445B8B; color: #ffffff; border: none; font-size: 16px; font-weight: 600; border-radius: 10px; cursor: pointer; transition: 0.2s;">
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        </div>
    `;

    updateHeaderCartBadge();
}

/**
 * 2. Cập nhật số đếm sản phẩm trên Icon Giỏ hàng ở Header
 */
function updateHeaderCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBadge = document.querySelector(".cart-count");
    if (cartBadge) {
        cartBadge.textContent = cart.length;
    }
}

function updateCartQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let qty = parseInt(newQty) || 1;
    if (qty < 1) qty = 1;

    if (cart[index]) {
        cart[index].quantity = qty;
        cart[index].totalPrice = qty * (cart[index].pricePerUnit || 5000);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}


function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
        localStorage.removeItem("cart");
        renderCart();
    }
}

function checkout() {
    window.location.href = "checkout.html";
}