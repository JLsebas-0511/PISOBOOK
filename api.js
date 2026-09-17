const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
}

window.PisoApi = {
    getBusinesses: () => apiRequest("/businesses"),
    getProfile: () => apiRequest("/profile"),
    getHistory: () => apiRequest("/profile/history"),
    getSettings: () => apiRequest("/settings"),
    getSaved: () => apiRequest("/saved"),
    setSaved: (businessId, saved) => apiRequest(`/saved/${businessId}`, { method: saved ? "POST" : "DELETE" }),
    setSetting: (setting, enabled) => apiRequest(`/settings/${setting}`, {
        method: "PATCH",
        body: JSON.stringify({ enabled })
    })
};
