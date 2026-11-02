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

  // JavaScript-only validation for every form on the website.
  const formRules = {
    "Contact message": {
      required: ["contact-name", "contact-email", "contact-phone", "contact-subject", "contact-message"],
      consent: false
    },
    "Funeral services enquiry": {
      required: ["first-name", "surname", "enquiry-phone", "enquiry-email", "contact-method", "enquiry-type", "enquiry-message"],
      consent: true
    }
  };

  const todayLocal = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  document.querySelectorAll("form").forEach(form => {
    // novalidate prevents browser pop-ups; all checks below are handled here.
    form.noValidate = true;
    const feedback = form.querySelector(".form-feedback");
    const purpose = form.dataset.formPurpose || "Website enquiry";
    const rules = formRules[purpose] || { required: [], consent: false };
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    const dateField = form.querySelector('input[type="date"]');

    const fieldLabel = field => {
      const label = field.id && form.querySelector('label[for="' + field.id + '"]');
      return (label ? label.textContent : field.name || "This field").trim();
    };

    const clearFieldError = field => {
      field.removeAttribute("aria-invalid");
      field.classList.remove("is-invalid");
    };

    fields.forEach(field => {
      field.addEventListener("input", () => {
        clearFieldError(field);
        if (feedback) feedback.textContent = "";
      });
      field.addEventListener("change", () => {
        clearFieldError(field);
        if (feedback) feedback.textContent = "";
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const errors = [];
      let firstInvalid = null;

      fields.forEach(clearFieldError);

      const addError = (field, message) => {
        errors.push(message);
        field.setAttribute("aria-invalid", "true");
        field.classList.add("is-invalid");
        if (!firstInvalid) firstInvalid = field;
      };

      rules.required.forEach(id => {
        const field = form.querySelector("#" + id);
        if (field && !field.value.trim()) {
          addError(field, fieldLabel(field) + " is required.");
        }
      });

      fields.forEach(field => {
        const value = field.value.trim();
        if (!value || field.type === "checkbox") return;

        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          addError(field, "Enter a valid email address for " + fieldLabel(field) + ".");
        }

        if (field.type === "tel") {
          const digits = value.replace(/\D/g, "");
          if (!/^[0-9+()\s-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
            addError(field, "Enter a valid phone number containing 7 to 15 digits.");
          }
        }

        if (["contact-name", "first-name", "surname"].includes(field.id) && value.length < 2) {
          addError(field, fieldLabel(field) + " must contain at least 2 characters.");
        }

        if (["contact-message", "enquiry-message"].includes(field.id) && value.length < 10) {
          addError(field, fieldLabel(field) + " must contain at least 10 characters.");
        }

        if (field.type === "date" && value < todayLocal()) {
          addError(field, "The preferred date cannot be in the past.");
        }

        if (field.type === "number" && field.id === "attendees") {
          const count = Number(value);
          if (!Number.isInteger(count) || count < 1 || count > 10000) {
            addError(field, "Estimated attendees must be a whole number from 1 to 10,000.");
          }
        }
      });

      if (rules.consent) {
        const consent = form.querySelector('input[name="Consent"]');
        if (consent && !consent.checked) {
          addError(consent, "Please agree to the consent statement before submitting.");
        }
      }

      if (errors.length) {
        if (feedback) {
          feedback.textContent = "Please correct these items: " + errors.join(" ");
          feedback.setAttribute("role", "alert");
          feedback.setAttribute("aria-live", "assertive");
        }
        firstInvalid?.focus();
        return;
      }

      const lines = [];
      new FormData(form).forEach((value, key) => {
        if (key.toLowerCase() !== "consent") lines.push(key + ": " + value);
      });

      const subject = encodeURIComponent(purpose + " - Koena Dignity Funeral Services");
      const body = encodeURIComponent(lines.join("\n"));
      const mailto = "mailto:info@koenadignity.co.za?subject=" + subject + "&body=" + body;

      if (feedback) {
        feedback.textContent = "Your email application should open with your details prepared. Review the message and press Send in your email application.";
        feedback.setAttribute("role", "status");
        feedback.setAttribute("aria-live", "polite");
      }
      window.location.href = mailto;
    });
  });
});