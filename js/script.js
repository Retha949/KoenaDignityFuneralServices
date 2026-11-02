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

  // Client-side form checks and email hand-off. This is not a server submission.
  document.querySelectorAll(".email-form").forEach(form => {
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      const phone = form.querySelector('input[type="tel"]');
      if (phone && !/^[0-9+()\s-]{7,20}$/.test(phone.value.trim())) {
        phone.setCustomValidity("Enter a valid phone number using 7 to 20 digits, spaces or +()- characters.");
      } else if (phone) {
        phone.setCustomValidity("");
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (key !== "consent") lines.push(key + ": " + value);
      }
      const purpose = form.dataset.formPurpose || "Website enquiry";
      const subject = encodeURIComponent(purpose + " - Koena Dignity Funeral Services");
      const body = encodeURIComponent(lines.join("\n"));
      const mailto = "mailto:info@koenadignity.co.za?subject=" + subject + "&body=" + body;
      if (feedback) feedback.textContent = "Your email application should open with the details prepared. Please review the message and press Send in your email application.";
      window.location.href = mailto;
    });
  });
});