// The initial theme is applied inline in <head> (before paint, to avoid a
// flash); this module only handles changes after load.

const STORAGE_KEY = "theme";
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const toggles = document.querySelectorAll(".theme-toggle");

// localStorage throws when storage is blocked (private mode, sandboxed, etc.)
const storedTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable — choice just won't persist
  }
};

const setTheme = (theme, { persist } = {}) => {
  document.documentElement.dataset.theme = theme;
  if (persist) saveTheme(theme);
  toggles.forEach((button) =>
    button.setAttribute("aria-pressed", String(theme === "dark")),
  );
};

setTheme(document.documentElement.dataset.theme || "light");

toggles.forEach((button) =>
  button.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next, { persist: true });
  }),
);

// Follow the OS, but only until the visitor has made a manual choice.
prefersDark.addEventListener("change", (event) => {
  if (storedTheme()) return;
  setTheme(event.matches ? "dark" : "light");
});
