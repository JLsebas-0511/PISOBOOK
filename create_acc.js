const addressInput = document.querySelector("#profile-address");
const mapButton = document.querySelector("#map-address");
const addressStatus = document.querySelector("#address-status");
const profileForm = document.querySelector(".auth-form");
const passwordInput = document.querySelector("#profile-password");
const confirmPasswordInput = document.querySelector("#profile-password-confirm");
const pictureInput = document.querySelector("#profile-picture");
const picturePreview = document.querySelector("#picture-preview");
const profileStatus = document.querySelector("#profile-status");
let profilePicture = "";

mapButton.addEventListener("click", () => {
	const address = addressInput.value.trim();
	if (!address) {
		window.open("https://www.google.com/maps", "_blank", "noopener,noreferrer");
		addressStatus.textContent = "Google Maps opened";
		addressInput.focus();
		return;
	}

	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
	window.open(mapsUrl, "_blank", "noopener,noreferrer");

	addressInput.value = address;
	copyAddress(address);
});

async function copyAddress(address) {
	try {
		await navigator.clipboard.writeText(address);
		addressStatus.textContent = "Address copied and pasted into the field.";
	} catch {
		const copyBuffer = document.createElement("textarea");
		copyBuffer.value = address;
		copyBuffer.setAttribute("readonly", "");
		copyBuffer.style.position = "fixed";
		copyBuffer.style.opacity = "0";
		document.body.appendChild(copyBuffer);
		copyBuffer.select();
		document.execCommand("copy");
		copyBuffer.remove();
		addressStatus.textContent = "Address added to the field.";
	}
}

function validatePasswordMatch() {
	if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
		confirmPasswordInput.setCustomValidity("Passwords do not match.");
		return;
	}
	confirmPasswordInput.setCustomValidity("");
}

passwordInput.addEventListener("input", validatePasswordMatch);
confirmPasswordInput.addEventListener("input", validatePasswordMatch);

pictureInput.addEventListener("change", () => {
	const file = pictureInput.files[0];
	if (!file) return;
	if (file.size > 2 * 1024 * 1024) {
		pictureInput.value = "";
		profileStatus.textContent = "Please choose an image smaller than 2 MB.";
		return;
	}

	const reader = new FileReader();
	reader.addEventListener("load", () => {
		profilePicture = reader.result;
		picturePreview.textContent = "";
		picturePreview.style.backgroundImage = `url('${profilePicture}')`;
		picturePreview.classList.add("has-image");
	});
	reader.readAsDataURL(file);
});

profileForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	validatePasswordMatch();
	if (!profileForm.checkValidity()) {
		profileForm.reportValidity();
		return;
	}

	const account = {
		firstName: document.querySelector("#profile-first-name").value.trim(),
		lastName: document.querySelector("#profile-last-name").value.trim(),
		email: document.querySelector("#profile-email").value.trim().toLowerCase(),
		phone: document.querySelector("#profile-phone").value.trim(),
		address: addressInput.value.trim(),
		passwordHash: await hashPassword(passwordInput.value),
		profilePicture
	};

	localStorage.setItem("pisobookAccount", JSON.stringify(account));
	profileStatus.textContent = "Profile created. Taking you to PISOBOOK...";
	window.setTimeout(() => {
		window.location.href = "../index.html";
	}, 500);
});

async function hashPassword(password) {
	if (window.crypto?.subtle) {
		const data = new TextEncoder().encode(password);
		const hash = await window.crypto.subtle.digest("SHA-256", data);
		return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
	}

	return Array.from(password).reduce((hash, character) => ((hash << 5) - hash) + character.charCodeAt(0), 0).toString(16);
}