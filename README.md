# Koena Dignity Funeral Services

A responsive multi-page academic website for Koena Dignity Funeral Services, a proposed funeral parlour based in Bloemfontein, Free State.

## Website pages

- `index.html` — home page and frequently asked questions
- `pages/about.html` — background, values and heritage
- `pages/packages.html` — package descriptions with keyword search and service filters
- `pages/gallery.html` — image gallery with an accessible lightbox
- `pages/enquiry.html` — enquiry form
- `pages/contact.html` — contact details and contact form

## Features

- Responsive navigation with a mobile menu and skip-to-content link.
- Semantic HTML, page-specific titles and meta descriptions, and descriptive image alternative text.
- Client-side package search and service-category filtering.
- FAQ accordion using native HTML `details` and `summary` elements.
- Gallery lightbox using the native HTML dialog element.
- HTML5 form constraints, email validation, phone format checks and client-side feedback.
- Package enquiry links preselect the chosen package on the enquiry page.
- Reduced-motion support.

## Forms: important limitation

The contact and enquiry forms validate input and prepare an email using the visitor's configured email application (`mailto:`). The visitor must review and press **Send** in that application. The website does **not** currently send form data to a server or store submissions. To provide true online form submission, connect a form backend (for example Formspree, Netlify Forms or a custom server endpoint), configure its destination and update the form action before production use.

## Run locally

1. Clone or download this repository.
2. Open the repository folder.
3. Open `index.html` in a browser, or run a local static server from the repository root.
4. Navigate through the main menu and test the filters, gallery and forms.

No build step or package installation is required.

## Deployment

A GitHub Actions workflow is included at `.github/workflows/deploy.yml` to publish the static site to GitHub Pages. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. Then check the Actions tab for the deployment result and Pages settings for the published URL.

## Before public launch

- Confirm the actual business street address before adding an interactive map.
- Verify the telephone number, WhatsApp number and email address; current contact values were inherited from the academic project and may be placeholders.
- Confirm package names, inclusions, availability and pricing with the business.
- Connect and test a real form backend if online submission is required.
- Check image ownership, permissions and required credits.
- Test on desktop and mobile browsers and run HTML/accessibility validation.

## Project structure

The repository follows an organised assets/pages/docs layout. See [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for the full explanation.

```
.
├── .github/workflows/
├── assets/
│   ├── css/styles.css
│   └── js/script.js
├── asserts/images/  (existing image paths retained)
├── docs/
│   └── PROJECT-STRUCTURE.md
├── pages/
│   ├── about.html
│   ├── contact.html
│   ├── enquiry.html
│   ├── gallery.html
│   └── packages.html
├── index.html
├── README.md
├── CHANGELOG.md
├── REFERENCES.md
├── TESTING.md
├── robots.txt
└── sitemap.xml
```
