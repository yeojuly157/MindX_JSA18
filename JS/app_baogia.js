document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileDesign");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener("change", function () {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.classList.add("has-file"); 
            } else {
                fileNameDisplay.textContent = "Chưa chọn file";
                fileNameDisplay.classList.remove("has-file");
            }
        });
    }
});