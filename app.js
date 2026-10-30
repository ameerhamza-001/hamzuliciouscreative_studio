(() => {
  const cfg = window.HAMZULICIOUS_CONFIG || {};
  const ready = cfg.supabaseUrl && !cfg.supabaseUrl.startsWith("YOUR_") &&
    cfg.supabaseAnonKey && !cfg.supabaseAnonKey.startsWith("YOUR_") &&
    window.supabase;
  const db = ready ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const grid = document.getElementById("portfolioGrid");
  let projects = [];
  let currentFilter = "All";

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("menuToggle").addEventListener("click", () =>
    document.getElementById("mainNav").classList.toggle("open"));
  document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () =>
    document.getElementById("mainNav").classList.remove("open")));

  function escapeHTML(value="") {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  async function loadServices() {
    if (!db) return;
    const {data,error} = await db.from("services").select("*").order("sort_order");
    if (error || !data) return;
    const container = document.getElementById("serviceGrid");
    container.innerHTML = data.map((s,i)=>`<article class="service-card">
      <span class="service-number">${String(i+1).padStart(2,"0")}</span><div class="service-icon">✳</div>
      <h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description || "")}</p>
      <div class="service-price">${s.price ? "Starting at" : "Ask for a quote"} <b>${s.price ? escapeHTML(s.price) : "Custom pricing"}</b></div>
    </article>`).join("");
  }
  function renderProjects() {
    if (!projects.length) {
      grid.innerHTML = `<div class="portfolio-placeholder"><span>✳</span><h3>Your creative work belongs here.</h3><p>New projects uploaded through the studio dashboard will appear here.</p><a href="admin.html" class="text-link">Open studio dashboard →</a></div>`;
      return;
    }
    const shown = projects.filter(p => currentFilter === "All" || p.category === currentFilter);
    grid.innerHTML = shown.length ? shown.map(p => {
      const media = p.media_type === "video"
        ? `<video src="${escapeHTML(p.media_url)}" controls preload="metadata"></video>`
        : `<img src="${escapeHTML(p.media_url)}" alt="${escapeHTML(p.title)}" loading="lazy">`;
      return `<article class="project-card">${media}<div class="project-info"><small>${escapeHTML(p.category)}</small><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description || "")}</p></div></article>`;
    }).join("") : `<div class="portfolio-placeholder"><h3>More creations coming soon.</h3><p>No projects in this category yet.</p></div>`;
  }
  document.getElementById("portfolioFilters").addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]"); if (!btn) return;
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
    renderProjects();
  });
  async function loadProjects() {
    if (!db) return;
    const {data,error} = await db.from("projects").select("*").order("created_at",{ascending:false});
    if (!error && data) { projects = data; renderProjects(); }
  }
  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const number = (cfg.whatsappNumber || "").replace(/\D/g,"");
    if (!number || number === "ADDYOURWHATSAPPNUMBER") {
      alert("The studio WhatsApp number has not been added yet. Please update config.js with your number.");
      return;
    }
    const msg = `Hello Hamzulicious Creative Studio!%0A%0AName: ${encodeURIComponent(form.get("name"))}%0AContact: ${encodeURIComponent(form.get("reply"))}%0AService: ${encodeURIComponent(form.get("service"))}%0AProject details: ${encodeURIComponent(form.get("message") || "I would like to discuss a project.")}`;
    window.open(`https://wa.me/${number}?text=${msg}`,"_blank","noopener");
  });
  loadServices(); loadProjects();
})();
