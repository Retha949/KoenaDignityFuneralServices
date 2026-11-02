/* Koena Dignity Funeral Services
   Package search and service filtering
*/
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("package-search");
    const categorySelect = document.getElementById("package-category");
    const clearButton = document.getElementById("clear-package-filters");
    const resultsMessage = document.getElementById("package-results");
    const packageGrid = document.querySelector(".services-section .service-grid");

    if (!searchInput || !categorySelect || !clearButton || !resultsMessage || !packageGrid) {
        return;
    }

    const packageCards = Array.from(packageGrid.querySelectorAll(".service-card"));
    const categoryTerms = {
        arrangements: ["funeral arrangement", "funeral coordination", "administrative support"],
        coffin: ["coffin"],
        transport: ["transportation", "hearse"],
        memorial: ["memorial"],
        floral: ["floral"],
        cultural: ["cultural", "traditional"]
    };

    const noResults = document.createElement("p");
    noResults.className = "package-no-results";
    noResults.textContent = "No packages match your search. Try another keyword or clear the filters.";
    noResults.hidden = true;
    packageGrid.appendChild(noResults);

    function filterPackages() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const category = categorySelect.value;
        let visibleCount = 0;

        packageCards.forEach(function (card) {
            const cardText = card.textContent.toLocaleLowerCase();
            const matchesSearch = !query || cardText.includes(query);
            const terms = categoryTerms[category] || [];
            const matchesCategory = category === "all" ||
                terms.some(function (term) { return cardText.includes(term); });
            const isVisible = matchesSearch && matchesCategory;

            card.classList.toggle("package-card-hidden", !isVisible);
            if (isVisible) visibleCount += 1;
        });

        noResults.hidden = visibleCount !== 0;
        resultsMessage.textContent = visibleCount === packageCards.length
            ? "Showing all " + visibleCount + " funeral packages."
            : "Showing " + visibleCount + " of " + packageCards.length + " funeral packages.";
    }

    searchInput.addEventListener("input", filterPackages);
    categorySelect.addEventListener("change", filterPackages);
    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        categorySelect.value = "all";
        filterPackages();
        searchInput.focus();
    });

    filterPackages();
});
