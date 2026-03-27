import { loadEntries as loadEntriesApi } from "./api/entriesApi.js";
import { startEditingEntry, initForm } from "./features/form.js";
/* ========================================
CONFIGURATION
API endpoint used for all entry requests
===========================================*/
const API_URL = "https://daily-work-backend.vercel.app/api/entries";
/* ========================================
TAB NAVIGATION
Handles switching between tabs and Loading
entries when the entries tab is opened
===========================================*/
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

const entriesList = document.getElementById("entries-list");
const emptyStateMessage = document.getElementById("empty-state-message");
const entriesLoading = document.getElementById("entries-loading");
const entryDetailsModal = document.getElementById("entry-details-modal");
const closeEntryModal = document.getElementById("close-entry-modal");
const deleteEntryButton = document.getElementById("delete-entry-btn");
const modalDate = document.getElementById("modal-date");
const modalHours = document.getElementById("modal-hours");
const modalIntensity = document.getElementById("modal-intensity");
const modalChallenge = document.getElementById("modal-challenge");
const modalNote = document.getElementById("modal-note");
const editBtn = document.getElementById("edit-entry-btn");
editBtn.addEventListener("click", function () {
  entryDetailsModal.style.display = "none";
  tabs.forEach(function (tbs) {
    tbs.classList.remove("active");
  });
  const dataTab = document.querySelector(`[data-tab="today"]`);
  dataTab.classList.add("active");
  const content = document.querySelectorAll(".tab-content");
  content.forEach((c) => c.classList.remove("active"));
  const todaySection = document.getElementById("today-section");
  todaySection.classList.add("active");
  startEditingEntry(selectedEntry);
});

let selectedEntry = null;

function openEntryModal(entry) {
  selectedEntry = entry;
  modalDate.value = entry.date;
  modalHours.value = entry.hours;
  modalIntensity.value = entry.intensity;
  modalChallenge.value = entry.challenge;
  modalNote.value = entry.note || "";
  entryDetailsModal.style.display = "flex";
}

/* ========================================
    ENTRIES LOADING
    Fetch and render all entries
===========================================*/
async function loadEntries() {
  entriesLoading.style.display = "flex";
  entriesList.style.display = "none";
  emptyStateMessage.style.display = "none";
  let url = API_URL;
  try {
    if (currentView === "month") {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      url = API_URL + "?month=" + month + "&year=" + year;
    }
    const result = await loadEntriesApi(url);
    entriesLoading.style.display = "none";
    const data = result.data;
    const entries = data.data;
    if (entries.length === 0) {
      emptyStateMessage.style.display = "block";
      entriesList.style.display = "none";
    } else {
      emptyStateMessage.style.display = "none";
      entriesList.style.display = "flex";
    }
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    entriesList.innerHTML = entries
      .map((entry) => {
        const date = new Date(entry.date);
        const day = date.getDate();
        const monthYear = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        return `
    <div class="entry-card" data-id="${entry._id}">
      
      <div class="entry-date">
        <span class="day">${day}</span>
        <span class="month">${monthYear}</span>
      </div>

      <div class="entry-content">
        <div class="hours">${entry.hours} hours</div>
        <div class="challenge">${entry.challenge}</div>
      </div>

      <div class="entry-intensity">
        ${entry.intensity}
      </div>

    </div>
  `;
      })
      .join("");

    const cards = document.querySelectorAll(".entry-card");
    cards.forEach(function (card) {
      card.addEventListener("click", function (element) {
        const data = card.getAttribute("data-id");
        const data_id = entries.find((entry) => entry._id === data);
        openEntryModal(data_id);
      });
    });
  } catch (error) {
    entriesLoading.style.display = "none";
    entriesList.textContent = "Something went wrong!";
  }
}
closeEntryModal.addEventListener("click", function (element) {
  entryDetailsModal.style.display = "none";
});
deleteEntryButton.addEventListener("click", async function () {
  if (confirm("Are you sure you want to delete this entry?")) {
    await fetch(API_URL + "/" + selectedEntry._id, {
      method: "DELETE",
    });
    entryDetailsModal.style.display = "none";
    loadEntries();
    alert("Entry deleted successfully");
  }
});

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
initForm();
