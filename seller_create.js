const sellerForm = document.querySelector("#seller-form");
const sellerStatus = document.querySelector("#seller-status");

sellerForm.addEventListener("change", (event) => {
    const input = event.target;
    if (input.type !== "file") return;
    const documentField = input.closest(".document-field");
    const fileName = documentField.querySelector("small");
    if (input.files[0]) fileName.textContent = input.files[0].name;
});

sellerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sellerStatus.textContent = "Application received. Opening your seller dashboard...";
    window.setTimeout(() => {
        window.location.href = "business_page.html";
    }, 700);
});
