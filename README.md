# 🦷 The Minimalist Dentist

> A refined, patient-first digital web application built with a modern, minimalist aesthetic. Designed for seamless navigation, evidence-based oral care guidance, and aesthetic dental care education.

---

## 📁 Project Structure

```text
theminimalistdentist/
├── index.html                                 # Landing / Home Page
├── services.html                              # Comprehensive Services & Treatments
├── blog.html                                  # Patient Education & Article Directory
├── blog-post.html                             # Dynamic Article Reader Template
├── contact.html                               # Appointment & Contact Page
├── js/
│   └── blog-data.js                           # Centralized Article Data & Content
├── 10-foods-that-quietly-damage-your-enamel.html
├── dental-anxiety-is-real.html
├── dental-implants-guide-for-first-timers.html
├── real-reason-gums-bleed.html
├── when-should-children-get-first-check-up.html
├── whitening-strips-vs-in-clinic-whitening.html
├── why-most-people-brush-wrong.html
├── package.json                               # Node project config & dev scripts
└── README.md                                  # Documentation
```

---

## 🚀 How to Run Locally

### Method 1: NPM Scripts (Recommended)
Make sure Node.js is installed on your system, then run:

```bash
npm start
```
*Or during development:*
```bash
npm run dev
```

This starts the unified web server with static assets and the active Resend appointment endpoint at [http://localhost:3000](http://localhost:3000).

---

## 📧 Appointment Email Setup (Resend)

Appointment submissions on [`contact.html`](file:///e:/EVOLVE WEBSITES/theminimalistdentist/contact.html) are delivered directly to **`contact@theminimalistdentist.in`** via [Resend](https://resend.com).

1. Obtain a free API key at [resend.com/api-keys](https://resend.com/api-keys).
2. Open or create [`.env`](file:///e:/EVOLVE WEBSITES/theminimalistdentist/.env) in the project root:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM="The Minimalist Dentist <onboarding@resend.dev>"
   RESEND_TO="contact@theminimalistdentist.in"
   ```
3. When deployed to **Vercel** or **Netlify**, add `RESEND_API_KEY` to your hosting project's Environment Variables. The included [`api/send.js`](file:///e:/EVOLVE WEBSITES/theminimalistdentist/api/send.js) serves as a serverless function automatically.

### Method 2: Live Server (VS Code / Antigravity IDE)
1. Right-click [`index.html`](file:///e:/EVOLVE WEBSITES/theminimalistdentist/index.html) in your editor.
2. Select **Open with Live Server**.

### Method 3: Direct Browser File
Double-click [`index.html`](file:///e:/EVOLVE WEBSITES/theminimalistdentist/index.html) to open directly in Google Chrome, Microsoft Edge, or Firefox.

---

## ✨ Features & Pages

- **Home Page (`index.html`)**: Features practice philosophy, core services overview, featured articles, and quick booking CTA.
- **Services (`services.html`)**: Detailed overview of Preventive, Cosmetic, Restorative, and Anxiety-Free Pediatric care.
- **Blog Hub (`blog.html`)**: Interactive patient education hub featuring curated dental articles.
- **Dynamic Reader (`blog-post.html`)**: Responsive article viewer supporting URL params (`?id=...`).
- **Contact & Booking (`contact.html`)**: Interactive booking form, clinic hours, location details, and direct contact options.

---

## 🛠 Tech Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS (Custom Design System, Typography & CSS Variables)
- **Scripting**: Vanilla JavaScript (ES6 Modules/Objects)
- **Fonts**: Google Fonts (*Cormorant Garamond* & *Inter*)
