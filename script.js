const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-pill");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector("i");
const serviceItems = document.querySelectorAll(".service-item");

const getStoredTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Ignore storage errors (e.g., privacy modes or file:// restrictions).
  }
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.removeAttribute("data-theme");
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", theme === "dark");
  }

  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
};

const storedTheme = getStoredTheme();
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
applyTheme(initialTheme);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];

const setActiveNav = () => {
  const scrollY = window.scrollY + 120;
  let activeId = sections[0]?.id;
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
};

setActiveNav();
window.addEventListener("scroll", setActiveNav);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });
}

serviceItems.forEach((item) => {
  const trigger = item.querySelector(".service-row");
  const panel = item.querySelector(".service-panel");
  if (!trigger || !panel) return;

  const toggleItem = () => {
    const isOpen = item.classList.contains("is-open");
    serviceItems.forEach((other) => {
      other.classList.remove("is-open");
      const otherTrigger = other.querySelector(".service-row");
      const otherPanel = other.querySelector(".service-panel");
      if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      if (otherPanel) otherPanel.setAttribute("aria-hidden", "true");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
    }
  };

  item.addEventListener("click", (event) => {
    const interactive = event.target.closest("a, button, input, textarea, select, label");
    if (interactive && interactive !== trigger) return;
    toggleItem();
  });
});
