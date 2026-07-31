(() => {
  const approvedSummary = "Guest-focused hospitality professional with hands-on experience in restaurant reception, reservations, table coordination and food-and-beverage service. Skilled in welcoming guests, responding to enquiries, supporting efficient service operations and maintaining positive guest experiences. A dependable team member committed to service quality, continuous learning and professional growth.";
  const storageKey = "jenisha-personal-profile-v1";

  function applySummary() {
    const output = document.getElementById("summaryOutput");
    const input = document.getElementById("summaryInput");
    if (output) output.textContent = approvedSummary;
    if (input) input.value = approvedSummary;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      saved.summary = approvedSummary;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch (_) {}

    const hint = document.querySelector('label[for="photoInput"]')?.closest('.field')?.nextElementSibling;
    if (hint?.classList.contains('hint')) {
      hint.textContent = "Upload a passport-style portrait. The full photo area is preserved without cutting the face or shoulders.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(applySummary, 0));
  } else {
    setTimeout(applySummary, 0);
  }
})();