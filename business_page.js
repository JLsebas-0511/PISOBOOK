const businessStatus = document.querySelector("#business-status");

document.querySelector("#edit-listing").addEventListener("click", () => {
    businessStatus.textContent = "Listing editing will be available soon.";
});

document.querySelector("#view-activity").addEventListener("click", () => {
    businessStatus.textContent = "You are viewing the latest activity for Sinta Ceramics.";
});

document.querySelector("#add-business").addEventListener("click", () => {
    businessStatus.textContent = "Add another business setup will be available soon.";
});
