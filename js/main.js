import { loadEntries as loadEntriesApi } from "./api/entriesApi.js";
import { startEditingEntry, initForm } from "./features/form.js";
import { initTabs, switchToTab } from "./features/tabs.js";
import {
  showEntriesLoading,
  hideEntriesLoading,
  showEntriesError,
  renderEntries,
  initEntries,
} from "./features/entries.js";
/* ========================================
CONFIGURATION
API endpoint used for all entry requests
===========================================*/
const API_URL = "https://daily-work-backend.vercel.app/api/entries";

/* ========================================
    ENTRIES LOADING
    Fetch and render all entries
===========================================*/
export async function loadEntries() {
  showEntriesLoading();
  let url = API_URL;
  try {
    if (currentView === "month") {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      url = API_URL + "?month=" + month + "&year=" + year;
    }
    const result = await loadEntriesApi(url);
    const entries = result.data.data;
    hideEntriesLoading();
    renderEntries(entries);
  } catch (error) {
    showEntriesError();
  }
}

initEntries({
  onEdit(entry) {
    switchToTab("today");
    startEditingEntry(entry);
  },
  async onDelete(entry) {
    await fetch(API_URL + "/" + entry._id, {
      method: "DELETE",
    });
    await loadEntries();
    alert("Entry deleted successfully");
  },
});
initForm();
initTabs();

/* ===== MONTH CAROUSEL ===== */

const currentMonthElement = document.getElementById("current-month");
const previousMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const monthCarousel = document.getElementById("month-carousel");
let activeMonth = new Date();
let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;
const grid = document.querySelector(".heatmap-grid");
const emptyState = document.querySelector(".heatmap-empty-state");
const tooltip = document.querySelector(".heatmap-tooltip");
const heatmapContainer = document.querySelector(".heatmap-container");
const totalHours = document.getElementById("total-hours");
const daysLogged = document.getElementById("days-logged");
const avgIntensity = document.getElementById("avg-intensity");
let currentView = "month";
const thisMonthBtn = document.getElementById("this-month");
const allEntriesBtn = document.getElementById("all-entries");
thisMonthBtn.addEventListener("click", function () {
  currentView = "month";
  thisMonthBtn.classList.add("active");
  allEntriesBtn.classList.remove("active");
  loadEntries();
});
allEntriesBtn.addEventListener("click", function () {
  currentView = "all";
  allEntriesBtn.classList.add("active");
  thisMonthBtn.classList.remove("active");

  loadEntries();
});
function renderHeatmap() {
  grid.innerHTML = "";
  const month = activeMonth.getMonth();
  const year = activeMonth.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  emptyState.style.display = "none";
  for (let i = 1; i <= daysInMonth; i++) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("heatmap-day");
    newDiv.addEventListener("mouseenter", function () {
      if (!newDiv.entryData) return;

      const entry = newDiv.entryData;

      tooltip.textContent =
        "Date: " +
        entry.date +
        " | Hours: " +
        entry.hours +
        " | Intensity: " +
        entry.intensity;

      const rect = newDiv.getBoundingClientRect();
      const containerRect = heatmapContainer.getBoundingClientRect();

      tooltip.style.left =
        rect.left - containerRect.left + rect.width / 2 + "px";
      tooltip.style.top =
        rect.top - containerRect.top + rect.height + 12 + "px";

      tooltip.style.display = "block";
    });

    newDiv.addEventListener("mouseleave", function () {
      tooltip.style.display = "none";
    });
    grid.appendChild(newDiv);
  }
}

async function loadHeatmapData() {
  const month = activeMonth.getMonth();
  const year = activeMonth.getFullYear();
  const response = await fetch(
    API_URL + "?month=" + (month + 1) + "&year=" + year,
  );
  const data = await response.json();
  const entries = data.data;
  console.log("month/year", month + 1, year);
  console.log("entries", entries);

  if (entries.length > 0) {
    grid.style.display = "grid";
    emptyState.style.display = "none";
    entries.forEach(function (entry) {
      const day = new Date(entry.date).getDate();
      const daySquare = grid.children[day - 1];
      daySquare.classList.add("level-" + entry.intensity);

      daySquare.entryData = entry;

      console.log("entry", entry);
      console.log("day", day);
      console.log("intensity", entry.intensity);
      console.log("daySquare", daySquare);
    });
  } else {
    emptyState.style.display = "block";
    grid.style.display = "none";
  }

  let totalHoursSum = 0;
  let totalIntensity = 0;
  entries.forEach(function (entry) {
    totalHoursSum += entry.hours;
    totalIntensity += entry.intensity;
  });
  let daysLoggedCount = entries.length;
  let averageIntensity;

  if (entries.length > 0) {
    averageIntensity = totalIntensity / daysLoggedCount;
  } else {
    averageIntensity = 0;
  }

  totalHours.textContent = totalHoursSum;
  daysLogged.textContent = daysLoggedCount;
  avgIntensity.textContent = averageIntensity.toFixed(1);
}

function renderMonth() {
  const monthText = activeMonth.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
  });
  currentMonthElement.textContent = monthText;
}
/* ========================================
  MONTH CAROUSEL  
  Month navigation and swipe handling
===========================================*/
previousMonthButton.addEventListener("click", function () {
  activeMonth.setMonth(activeMonth.getMonth() - 1);
  updateHeatmapMonth();
});

nextMonthButton.addEventListener("click", function () {
  activeMonth.setMonth(activeMonth.getMonth() + 1);
  updateHeatmapMonth();
});
monthCarousel.addEventListener("touchstart", function (event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

monthCarousel.addEventListener("touchend", function (event) {
  endX = event.changedTouches[0].clientX;
  endY = event.changedTouches[0].clientY;
  let deltaX = endX - startX;
  const swipe_threshold = 50;
  if (Math.abs(deltaX) < swipe_threshold) return;
  if (deltaX < 0) {
    activeMonth.setMonth(activeMonth.getMonth() + 1);
    updateHeatmapMonth();
  }
  if (deltaX > 0) {
    activeMonth.setMonth(activeMonth.getMonth() - 1);
    updateHeatmapMonth();
  }
});
function updateHeatmapMonth() {
  renderMonth();
  renderHeatmap();
  loadHeatmapData();
}
updateHeatmapMonth();
