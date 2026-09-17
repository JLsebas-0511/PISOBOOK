const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const businesses = [
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

const profile = {
    name: "Julianne M.",
    initials: "JM",
    location: "Mandaluyong",
    stats: { saved: 12, visited: 8, shared: 3 },
    history: [
        { businessId: 1, visited: "Aug 24, 2026" },
        { businessId: 2, visited: "Aug 18, 2026" },
        { businessId: 3, visited: "Aug 09, 2026" }
    ]
};

const settings = {
    notifications: true,
    location: true,
    private: false
};
const savedBusinesses = new Set();

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});
app.use(express.static(path.join(__dirname, ".."), { dotfiles: "allow" }));

app.get("/api/businesses", (req, res) => res.json(businesses));
app.get("/api/profile", (req, res) => res.json(profile));
app.get("/api/profile/history", (req, res) => {
    res.json(profile.history.map((visit) => ({
        ...businesses.find((business) => business.id === visit.businessId),
        visited: visit.visited
    })));
});
app.get("/api/settings", (req, res) => res.json(settings));
app.patch("/api/settings/:setting", (req, res) => {
    if (!(req.params.setting in settings) || typeof req.body.enabled !== "boolean") {
        return res.status(400).json({ error: "Unknown setting or invalid enabled value." });
    }
    settings[req.params.setting] = req.body.enabled;
    res.json({ setting: req.params.setting, enabled: settings[req.params.setting] });
});
app.get("/api/saved", (req, res) => res.json([...savedBusinesses]));
app.post("/api/saved/:businessId", (req, res) => {
    const businessId = Number(req.params.businessId);
    if (!businesses.some((business) => business.id === businessId)) return res.status(404).json({ error: "Business not found." });
    savedBusinesses.add(businessId);
    res.status(201).json({ saved: true, businessId });
});
app.delete("/api/saved/:businessId", (req, res) => {
    savedBusinesses.delete(Number(req.params.businessId));
    res.json({ saved: false, businessId: Number(req.params.businessId) });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
    console.log(`PISOBOOK running at http://localhost:${PORT}`);
});
