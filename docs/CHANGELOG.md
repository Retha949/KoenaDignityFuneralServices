# Changelog
- Expanded the funeral package catalogue from 4 to 24 illustrative options, added category-based filtering for the new package types, and made all 24 options available from the enquiry form.

## 2026-11-02 — Website improvement pass

- Rebuilt the five existing pages with valid, consistent document structure and shared navigation.
- Migrated all website image references to the shared `assets/images/` directory.
- Added a dedicated gallery page and repaired missing page links.
- Added responsive mobile navigation and a skip-to-content link.
- Added package keyword search, service filters, result counts and an empty-results message.
- Added an FAQ accordion and an image gallery lightbox.
- Reworked contact and enquiry forms with semantic labels, HTML5 constraints, client-side phone validation and accessible inline validation feedback.
- Enabled native browser constraint validation alongside the existing inline JavaScript validation and accessible field feedback.
- Corrected whitespace handling in package search.
- Added page-specific titles and meta descriptions, responsive styling and reduced-motion support.
- Added README, references, testing notes and a GitHub Pages deployment workflow.

### Known limitations / follow-up

- Web3Forms submission depends on a valid access key and the deployed website domain being allowed in the Web3Forms dashboard. A real submission test from the deployed domain is still required.
- The Contact page uses Leaflet with OpenStreetMap street tiles, an OpenTopoMap terrain layer, a location marker popup, zoom/pan controls, metric scale, layer switcher and opt-in browser geolocation. The supplied pin is in Gqeberha while the site's proposed service area still says Bloemfontein; confirm the business location before public launch.
- Business contact details, package inclusions and image permissions must be verified before public launch.
- Browser-based testing of Leaflet tile loading, marker popup, layer switching, geolocation permission handling, and desktop/mobile usability on the deployed site remains to be completed.


## 2026-11-02 — Interactive map requirements

- Added responsive map container styling so the Google Maps iframe fills the available width and maintains a usable height on desktop and mobile.
- Documented the four WEDE5020 POE Part 3 minimum map checks: deployed loading, meaningful marker, user interaction (zoom/pan or marker information), and mobile usability.
- Added local testing instructions and a public-launch location verification note to the README.


## 2026-11-02 — Leaflet map enhancements

- Replaced the Contact page's embedded Google Map with a Leaflet map.
- Added OpenStreetMap street tiles and an OpenTopoMap terrain layer with attribution.
- Added a keyboard-accessible business marker and popup with address and directions.
- Added zoom/pan, metric scale, map-layer switching, and an opt-in locate-me control using browser geolocation.
- Added responsive map styling and a status message for map readiness and location permission feedback.
- Retained the external Google Maps directions link as a fallback.


## 2026-11-02 — Web3Forms integration

- Connected the Contact form and both Enquiry form layouts to the Web3Forms submission endpoint.
- Added the supplied access key and form-specific email subjects to each form.
- Replaced the email-app handoff with asynchronous fetch submission using the JSON response mode.
- Added a sending state, disabled submit button during submission, inline success/error feedback, and form reset only after successful delivery.
- Preserved existing client-side validation and field-level accessibility feedback.
- Documented the need to allow-list the deployed domain in the Web3Forms dashboard and verify the notification recipient with a live test submission.
