# Koena Dignity Funeral Services — Project Structure

This project follows the separation-of-concerns approach used by the Campus-Cart repository while retaining Koena Dignity's own pages, content and features.

```text
KoenaDignityFuneralServices/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
├── asserts/
│   └── images/                 Existing project images (legacy folder name retained)
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

## Folder and file responsibilities

| Location | Purpose |
| --- | --- |
| `assets/css/styles.css` | Shared site-wide styling, responsive layouts and form-validation feedback. |
| `assets/js/script.js` | Shared browser behaviour, package filtering, gallery interactions and form validation. |
| `asserts/images/` | Existing site photographs and graphics. The original folder name is retained so image links remain valid. |
| `pages/` | Individual informational and interaction pages. |
| `.github/workflows/` | GitHub Actions deployment configuration. |
| `docs/` | Project documentation and technical notes. |

## Page responsibilities

| Page | Purpose |
| --- | --- |
| `index.html` | Home page and frequently asked questions. |
| `pages/about.html` | Organisation background, values and heritage. |
| `pages/packages.html` | Funeral package information and combined search/filter controls. |
| `pages/gallery.html` | Image gallery and accessible lightbox. |
| `pages/enquiry.html` | Funeral service enquiry form. |
| `pages/contact.html` | Contact information and contact form. |

## Asset references

The home page loads assets using paths relative to the repository root:

- CSS: `assets/css/styles.css`
- JavaScript: `assets/js/script.js`

Pages inside `pages/` use parent-relative paths:

- CSS: `../assets/css/styles.css`
- JavaScript: `../assets/js/script.js`

The image directory has not been renamed as part of this change. Keeping `asserts/images/` avoids breaking existing image references; it can be migrated separately after every image path has been mapped and verified.

## Architecture notes

The site remains a static HTML, CSS and vanilla JavaScript project. No framework, build step, backend or package installation is required. The shared CSS and JavaScript files are kept in dedicated asset folders, while page-specific content remains in `pages/`.
