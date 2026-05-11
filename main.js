

const html = document.documentElement; // the <html> element
const themeBtn = document.getElementById("theme-btn");
const iconSun = document.getElementById("icon-sun");
const iconMoon = document.getElementById("icon-moon");
const themeLabel = document.getElementById("theme-label");

/** Applies dark or light mode to the page and updates the toggle button UI */
function applyTheme(dark) {
  if (dark) {
    // ── DARK MODE ─────────────────────────────────────────
    html.classList.add("dark"); // activates all dark:... Tailwind classes
    iconSun.classList.remove("hidden"); // show sun icon  (click → go light)
    iconMoon.classList.add("hidden"); // hide moon icon
    themeLabel.textContent = "Light mode";
  } else {
    // ── LIGHT MODE ────────────────────────────────────────
    html.classList.remove("dark"); // removes dark mode
    iconSun.classList.add("hidden"); // hide sun icon
    iconMoon.classList.remove("hidden"); // show moon icon (click → go dark)
    themeLabel.textContent = "Dark mode";
  }
}

// On page load: check localStorage first, then fall back to OS preference
const savedTheme = localStorage.getItem("theme"); // 'dark' | 'light' | null
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

// When the toggle button is clicked, flip the current mode and save it
themeBtn.addEventListener("click", () => {
  const isDark = html.classList.contains("dark");
  applyTheme(!isDark);
  localStorage.setItem("theme", isDark ? "light" : "dark");
});


// List of required fields with their validation rules
const fields = [
  {
    id: "name",
    check: (v) => v.trim() !== "",
    msg: "Name is required.",
  },
  {
    id: "email",
    // Basic email format check: must have @ and a dot after it
    check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    msg: "A valid email address is required.",
  },
  {
    id: "message",
    check: (v) => v.trim() !== "",
    msg: "Message is required.",
  },
];

/** Validates a single field. Returns true if valid, false if not. */
function validateField({ id, check, msg }) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(`${id}-error`);
  const valid = check(input.value);

  if (valid) {
    // Field is OK — remove red border, hide error message
    input.classList.remove("border-red-400");
    errorEl.classList.add("hidden");
    errorEl.textContent = "";
  } else {
    // Field has an error — show red border and error message
    input.classList.add("border-red-400");
    errorEl.classList.remove("hidden");
    errorEl.textContent = msg;
  }

  return valid;
}

// Attach live validation: errors disappear as the user corrects them
fields.forEach((f) => {
  document
    .getElementById(f.id)
    .addEventListener("input", () => validateField(f));
});

// Send button click handler
document.getElementById("send-btn").addEventListener("click", () => {
  // Validate all required fields; collect results (don't short-circuit with &&)
  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) return; // stop here if any field failed

  // All fields are valid → hide form, reveal success message
  document.getElementById("contact-form").classList.add("hidden");
  document.getElementById("success-msg").classList.remove("hidden");
});

/** Resets the form back to its empty state (called by "Send another" button) */
function resetForm() {
  // Clear all input values
  ["name", "email", "subject", "message"].forEach((id) => {
    document.getElementById(id).value = "";
  });

  // Remove any red borders and hide error messages left from last submission
  fields.forEach((f) => {
    const input = document.getElementById(f.id);
    const errorEl = document.getElementById(`${f.id}-error`);
    input.classList.remove("border-red-400");
    errorEl.classList.add("hidden");
  });

  // Swap back: show form, hide success card
  document.getElementById("success-msg").classList.add("hidden");
  document.getElementById("contact-form").classList.remove("hidden");
}

// resetForm is called from an onclick attribute in main.html, so expose it globally
window.resetForm = resetForm;
