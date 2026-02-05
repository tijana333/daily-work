const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    TabManager.switchTab(tab.dataset.tab);
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.classList.remove("active");
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tab.classList.add("active");
  });
});

document.querySelectorAll(".tab-content").forEach((content) => {
  content.classList.remove("active");
});
const tabName = tab.dataset.tab;
document.getElementById(`${tabName}-section`).classList.add("active");
