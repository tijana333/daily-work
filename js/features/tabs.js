import { loadEntries } from "../main.js";

export function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (tbs) {
        tbs.classList.remove("active");
      });
      tab.classList.add("active");
      const content = document.querySelectorAll(".tab-content");
      content.forEach((c) => c.classList.remove("active"));

      const name = tab.dataset.tab;
      const id = name + "-section";
      if (name === "entries") {
        loadEntries();
      }

      document.getElementById(id).classList.add("active");
    });
  });
}

export function switchToTab(name) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => t.classList.remove("active"));

  const targetTab = document.querySelector(`[data-tab="${name}"]`);
  targetTab.classList.add("active");

  const content = document.querySelectorAll(".tab-content");
  content.forEach((c) => c.classList.remove("active"));

  document.getElementById(name + "-section").classList.add("active");
}
