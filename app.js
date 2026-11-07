(() => {
  const cfg = window.HAMZULICIOUS_CONFIG || {};
  const ready = cfg.supabaseUrl && !cfg.supabaseUrl.startsWith("YOUR_") &&
    cfg.supabaseAnonKey && !cfg.supabaseAnonKey.startsWith("YOUR_") && window.supabase;
  const db = ready ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const grid = document.getElementById("portfolioGrid");
  const filters = document.getElementById("portfolioFilters");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const categories = [
    "Brand Identity", "Packaging Design", "Marketing & Advertising",
    "Social Media Design", "Poster & Print Design", "Wedding & Invitation Design",
    "Restaurant & Menu Design", "Presentation & Editorial Design",
    "Video & Motion Graphics", "Website & UI Design"
  ];
  let projects = [];
  let currentFilter = "All";

  document.getElementById("year").textContent = new Date().getFullYear();
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  async function loadServices() {
    if (!db) return;
    const { data, error } = await db.from("services").select("*").order("sort_order");
    if (error || !data || !data.length) return;
    document.getElementById("serviceGrid").innerHTML = data.map((s, i) => `
      <article class="service-card">
        <span class="service-number">${String(i + 1).padStart(2, "0")}</span>
        <div class="service-icon" aria-hidden="true">✳</div>
        <h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description || "")}</p>
        <div class="service-price">${s.price ? "Starting at" : "Ask for a quote"} <b>${s.price ? escapeHTML(s.price) : "Custom pricing"}</b></div>
      </article>`).join("");
  }
  // Convert older Admin Dashboard category labels into the current portfolio categories.
  // This keeps projects uploaded before the redesign visible in the correct filters.
  function getProjectCategories(project) {
    const raw = String(project.category || "").trim().toLowerCase();
    const title = String(project.title || "").trim().toLowerCase();
    const description = String(project.description || "").trim().toLowerCase();
    const text = `${title} ${description}`;
    const weddingRelated = /\b(wedding|invitation|invite|haldi|mehndi|mehandi|nikah|shaadi|shagun|bride|groom)\b/.test(text);

    const aliases = {
      "branding": "Brand Identity",
      "brand": "Brand Identity",
      "brand identity": "Brand Identity",
      "packaging": "Packaging Design",
      "marketing": "Marketing & Advertising",
      "advertising": "Marketing & Advertising",
      "social media": "Social Media Design",
      "poster": "Poster & Print Design",
      "print": "Poster & Print Design",
      "wedding": "Wedding & Invitation Design",
      "invitation": "Wedding & Invitation Design",
      "restaurant": "Restaurant & Menu Design",
      "menu": "Restaurant & Menu Design",
      "editorial": "Presentation & Editorial Design",
      "presentation": "Presentation & Editorial Design",
      "video": "Video & Motion Graphics",
      "motion graphics": "Video & Motion Graphics",
      "website": "Website & UI Design",
      "ui": "Website & UI Design"
    };

    let category = aliases[raw] || categories.find(c => c.toLowerCase() === raw) || "";
    if (raw === "other" || !category) {
      if (/\b(visiting card|business card|logo|identity|branding)\b/.test(text)) category = "Brand Identity";
      else if (weddingRelated) category = "Wedding & Invitation Design";
    }

    const result = category ? [category] : [];
    // Wedding invitation/ceremony videos should appear in BOTH requested categories.
    if (raw === "video" && weddingRelated && !result.includes("Wedding & Invitation Design")) {
      result.push("Wedding & Invitation Design");
    }
    return result;
  }

  function renderProjects() {
    if (!projects.length) {
      grid.innerHTML = `<div class="portfolio-placeholder"><span>✳</span><h3>Your creative work belongs here.</h3><p>Upload your first project through the studio dashboard and it will appear here.</p><a href="admin.html" class="text-link">Open studio dashboard →</a></div>`;
      return;
    }
    let shown = projects.filter(p => currentFilter === "All" || getProjectCategories(p).includes(currentFilter));
    // A project may have more than one category listing that reuses the same uploaded media.
    // Show the asset once in All, but keep it visible in every category it belongs to.
    if (currentFilter === "All") {
      const seenMedia = new Set();
      shown = shown.filter(p => {
        const key = p.storage_path || p.media_url || p.id;
        if (seenMedia.has(key)) return false;
        seenMedia.add(key);
        return true;
      });
    }
    grid.innerHTML = shown.length ? shown.map(p => {
      const media = p.media_type === "video"
        ? `<video src="${escapeHTML(p.media_url)}" controls preload="metadata" playsinline aria-label="${escapeHTML(p.title)}"></video>`
        : `<img src="${escapeHTML(p.media_url)}" alt="${escapeHTML(p.title)}" loading="lazy">`;
      const displayCategories = getProjectCategories(p);
      const categoryLabel = currentFilter === "All"
        ? (displayCategories.join(" · ") || String(p.category || "Other"))
        : currentFilter;
      return `<article class="project-card">${media}<div class="project-info"><small>${escapeHTML(categoryLabel)}</small><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description || "")}</p></div></article>`;
    }).join("") : `<div class="portfolio-placeholder"><h3>More creations coming soon.</h3><p>No projects have been added to this category yet.</p></div>`;
  }
  filters.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    filters.querySelectorAll(".filter").forEach(b => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    renderProjects();
  });
  async function loadProjects() {
    if (!db) return;
    const { data, error } = await db.from("projects").select("*").order("created_at", { ascending: false });
    if (!error && data) { projects = data; renderProjects(); }
  }
  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const number = (cfg.whatsappNumber || "").replace(/\D/g, "");
    if (!number || number === "ADDYOURWHATSAPPNUMBER") {
      alert("The studio WhatsApp number has not been added yet. Please update config.js with your number.");
      return;
    }
    const message = [
      "Hello Hamzulicious Creative Studio!",
      `Name: ${form.get("name")}`,
      `Contact: ${form.get("reply")}`,
      `Service: ${form.get("service")}`,
      `Project details: ${form.get("message") || "I would like to discuss a project."}`
    ].join("\n");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
  loadServices();
  loadProjects();
})();
