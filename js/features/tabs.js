/* ========================================
TAB NAVIGATION
A tab button with data-tab="today" shows the
section with id="today-section"
===========================================*/
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".tab-content");

let onTabOpen = null;

export function showTab(name) {
  tabs.forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });
  sections.forEach(function (section) {
    section.classList.toggle("active", section.id === name + "-section");
  });
  if (onTabOpen) onTabOpen(name);
}

// onOpen(name) is called every time a tab is opened
export function initTabs(onOpen) {
  onTabOpen = onOpen;
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      showTab(tab.dataset.tab);
    });
  });
}
