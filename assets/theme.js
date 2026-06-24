// The initial theme is applied inline in <head> (before paint); this module
// only handles changes after load.

import { sun, moon, sunStatic, moonStatic } from "./icons.js";

const STORAGE_KEY = "theme";
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
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

const currentTheme = () => document.documentElement.dataset.theme;

// Parse each icon string into a <template> once; render() clones its content so
// the SMIL intro re-plays on every toggle.
const toTemplate = (svg) => {
  const template = document.createElement("template");
  template.innerHTML = svg;
  return template;
};

const icons = {
  sun: toTemplate(sun),
  moon: toTemplate(moon),
  "sun-static": toTemplate(sunStatic),
  "moon-static": toTemplate(moonStatic),
};

const iconTemplate = (theme) => {
  const name = theme === "dark" ? "moon" : "sun";
  const motion = prefersReducedMotion.matches ? "-static" : "";
  return icons[`${name}${motion}`];
};

// Cloning a fresh SVG re-plays its SMIL intro on every toggle.
const render = () => {
  const theme = currentTheme();
  const template = iconTemplate(theme);
  toggles.forEach((button) => {
    button.replaceChildren(template.content.cloneNode(true));
    button.setAttribute("aria-pressed", String(theme === "dark"));
  });
};

const setTheme = (theme, { persist } = {}) => {
  document.documentElement.dataset.theme = theme;
  if (persist) saveTheme(theme);
  render();
};

toggles.forEach((button) =>
  button.addEventListener("click", () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark", { persist: true });
  }),
);

// Follow the OS, but only until the visitor has made a manual choice.
prefersDark.addEventListener("change", (event) => {
  if (storedTheme()) return;
  setTheme(event.matches ? "dark" : "light");
});

render();
