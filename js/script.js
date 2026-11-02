/* Koena Dignity Funeral Services - progressive enhancement */
document.addEventListener("DOMContentLoaded", () => {
  // Responsive navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      navigation.classList.toggle("is-open", !expanded);
    });
  }

  // Funeral package search and service category filter
  const search = document.getElementById("package-search");
  const category = document.getElementById("package-category");
  const clear = document.getElementById("clear-package-filters");
  const resultCount = document.getElementById("package-results");
  const cards = Array.from(document.querySelectorAll(".package-card"));
  const terms = {
    arrangements: ["funeral arrangement", "funeral coordination", "administrative support"],
    coffin: ["coffin"],
    transport: ["transportation", "hearse"],
    memorial: ["memorial"],
    floral: ["floral"]
  };
  function filterPackages() {
    if (!search || !category || !resultCount || !cards.length) return;
    const query = search.value.trim().toLocaleLowerCase();
    const selected = category.value;
    let shown = 0;
    cards.forEach(card => {
      const content = card.textContent.toLocaleLowerCase();
      const matchesText = !query || content.includes(query);
      const categoryTerms = terms[selected] || [];
      const matchesCategory = selected === "all" || categoryTerms.some(term => content.includes(term));
      const visible = matchesText && matchesCategory;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    resultCount.textContent = shown === cards.length
      ? "Showing all " + shown + " funeral packages."
      : "Showing " + shown + " of " + cards.length + " funeral packages.";
    const empty = document.getElementById("package-empty");
    if (empty) empty.hidden = shown !== 0;
  }
  if (search && category && clear) {
    search.addEventListener("input", filterPackages);
    category.addEventListener("change", filterPackages);
    clear.addEventListener("click", () => {
      search.value = "";
      category.value = "all";
      filterPackages();
      search.focus();
    });
    filterPackages();
  }

  // Gallery lightbox
  const lightbox = document.getElementById("gallery-lightbox");
  if (lightbox) {
    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox-caption");
    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        image.src = item.dataset.full;
        image.alt = item.dataset.alt || "";
        caption.textContent = item.querySelector("span")?.textContent || image.alt;
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => { image.removeAttribute("src"); });
  }

  // Prefill the enquiry package when arriving from a package card
  const packageSelect = document.getElementById("preferred-package");
  if (packageSelect) {
    const requestedPackage = new URLSearchParams(window.location.search).get("package");
    if (requestedPackage) {
      const option = Array.from(packageSelect.options).find(item => item.text === requestedPackage);
      if (option) packageSelect.value = option.value;
    }
  }

  // JavaScript-only form validation and email hand-off (HTML validation is disabled).
  document.querySelectorAll(".email-form").forEach(form => {
    form.noValidate = true;
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      const fields = Array.from(form.querySelectorAll("input, select, textarea"));
      const errors = [];
      let firstInvalid = null;

      const fail = (field, message) => {
        if (!firstInvalid) firstInvalid = field;
        errors.push(message);
      };

      fields.forEach(field => {
        const value = field.type === "checkbox" ? field.checked : field.value.trim();
        const label = form.querySelector('label[for="' + field.id + '"]')?.textContent.trim()
          || field.name || "This field";

        if (field.type === "checkbox") {
          if (field.dataset.requiredConsent === "true" && !field.checked) {
            fail(field, "Please agree to the consent statement.");
          }
          return;
        }

        if (field.hasAttribute("data-required") && !value) {
          fail(field, label + " is required.");
          return;
        }
        if (!value) return;

        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fail(field, "Please enter a valid email address.");
        } else if (field.type === "tel" && !/^[0-9+()\s-]{7,20}$/.test(value)) {
          fail(field, "Enter a valid phone number using 7 to 20 digits, spaces or +()- characters.");
        } else if ((field.id === "contact-name" || field.id === "first-name" || field.id === "surname") && value.length < 2) {
          fail(field, label + " must contain at least 2 characters.");
        } else if ((field.id === "contact-message" || field.id === "enquiry-message") && value.length < 10) {
          fail(field, "Please provide at least 10 characters of message information.");
        } else if (field.type === "date" && dateInput && value < dateInput.min) {
          fail(field, "Please choose today or a future date.");
        } else if (field.type === "number" && field.id === "attendees") {
          const number = Number(value);
          if (!Number.isInteger(number) || number < 1 || number > 10000) {
            fail(field, "Estimated attendees must be a whole number between 1 and 10,000.");
          }
        }
      });

      // Explicit required-field rules for the two forms.
      const requiredIds = form.dataset.formPurpose === "Contact message"
        ? ["contact-name", "contact-email", "contact-phone", "contact-subject", "contact-message"]
        : ["first-name", "surname", "enquiry-phone", "enquiry-email", "contact-method", "enquiry-type", "enquiry-message"];
      requiredIds.forEach(id => {
        const field = form.querySelector("#" + id);
        if (field && !field.value.trim() && !errors.some(message => message.startsWith((form.querySelector('label[for="' + id + '"]')?.textContent.trim() || field.name) + " is required"))) {
          fail(field, (form.querySelector('label[for="' + id + '"]')?.textContent.trim() || field.name) + " is required.");
        }
      });
      const consent = form.querySelector('input[name="Consent"]');
      if (consent && !consent.checked) fail(consent, "Please agree that your information may be used to respond to this enquiry.");

      if (errors.length) {
        if (feedback) {
          feedback.textContent = "Please correct the following: " + errors.join(" ");
          feedback.setAttribute("aria-live", "assertive");
        }
        firstInvalid?.focus();
        return;
      }

      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (key.toLowerCase() !== "consent") lines.push(key + ": " + value);
      }
      const purpose = form.dataset.formPurpose || "Website enquiry";
      const subject = encodeURIComponent(purpose + " - Koena Dignity Funeral Services");
      const body = encodeURIComponent(lines.join("\n"));
      const mailto = "mailto:info@koenadignity.co.za?subject=" + subject + "&body=" + body;
      if (feedback) {
        feedback.textContent = "Your email application should open with the details prepared. Please review the message and press Send in your email application.";
        feedback.setAttribute("aria-live", "polite");
      }
      window.location.href = mailto;
    });
  });
});