(() => {
 const cfg=window.HAMZULICIOUS_CONFIG||{},status=document.getElementById("status");
 const configured=window.supabase&&cfg.supabaseUrl&&!cfg.supabaseUrl.startsWith("YOUR_")&&cfg.supabaseAnonKey&&!cfg.supabaseAnonKey.startsWith("YOUR_");
 if(!configured){status.textContent="Setup required: add your Supabase project URL and anon/public key in config.js, then run the database setup in SUPABASE_SETUP.sql. The admin dashboard becomes active after setup.";return;}
 const db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
 const loginPanel=document.getElementById("loginPanel"),dashboard=document.getElementById("dashboard"),logout=document.getElementById("logoutBtn");
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function message(t){status.textContent=t;}
 async function refresh(){
  const {data:{session}}=await db.auth.getSession();
  loginPanel.classList.toggle("hidden",!!session);dashboard.classList.toggle("hidden",!session);logout.classList.toggle("hidden",!session);
  if(session){message("Signed in. Changes you save here are published to your website.");await loadServices();await loadProjects();}
  else message("Please sign in to manage your studio website.");
 }
 document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const {error}=await db.auth.signInWithPassword({email:f.get("email"),password:f.get("password")});if(error)message(error.message);else{e.currentTarget.reset();await refresh();}});
 logout.addEventListener("click",async()=>{await db.auth.signOut();await refresh();});
 async function loadServices(){
  const {data,error}=await db.from("services").select("*").order("sort_order");if(error){message("Service list: "+error.message);return;}
  document.getElementById("serviceList").innerHTML=(data||[]).map(s=>`<div class="admin-row"><div><strong>${esc(s.name)}</strong><small>${esc(s.price||"No price set")} · ${esc(s.description||"")}</small></div><div class="admin-actions"><button class="admin-btn secondary" data-edit-service="${s.id}">Edit</button><button class="admin-btn danger" data-delete-service="${s.id}">Delete</button></div></div>`).join("")||"<p class='muted'>No services yet. Add your first service above.</p>";
  document.querySelectorAll("[data-edit-service]").forEach(b=>b.onclick=()=>editService(data.find(s=>s.id===b.dataset.editService)));
  document.querySelectorAll("[data-delete-service]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this service?")){const {error}=await db.from("services").delete().eq("id",b.dataset.deleteService);if(error)message(error.message);else loadServices();}});
 }
 function editService(s){const f=document.getElementById("serviceForm");f.elements.name.value=s.name;f.elements.price.value=s.price||"";f.elements.description.value=s.description||"";f.elements.sort_order.value=s.sort_order??10;f.dataset.editId=s.id;f.querySelector("button").textContent="Update service";f.scrollIntoView({behavior:"smooth"});}
 document.getElementById("serviceForm").addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget,d={name:f.elements.name.value.trim(),price:f.elements.price.value.trim(),description:f.elements.description.value.trim(),sort_order:Number(f.elements.sort_order.value)||10};const id=f.dataset.editId;const result=id?await db.from("services").update(d).eq("id",id):await db.from("services").insert(d);if(result.error)message(result.error.message);else{message("Service saved.");f.reset();delete f.dataset.editId;f.querySelector("button").textContent="Save service";loadServices();}});
 async function loadProjects(){
  const {data,error}=await db.from("projects").select("*").order("created_at",{ascending:false});if(error){message("Project list: "+error.message);return;}
  document.getElementById("projectList").innerHTML=(data||[]).map(p=>`<div class="admin-row"><div><strong>${esc(p.title)}</strong><small>${esc(p.category)} · ${esc(p.media_type)}</small></div><button class="admin-btn danger" data-delete-project="${p.id}" data-path="${esc(p.storage_path)}">Delete</button></div>`).join("")||"<p class='muted'>Your uploaded projects will appear here.</p>";
  document.querySelectorAll("[data-delete-project]").forEach(b=>b.onclick=async()=>{if(!confirm("Delete this project?"))return;const path=b.dataset.path;const id=b.dataset.deleteProject;const a=await db.storage.from("portfolio").remove([path]);if(a.error){message(a.error.message);return;}const r=await db.from("projects").delete().eq("id",id);if(r.error)message(r.error.message);else{message("Project deleted.");loadProjects();}});
 }
 document.getElementById("projectForm").addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget,file=f.elements.media.files[0];if(!file)return;const max=50*1024*1024;if(file.size>max){message("Please choose a file smaller than 50 MB.");return;}const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]/g,"-");const path=`${Date.now()}-${safe}`;message("Uploading project…");const up=await db.storage.from("portfolio").upload(path,file,{upsert:false,contentType:file.type});if(up.error){message(up.error.message);return;}const {data:{publicUrl}}=db.storage.from("portfolio").getPublicUrl(path);const row={title:f.elements.title.value.trim(),category:f.elements.category.value,description:f.elements.description.value.trim(),media_url:publicUrl,media_type:file.type.startsWith("video/")?"video":"image",storage_path:path};const ins=await db.from("projects").insert(row);if(ins.error){await db.storage.from("portfolio").remove([path]);message(ins.error.message);return;}message("Project uploaded and published.");f.reset();loadProjects();});
 db.auth.onAuthStateChange(()=>setTimeout(refresh,0));refresh();
})();
