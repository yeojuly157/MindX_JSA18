document.addEventListener("DOMContentLoaded", function () {
    // 1. LẤY SẢN PHẨM TỪ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'tui-giay';

    if (typeof productsData === 'undefined') return;
    const product = productsData[productId];

    if (!product) {
        document.getElementById("productTitle").textContent = "Sản phẩm không tồn tại!";
        return;
    }

    // Đổ dữ liệu sản phẩm
    document.getElementById("productTitle").textContent = product.title || "";
    document.getElementById("productDesc").textContent = product.desc || "";
    
    const priceText = document.getElementById("productPrice");
    if (priceText) priceText.textContent = `Khoảng giá: ${product.price}`;

    const img1 = document.getElementById("productImg1");
    const img2 = document.getElementById("productImg2");
    if (img1 && product.image1) img1.src = product.image1;
    if (img2 && product.image2) img2.src = product.image2;

    // Render thông số
    const specsList = document.getElementById("productSpecs");
    if (specsList && product.specs) {
        specsList.innerHTML = "";
        product.specs.forEach(spec => {
            const li = document.createElement("li");
            li.textContent = spec;
            specsList.appendChild(li);
        });
    }

    // 2. XỬ LÝ TÍNH TỔNG TIỀN THEO Ô SỐ LƯỢNG
    const qtyInput = document.getElementById("productQuantity");
    const totalPriceEl = document.getElementById("totalPrice");
    const unitPrice = product.pricePerUnit || 0;

    function updateTotalPrice() {
        let qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) {
            qty = 1;
            qtyInput.value = 1;
        }
        const total = qty * unitPrice;
        totalPriceEl.textContent = total.toLocaleString('vi-VN') + " đ";
    }

    // Bắt sự kiện khi gõ hoặc bấm mũi tên thay đổi số
    if (qtyInput) {
        qtyInput.addEventListener("input", updateTotalPrice);
        qtyInput.addEventListener("change", updateTotalPrice);
    }

    // Tính tiền ban đầu
    updateTotalPrice();

    // 3. XỬ LÝ FILE DESIGN
    const fileInput = document.getElementById("designFile") || document.getElementById("fileDesign");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener("change", function () {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.style.color = "#445B8B";
                fileNameDisplay.style.fontWeight = "600";
            } else {
                fileNameDisplay.textContent = "Chưa chọn file";
                fileNameDisplay.style.color = "#64748B";
                fileNameDisplay.style.fontWeight = "normal";
            }
        });
    }

    // 4. XỬ LÝ THÊM VÀO GIỎ HÀNG
    // NÚT THÊM VÀO GIỎ HÀNG
const btnAddToCart = document.getElementById("btnAddToCart");
if (btnAddToCart) {
    btnAddToCart.addEventListener("click", function () {
        const qtyInput = document.getElementById("productQuantity");
        const fileInput = document.getElementById("designFile") || document.getElementById("fileDesign");

        const quantity = parseInt(qtyInput ? qtyInput.value : 1) || 1;
        const titleName = product.title || "Sản phẩm in ấn";
        const imgUrl = product.image1 || "";
        const fileName = (fileInput && fileInput.files.length > 0) ? fileInput.files[0].name : "Không có file";

        const cartItem = {
            id: productId,
            title: titleName,
            pricePerUnit: unitPrice,
            quantity: quantity,
            totalPrice: quantity * unitPrice,
            fileName: fileName,
            image: imgUrl
        };

        // Lấy giỏ hàng cũ từ localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(cartItem);
        
        // Lưu giỏ hàng mới vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`Đã thêm "${titleName}" (${quantity} cái) vào giỏ hàng!`);
    });
}
});