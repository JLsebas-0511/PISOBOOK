const loginForm = document.querySelector(".auth-form");
const loginStatus = document.querySelector("#login-status");

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const account = JSON.parse(localStorage.getItem("pisobookAccount") || "null");
	const email = document.querySelector("#login-email").value.trim().toLowerCase();
	const password = document.querySelector("#login-password").value;

	if (!account) {
		loginStatus.textContent = "No account found on this device. Create a profile first.";
		return;
	}

	const passwordHash = await hashPassword(password);
	if (email !== account.email || passwordHash !== account.passwordHash) {
		loginStatus.textContent = "That email or password is incorrect.";
		return;
	}

	localStorage.setItem("pisobookLoggedIn", "true");
	loginStatus.textContent = "Logged in. Taking you to PISOBOOK...";
	window.setTimeout(() => {
		window.location.href = "index.html";
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