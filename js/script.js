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

  // Funeral package search, package-type filter and service-category filter.
  const search = document.getElementById("package-search");
  const packageType = document.getElementById("package-type");
  const category = document.getElementById("package-category");
  const clear = document.getElementById("clear-package-filters");
  const resultCount = document.getElementById("package-results");
  const emptyState = document.getElementById("package-empty");
  const cards = Array.from(document.querySelectorAll(".package-card"));

  const serviceTerms = {
    arrangements: ["funeral arrangement", "funeral coordination", "administrative support"],
    coffin: ["coffin"],
    transport: ["transportation", "hearse"],
    memorial: ["memorial"],
    floral: ["floral"]
  };

  const normalise = value => value.toLocaleLowerCase().replace(/\\s+/g, " ").trim();

  function filterPackages() {
    if (!search || !packageType || !category || !resultCount || !cards.length) return;

    const query = normalise(search.value);
    const selectedType = packageType.value;
    const selectedService = category.value;
    let shown = 0;

    cards.forEach(card => {
      const heading = normalise(card.querySelector("h3")?.textContent || "");
      const content = normalise(card.textContent);
      const matchesSearch = !query || content.includes(query);
      const matchesType = selectedType === "all" || heading.startsWith(selectedType);
      const matchingTerms = serviceTerms[selectedService] || [];
      const matchesService = selectedService === "all"
        || matchingTerms.some(term => content.includes(term));
      const visible = matchesSearch && matchesType && matchesService;

      card.hidden = !visible;
      if (visible) shown += 1;
    });

    resultCount.textContent = shown === cards.length
      ? "Showing all " + shown + " funeral packages."
      : "Showing " + shown + " of " + cards.length + " funeral packages.";
    if (emptyState) emptyState.hidden = shown !== 0;
  }

  if (search && packageType && category && clear) {
    search.addEventListener("input", filterPackages);
    packageType.addEventListener("change", filterPackages);
    category.addEventListener("change", filterPackages);
    clear.addEventListener("click", () => {
      search.value = "";
      packageType.value = "all";
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

  // JavaScript-only, field-by-field form validation inspired by Campus-Cart.
  const formRules = {
    "Contact message": {
      required: ["contact-name", "contact-email", "contact-phone", "contact-subject", "contact-message"]
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

  const validEmail = value =>
    value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Accept South African mobile/landline formats such as 082 123 4567 or +27 82 123 4567.
  const validPhone = value => {
    const cleaned = value.replace(/[\s\-()]/g, "");
    return /^(0\d{9}|\+27\d{9})$/.test(cleaned);
  };

  document.querySelectorAll("form").forEach(form => {
    form.noValidate = true;
    const purpose = form.dataset.formPurpose || "Website enquiry";
    const rules = formRules[purpose] || { required: [] };
    const feedback = form.querySelector(".form-feedback");
    const fields = Array.from(form.querySelectorAll("input, select, textarea"))
      .filter(field => field.type !== "submit" && field.type !== "button" && field.type !== "hidden");

    const labelFor = field => {
      const label = field.id
        ? form.querySelector('label[for="' + field.id + '"]')
        : field.closest("label");
      return (label?.textContent || field.name || "This field").trim();
    };

    // Create a dedicated accessible error message for each field.
    fields.forEach(field => {
      if (!field.id) field.id = "form-field-" + Math.random().toString(36).slice(2, 9);
      const errorId = field.id + "-error";
      let error = document.getElementById(errorId);
      if (!error) {
        error = document.createElement("small");
        error.id = errorId;
        error.className = "field-error";
        error.hidden = true;
        error.setAttribute("aria-live", "polite");
        field.insertAdjacentElement("afterend", error);
      }
      const describedBy = (field.getAttribute("aria-describedby") || "")
        .split(/\s+/).filter(Boolean);
      if (!describedBy.includes(errorId)) describedBy.push(errorId);
      field.setAttribute("aria-describedby", describedBy.join(" "));
    });

    function showFieldError(field, message) {
      const error = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", "true");
      field.classList.add("is-invalid");
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }
      return false;
    }

    function clearFieldError(field) {
      const error = document.getElementById(field.id + "-error");
      field.removeAttribute("aria-invalid");
      field.classList.remove("is-invalid");
      if (error) {
        error.textContent = "";
        error.hidden = true;
      }
    }

    function validateField(field) {
      const value = field.type === "checkbox" ? "" : field.value.trim();
      const required = rules.required.includes(field.id);
      const name = labelFor(field);

      clearFieldError(field);

      if (field.type === "checkbox") {
        if (field.name === "Consent" && rules.consent && !field.checked) {
          return showFieldError(field, "Please agree to the consent statement before submitting.");
        }
        return true;
      }

      if (required && !value) {
        return showFieldError(field, name + " is required.");
      }

      // Optional fields may be left blank, but are checked whenever a value is entered.
      if (!value) return true;

      if (field.type === "email" && !validEmail(value)) {
        return showFieldError(field, "Enter a valid email address (maximum 120 characters).");
      }

      if (field.type === "tel" && !validPhone(value)) {
        return showFieldError(field, "Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.");
      }

      if (["contact-name", "first-name", "surname"].includes(field.id)) {
        if (value.length < 2 || value.length > 80 || !/^[\p{L}][\p{L}\p{M} '\u2019-]*$/u.test(value)) {
          return showFieldError(field, "Enter a name using 2 to 80 letters. Spaces, apostrophes and hyphens are allowed.");
        }
      }

      if (["contact-message", "enquiry-message"].includes(field.id)) {
        if (value.length < 10 || value.length > 1000) {
          return showFieldError(field, "Please enter between 10 and 1,000 characters.");
        }
      }

      if (field.id === "area" && (value.length < 2 || value.length > 100)) {
        return showFieldError(field, "Enter a location between 2 and 100 characters.");
      }

      if (field.id === "preferred-date" && value < todayLocal()) {
        return showFieldError(field, "The preferred date cannot be in the past.");
      }

      if (field.id === "attendees") {
        const count = Number(value);
        if (!Number.isInteger(count) || count < 1 || count > 10000) {
          return showFieldError(field, "Enter a whole number from 1 to 10,000.");
        }
      }

      return true;
    }

    // Validate a field as the visitor leaves it, and refresh feedback while they edit.
    fields.forEach(field => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
        if (feedback) feedback.textContent = "";
      });
      field.addEventListener("change", () => {
        validateField(field);
        if (feedback) feedback.textContent = "";
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      let firstInvalid = null;
      let valid = true;

      fields.forEach(field => {
        if (!validateField(field)) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (feedback) {
          feedback.textContent = "Please correct the highlighted fields before continuing.";
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