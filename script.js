let businesses = [
	{
		id: 1,
		name: "Sinta Ceramics",
		category: "Home",
		location: "Mandaluyong",
		description: "Hand-thrown pieces for slow mornings and everyday rituals.",
		image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
		tag: "New here",
		owner: "Sinta Studio",
		initials: "SS",
		rating: "4.9",
		distance: "1.2 km"
	},
	{
		id: 2,
		name: "Common Room Coffee",
		category: "Food",
		location: "Kapitolyo",
		description: "A neighborhood coffee bar with good light and better conversations.",
		image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85",
		tag: "Local favorite",
		owner: "Mika & Paolo",
		initials: "MP",
		rating: "4.8",
		distance: "2.4 km"
	},
	{
		id: 3,
		name: "Sunday Market Finds",
		category: "Style",
		location: "Poblacion",
		description: "Curated vintage, handmade accessories, and clothes with a story.",
		image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
		tag: "Open today",
		owner: "Nica Reyes",
		initials: "NR",
		rating: "4.7",
		distance: "3.1 km"
	}
];

const feed = document.querySelector("#feed");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const clearSearch = document.querySelector(".clear-search");
let selectedCategory = "All";
let showingSavedOnly = false;
const savedBusinesses = new Set();

document.querySelector("#current-date").textContent = new Intl.DateTimeFormat("en-US", {
	weekday: "long",
	month: "long",
	day: "numeric"
}).format(new Date()).toUpperCase();

function renderBusinesses() {
	const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
	const visibleBusinesses = businesses.filter((business) => {
		const matchesCategory = selectedCategory === "All" || business.category === selectedCategory;
		const searchableText = `${business.name} ${business.category} ${business.location} ${business.description}`.toLowerCase();
		const matchesSaved = !showingSavedOnly || savedBusinesses.has(business.id);
		return matchesCategory && matchesSaved && searchableText.includes(searchTerm);
	});

	feed.innerHTML = visibleBusinesses.map((business) => `
		<article class="store-card">
			<div class="store-image" style="background-image: url('${business.image}')">
				<span class="store-tag">${business.tag}</span>
				<button class="save-button ${savedBusinesses.has(business.id) ? "saved" : ""}" type="button" data-save="${business.id}" aria-label="${savedBusinesses.has(business.id) ? "Remove" : "Save"} ${business.name}">
					${savedBusinesses.has(business.id) ? "♥" : "♡"}
				</button>
			</div>
			<div class="store-content">
				<div class="store-topline">
					<h3 class="store-name">${business.name}</h3>
					<span class="verified">● verified</span>
				</div>
				<p class="store-description">${business.description}</p>
				<div class="store-meta">
					<span>★ <strong>${business.rating}</strong></span>
					<span>⌖ ${business.location}</span>
					<span>${business.distance}</span>
				</div>
				<div class="store-footer">
					<span class="owner"><span class="owner-avatar">${business.initials}</span> by ${business.owner}</span>
					<button class="view-link" type="button">View profile &rarr;</button>
				</div>
			</div>
		</article>
	`).join("");

	emptyState.hidden = visibleBusinesses.length > 0;
}

document.querySelector("#category-list").addEventListener("click", (event) => {
	const categoryButton = event.target.closest("[data-category]");
	if (!categoryButton) return;
	selectedCategory = categoryButton.dataset.category;
	document.querySelectorAll(".category").forEach((button) => button.classList.toggle("active", button === categoryButton));
	renderBusinesses();
});

if (searchInput && clearSearch) {
	searchInput.addEventListener("input", () => {
		clearSearch.style.display = searchInput.value ? "block" : "none";
		renderBusinesses();
	});

	clearSearch.addEventListener("click", () => {
		searchInput.value = "";
		clearSearch.style.display = "none";
		searchInput.focus();
		renderBusinesses();
	});
}

feed.addEventListener("click", async (event) => {
	const saveButton = event.target.closest("[data-save]");
	if (!saveButton) return;
	const businessId = Number(saveButton.dataset.save);
	const shouldSave = !savedBusinesses.has(businessId);
	shouldSave ? savedBusinesses.add(businessId) : savedBusinesses.delete(businessId);
	try {
		await window.PisoApi.setSaved(businessId, shouldSave);
	} catch (error) {
		shouldSave ? savedBusinesses.delete(businessId) : savedBusinesses.add(businessId);
	}
	renderBusinesses();
});

document.querySelector("#see-all").addEventListener("click", () => {
	showingSavedOnly = false;
	selectedCategory = "All";
	document.querySelectorAll(".category").forEach((button) => button.classList.toggle("active", button.dataset.category === "All"));
	if (searchInput && clearSearch) {
		searchInput.value = "";
		clearSearch.style.display = "none";
	}
	renderBusinesses();
});

document.querySelectorAll(".nav-item").forEach((item) => {
	item.addEventListener("click", () => {
		document.querySelectorAll(".nav-item").forEach((navItem) => navItem.classList.toggle("active", navItem === item));
		if (item.dataset.nav === "home") {
			showingSavedOnly = false;
			renderBusinesses();
		}
		if (item.dataset.nav === "explore") {
			showingSavedOnly = false;
			renderBusinesses();
		}
		if (item.dataset.nav === "saved") {
			showingSavedOnly = true;
			if (searchInput) searchInput.value = "";
			selectedCategory = "All";
			document.querySelectorAll(".category").forEach((button) => button.classList.toggle("active", button.dataset.category === "All"));
			renderBusinesses();
		}
	});
});

renderBusinesses();

async function loadApiData() {
	if (!window.PisoApi) return;
	try {
		const [apiBusinesses, savedIds] = await Promise.all([
			window.PisoApi.getBusinesses(),
			window.PisoApi.getSaved()
		]);
		businesses = apiBusinesses;
		savedIds.forEach((businessId) => savedBusinesses.add(businessId));
		renderBusinesses();
	} catch (error) {
		console.warn("Using local business data because the API is unavailable.", error);
	}
}

loadApiData();
