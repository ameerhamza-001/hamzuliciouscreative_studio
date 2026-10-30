# Hamzulicious Creative Studio

A responsive graphic design studio portfolio website with:
- Home, studio story, services, portfolio, wedding edit and contact sections
- Mobile navigation and category filters
- WhatsApp enquiry form
- Supabase-powered admin login, editable service prices, project uploads and deletion
- GitHub Pages deployment support

## 1. Personalise the website

Open `config.js` and replace:
- The WhatsApp number and contact email have already been added to `config.js`. The number is configured as India (+91): `916299459231`.
- `YOUR_SUPABASE_PROJECT_URL`
- `YOUR_SUPABASE_ANON_PUBLIC_KEY`

The Supabase anon/public key is designed to be used in browser applications. Never paste a Supabase `service_role` or secret key into this website.

## 2. Connect Supabase for the admin dashboard

1. Create a project at https://supabase.com/
2. In Project Settings > API, copy the Project URL and anon/public key into `config.js`.
3. In Supabase > SQL Editor, run the full contents of `SUPABASE_SETUP.sql`.
4. In Authentication > Users, create your own admin user with your email and a strong password. Do not make public sign-up available.
5. In Authentication > URL Configuration, add your deployed website URL to Site URL and Redirect URLs, for example `https://YOUR-GITHUB-USERNAME.github.io/hamzulicious-creative-studio/`.
6. Open `admin.html` on your deployed website and sign in.

The admin dashboard can then:
- Add, edit and delete service entries and starting prices
- Upload image/video projects
- Delete projects from the public portfolio

Uploaded portfolio files are public so website visitors can see them. Only authenticated users can upload, change or delete them under the included policies.

## 3. Publish with GitHub Pages

1. Sign in to https://github.com/ and create a new **public** repository named `hamzulicious-creative-studio`.
2. Upload all files and the `assets` folder from this project into the repository's root (not inside an extra nested folder).
3. Open the repository's Settings > Pages.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. Your default URL will be:
   `https://YOUR-GITHUB-USERNAME.github.io/hamzulicious-creative-studio/`

GitHub Pages may take a few minutes to publish the first time.

## 4. Use your own domain (optional)

Buy a domain from a domain registrar, then add it in repository Settings > Pages > Custom domain. Follow GitHub's displayed DNS instructions at your registrar. A custom domain is separate from GitHub Pages hosting and usually has a yearly registration cost.

## 5. Before sharing

- Replace the WhatsApp number in `config.js`.
- Add your real prices in Studio dashboard.
- Upload your own portfolio work (only work you own or have permission to display).
- Test the enquiry form on a phone.
- Add your business email, social links and privacy information if needed.

## Notes

- The contact form opens a pre-filled WhatsApp message; the visitor presses Send in WhatsApp. It does not silently send or store messages.
- Supabase is required for secure admin login and persistent price/project management. Without Supabase configuration, the public website still loads, but live admin features remain unavailable.
- GitHub Pages serves static files. Do not store passwords, secret API keys or private customer information in the repository.
