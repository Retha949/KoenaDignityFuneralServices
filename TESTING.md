# Testing record

## Code-level checks completed

- [x] Rebuilt pages with a single HTML document structure, one head and one body per page.
- [x] Replaced machine-specific Windows image paths with repository-relative image paths.
- [x] Added a gallery page and updated main navigation/footer links.
- [x] Added responsive navigation controls and mobile menu state.
- [x] Added package search/filter logic, result count and no-results state.
- [x] Added FAQ disclosure controls and gallery lightbox interactions.
- [x] Added required fields, email input types, phone patterns, native HTML constraint validation and JavaScript field-level validation to both forms.
- [x] Checked all local navigation, image, stylesheet and script references across the six HTML pages; no missing local targets were found.
- [x] Checked that migrated image files exist under `assets/images/` and no legacy `asserts/images/` references remain in page markup or CSS.
- [x] Fixed whitespace normalisation in package search.
- [x] Verified the latest GitHub Pages Actions deployment workflow completed successfully.
- [x] Added page-specific titles, descriptions and image alternative text.
- [x] Added deployment workflow configuration.

## Manual browser tests still required

- [ ] Open every page on desktop and mobile widths and check layout/overflow.
- [ ] Test all main navigation and footer links.
- [ ] Confirm all images load and have suitable crop/alt text.
- [ ] Test package search with a matching term and a term with no matches.
- [ ] Test every package service filter and the Clear filters control.
- [ ] Open and close every gallery image using mouse, keyboard and Escape.
- [ ] Open and close FAQ disclosures using keyboard.
- [ ] Submit each form with empty/invalid values and confirm browser validation.
- [ ] Submit valid forms and confirm the email application opens with all expected fields.
- [ ] Check console for JavaScript errors and network requests for missing assets.
- [ ] Run an HTML validator and accessibility checker.
- [ ] Verify the published GitHub Pages URL and inspect each deployed page in a browser (the Actions deployment succeeded, but live-page inspection is still outstanding).
- [ ] Capture desktop and mobile screenshots for the project evidence folder.

## Limitations

This record documents source-level checks and the successful GitHub Actions deployment workflow. No interactive browser session, cross-browser test, real form delivery, accessibility audit, screenshot capture or direct live-page verification has been completed in this update. Forms currently open a prepared email in the visitor's email application; they do not transmit or store submissions on a server.
