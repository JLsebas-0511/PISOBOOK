let businesses = [
    {
        name: "Sinta Ceramics",
        category: "Home",
        location: "Mandaluyong",
        description: "Hand-thrown pieces for slow mornings and everyday rituals.",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500&q=85",
        rating: "4.9",
        distance: "1.2 km",
        initials: "SS"
    },
    {
        name: "Common Room Coffee",
        category: "Food",
        location: "Kapitolyo",
        description: "A neighborhood coffee bar with good light and better conversations.",
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=500&q=85",
        rating: "4.8",
        distance: "2.4 km",
        initials: "MP"
    },
    {
        name: "Sunday Market Finds",
        category: "Style",
        location: "Poblacion",
        description: "Curated vintage, handmade accessories, and clothes with a story.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=85",
        rating: "4.7",
        distance: "3.1 km",
        initials: "NR"
    }
];

const searchInput = document.querySelector("#search-input");
const clearSearch = document.querySelector(".clear-search");
const resultList = document.querySelector("#result-list");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const savedBusinesses = new Set();
let selectedCategory = "All";

function renderResults() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const results = businesses.filter((business) => {
        const searchableText = `${business.name} ${business.category} ${business.location} ${business.description}`.toLowerCase();
        return (selectedCategory === "All" || business.category === selectedCategory) && searchableText.includes(searchTerm);
    });

    resultCount.textContent = `${results.length} ${results.length === 1 ? "place" : "places"}`;
    resultList.innerHTML = results.map((business) => `
        <article class="search-result-card">
            <div class="result-image" style="background-image: url('${business.image}')" role="img" aria-label="${business.name}"></div>
            <div class="result-details">
                <div class="result-card-topline">
                    <span class="result-category">${business.category}</span>
                    <button class="save-button result-save ${savedBusinesses.has(business.id) ? "saved" : ""}" type="button" data-business-id="${business.id}" aria-label="Save ${business.name}">${savedBusinesses.has(business.id) ? "♥" : "♡"}</button>
                </div>
                <h3>${business.name}</h3>
                <p>${business.description}</p>
                <div class="result-meta">
                    <span>★ <strong>${business.rating}</strong></span>
                    <span>⌖ ${business.location}</span>
                </div>
                <div class="result-footer">
                    <span class="owner"><span class="owner-avatar">${business.initials}</span> ${business.distance} away</span>
                    <button class="view-link" type="button">View profile &rarr;</button>
                </div>
            </div>
        </article>
    `).join("");
    emptyState.hidden = results.length > 0;
}

document.querySelector("#category-list").addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (!categoryButton) return;
    selectedCategory = categoryButton.dataset.category;
    document.querySelectorAll(".category").forEach((button) => button.classList.toggle("active", button === categoryButton));
    renderResults();
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value ? "block" : "none";
    renderResults();
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    searchInput.focus();
    renderResults();
});

resultList.addEventListener("click", async (event) => {
    const saveButton = event.target.closest(".result-save");
    if (!saveButton) return;
    saveButton.classList.toggle("saved");
    saveButton.textContent = saveButton.classList.contains("saved") ? "♥" : "♡";
    try {
        const isSaved = saveButton.classList.contains("saved");
        await window.PisoApi.setSaved(Number(saveButton.dataset.businessId), isSaved);
        isSaved ? savedBusinesses.add(Number(saveButton.dataset.businessId)) : savedBusinesses.delete(Number(saveButton.dataset.businessId));
    } catch (error) {
        console.warn("Could not update saved business.", error);
    }
});

renderResults();

async function loadApiData() {
    if (!window.PisoApi) return;
    try {
        const [apiBusinesses, savedIds] = await Promise.all([
            window.PisoApi.getBusinesses(),
            window.PisoApi.getSaved()
        ]);
        businesses = apiBusinesses;
        savedIds.forEach((businessId) => savedBusinesses.add(businessId));
        renderResults();
    } catch (error) {
        console.warn("Using local search data because the API is unavailable.", error);
    }
}

loadApiData();
