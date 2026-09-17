const editProfileButton = document.querySelector("#edit-profile");
const profileStatus = document.querySelector("#profile-status");
const viewAllButton = document.querySelector("#view-all");
const previousStores = document.querySelector("#previous-stores");
const pictureInput = document.querySelector("#profile-picture");
const picturePreview = document.querySelector("#picture-preview");

if (editProfileButton) editProfileButton.addEventListener("click", () => {
    editProfileButton.textContent = editProfileButton.textContent === "Edit profile" ? "Profile ready" : "Edit profile";
    profileStatus.textContent = "Profile editing will be available soon.";
});

if (pictureInput && picturePreview) pictureInput.addEventListener("change", () => {
    const [file] = pictureInput.files;
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        pictureInput.value = "";
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        picturePreview.style.backgroundImage = `url('${reader.result}')`;
        picturePreview.classList.add("has-image");
        picturePreview.querySelector("span").textContent = "";
    });
    reader.readAsDataURL(file);
});

document.querySelectorAll("[data-setting]").forEach((setting) => {
    setting.addEventListener("click", async () => {
        const toggle = setting.querySelector(".toggle");
        toggle.classList.toggle("is-on");
        const enabled = toggle.classList.contains("is-on");
        profileStatus.textContent = `${setting.querySelector("strong").textContent} ${enabled ? "enabled" : "disabled"}.`;
        try {
            await window.PisoApi.setSetting(setting.dataset.setting, enabled);
        } catch (error) {
            toggle.classList.toggle("is-on");
            profileStatus.textContent = "Could not save that setting.";
        }
    });
});

if (viewAllButton && previousStores) viewAllButton.addEventListener("click", () => {
    previousStores.classList.toggle("show-all");
    viewAllButton.textContent = previousStores.classList.contains("show-all") ? "Show less" : "View all";
});

async function loadApiProfile() {
    if (!document.querySelector("#profile-title")) return;
    if (!window.PisoApi) return;
    try {
        const [profile, history, settings] = await Promise.all([
            window.PisoApi.getProfile(),
            window.PisoApi.getHistory(),
            window.PisoApi.getSettings()
        ]);
        document.querySelector("#profile-title").textContent = profile.name;
        document.querySelector(".profile-large-avatar").textContent = profile.initials;
        document.querySelector(".profile-identity > p:last-child").textContent = `Local finder · ${profile.location}`;
        document.querySelectorAll(".profile-stats strong").forEach((stat, index) => {
            stat.textContent = [profile.stats.saved, profile.stats.visited, profile.stats.shared][index];
        });
        document.querySelectorAll(".previous-store").forEach((store, index) => {
            const business = history[index];
            if (!business) return;
            store.querySelector(".result-category").textContent = business.category;
            store.querySelector("h3").textContent = business.name;
            store.querySelector("p").textContent = `Visited ${business.visited}`;
            store.querySelector(".previous-store-image").style.backgroundImage = `url('${business.image}')`;
        });
        document.querySelectorAll("[data-setting]").forEach((setting) => {
            setting.querySelector(".toggle").classList.toggle("is-on", settings[setting.dataset.setting]);
        });
    } catch (error) {
        console.warn("Using local profile data because the API is unavailable.", error);
    }
}

loadApiProfile();
