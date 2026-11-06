# Hamzulicious Creative Studio

A responsive, luxury-inspired creative studio portfolio built with HTML, CSS and JavaScript, with optional Supabase-powered content management.

## Included
- Premium burgundy, ivory, charcoal and muted-gold visual identity
- Home, About, Services, Portfolio, Wedding Edit, creative process and Contact sections
- Responsive mobile navigation and accessible portfolio filters
- Ten portfolio categories shared by the public site and admin dashboard
- WhatsApp enquiry form
- Supabase admin login, editable service prices, project uploads and deletion
- GitHub Pages-compatible static deployment

## Portfolio categories
1. Brand Identity
2. Packaging Design
3. Marketing & Advertising
4. Social Media Design
5. Poster & Print Design
6. Wedding & Invitation Design
7. Restaurant & Menu Design
8. Presentation & Editorial Design
9. Video & Motion Graphics
10. Website & UI Design

## Personalise the website
Edit `config.js` to update the studio WhatsApp number, contact email, Supabase project URL and Supabase anon/public key. The existing project values have been preserved.

Never add a Supabase service-role key or other secret to browser code or a public repository.

## Supabase admin setup
1. In Supabase, open SQL Editor and run `SUPABASE_SETUP.sql`.
2. In Authentication > Users, create the studio administrator account.
3. In Authentication > URL Configuration, add the deployed website URL to Site URL and Redirect URLs.
4. Deploy the website, then open `admin.html` and sign in.
5. Add services/prices and upload portfolio projects from the dashboard.

The portfolio storage bucket is public so visitors can view published creative work. Upload, update and delete operations require an authenticated user under the included policies.

## Publish on GitHub Pages
1. Extract the ZIP and upload the contents of `hamzuliciouscreative_studio-main` to the root of your existing repository.
2. Keep `index.html`, `styles.css`, `app.js`, `config.js` and `admin.html` at the repository root.
3. In repository Settings > Pages, select Deploy from a branch, branch `main`, folder `/ (root)`.
4. Save and wait for GitHub Pages to publish.

Because this is an existing repository, upload/commit the updated files to that repository rather than creating a new one.

## Before launch
- Confirm the WhatsApp number and contact email in `config.js`.
- Add real service prices in the Studio dashboard (or change the public copy to quote-only).
- Upload original portfolio work you own or have permission to display.
- Test the enquiry form and admin sign-in on desktop and mobile.
- Verify the Supabase Site URL and Redirect URLs match the final published URL.


## Portfolio image and video display
- Uploaded projects appear newest first automatically.
- Use the category selector when uploading each project to group it in the correct portfolio filter.
- The media display uses `object-fit: contain`, so the full original image/video remains visible without cropping on desktop or mobile. Empty space around unusually wide/tall media is intentional; it preserves the complete artwork.
- For a different display order, upload projects in the desired sequence (the newest appears first). A custom drag-and-drop ordering feature would require an additional database sort field and admin controls.


## Combined portfolio update

This package combines the premium redesign, responsive media-fit styles, and the Admin Dashboard category editor. Existing Supabase settings in `config.js` are retained. In the dashboard, use **Save category** to move a project, or **Add to category** to show the same uploaded media in an additional category. Shared media is shown once in the public **All** filter and in each selected category filter.

After uploading this package to GitHub, preserve your existing Supabase project and Storage bucket. No media re-upload or database reset is required.
