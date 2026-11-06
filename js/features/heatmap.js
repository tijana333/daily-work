import { loadEntries as loadEntriesApi } from "../api/entriesApi.js";
import { parseLocalDate } from "../utils/helpers.js";

/* ========================================
OVERVIEW HEATMAP
One square per day of the month, colored by
intensity, plus monthly statistics
===========================================*/
const currentMonthElement = document.getElementById("current-month");
const previousMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const monthCarousel = document.getElementById("month-carousel");

const grid = document.querySelector(".heatmap-grid");
const emptyState = document.querySelector(".heatmap-empty-state");
const emptyStateTitle = document.querySelector(".heatmap-empty-title");
const emptyStateText = document.querySelector(".heatmap-empty");
const tooltip = document.querySelector(".heatmap-tooltip");
const heatmapContainer = document.querySelector(".heatmap-container");

const totalHours = document.getElementById("total-hours");
const daysLogged = document.getElementById("days-logged");
const avgIntensity = document.getElementById("avg-intensity");

const SWIPE_THRESHOLD = 50;

// Always the 1st of the month, so setMonth() never overflows
// (e.g. Oct 31 + 1 month would otherwise jump to Dec 1)
const now = new Date();
let activeMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// Increases on every request; when months are switched quickly,
// only the response for the month currently shown is rendered
let heatmapRequestId = 0;

function renderMonthTitle() {
  currentMonthElement.textContent = activeMonth.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
  });
}

function showTooltip(daySquare) {
  const entry = daySquare.entryData;
  if (!entry) return;

  tooltip.textContent =
    "Date: " +
    entry.date +
    " | Hours: " +
    entry.hours +
    " | Intensity: " +
    entry.intensity;

  const rect = daySquare.getBoundingClientRect();
  const containerRect = heatmapContainer.getBoundingClientRect();
  tooltip.style.left = rect.left - containerRect.left + rect.width / 2 + "px";
  tooltip.style.top = rect.top - containerRect.top + rect.height + 12 + "px";
  tooltip.style.display = "block";
}

function renderEmptyGrid() {
  grid.innerHTML = "";
  emptyState.style.display = "none";
  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("heatmap-day");
    daySquare.addEventListener("mouseenter", () => showTooltip(daySquare));
    daySquare.addEventListener("mouseleave", function () {
      tooltip.style.display = "none";
    });
    grid.appendChild(daySquare);
  }
}

function showEmptyState(title, text) {
  grid.style.display = "none";
  emptyStateTitle.textContent = title;
  emptyStateText.textContent = text;
  emptyState.style.display = "block";
}

function renderStats(entries) {
  let totalHoursSum = 0;
  let totalIntensity = 0;
  entries.forEach(function (entry) {
    totalHoursSum += entry.hours;
    totalIntensity += entry.intensity;
  });
  const averageIntensity =
    entries.length > 0 ? totalIntensity / entries.length : 0;

  totalHours.textContent = totalHoursSum;
  daysLogged.textContent = entries.length;
  avgIntensity.textContent = averageIntensity.toFixed(1);
}

async function loadHeatmapData() {
  const requestId = ++heatmapRequestId;

  let entries;
  try {
    const result = await loadEntriesApi({
      month: activeMonth.getMonth() + 1,
      year: activeMonth.getFullYear(),
    });
    entries = result.data.data || [];
  } catch (error) {
    if (requestId !== heatmapRequestId) return;
    showEmptyState("Could not load data", "Check your connection and try again.");
    return;
  }
  if (requestId !== heatmapRequestId) return;

  if (entries.length > 0) {
    grid.style.display = "grid";
    emptyState.style.display = "none";
    entries.forEach(function (entry) {
      const day = parseLocalDate(entry.date).getDate();
      const daySquare = grid.children[day - 1];
      if (!daySquare) return;
      daySquare.classList.add("level-" + entry.intensity);
      daySquare.entryData = entry;
    });
  } else {
    showEmptyState(
      "No data yet",
      "Start logging your daily work to see your progress here.",
    );
  }

  renderStats(entries);
}

// Re-renders the month that is currently shown
export function refreshHeatmap() {
  renderMonthTitle();
  renderEmptyGrid();
  loadHeatmapData();
}

function changeMonth(step) {
  activeMonth.setMonth(activeMonth.getMonth() + step);
  refreshHeatmap();
}

export function initHeatmap() {
  previousMonthButton.addEventListener("click", () => changeMonth(-1));
  nextMonthButton.addEventListener("click", () => changeMonth(1));

  // Swipe left / right on mobile
  let startX = 0;
  monthCarousel.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
  });
  monthCarousel.addEventListener("touchend", function (event) {
    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    changeMonth(deltaX < 0 ? 1 : -1);
  });

  refreshHeatmap();
}
