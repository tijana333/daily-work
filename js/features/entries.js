import {
  loadEntries as loadEntriesApi,
  deleteEntry as deleteEntryApi,
} from "../api/entriesApi.js";
import { escapeHtml, parseLocalDate } from "../utils/helpers.js";
import { openEntryModal, closeEntryModal } from "./modal.js";

/* ========================================
ENTRIES LIST
"This Month" / "All Entries" list of entry cards
===========================================*/
const entriesList = document.getElementById("entries-list");
const emptyStateMessage = document.getElementById("empty-state-message");
const entriesLoading = document.getElementById("entries-loading");
const thisMonthBtn = document.getElementById("this-month");
const allEntriesBtn = document.getElementById("all-entries");

let currentView = "month";

// Increases on every request; only the latest response is rendered,
// so a slow older response can't overwrite a newer one
let entriesRequestId = 0;

function renderEntryCard(entry) {
  const date = parseLocalDate(entry.date);
  const day = date.getDate();
  const monthYear = date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  return `
    <div class="entry-card" data-id="${escapeHtml(entry._id)}">
      <div class="entry-date">
        <span class="day">${day}</span>
        <span class="month">${monthYear}</span>
      </div>

      <div class="entry-content">
        <div class="hours">${escapeHtml(entry.hours)} hours</div>
        <div class="challenge">${escapeHtml(entry.challenge)}</div>
      </div>

      <div class="entry-intensity">
        ${escapeHtml(entry.intensity)}
      </div>
    </div>
  `;
}

export async function loadEntries() {
  const requestId = ++entriesRequestId;
  entriesLoading.style.display = "flex";
  entriesList.style.display = "none";
  emptyStateMessage.style.display = "none";

  try {
    let params = {};
    if (currentView === "month") {
      const date = new Date();
      params = { month: date.getMonth() + 1, year: date.getFullYear() };
    }
    const result = await loadEntriesApi(params);
    if (requestId !== entriesRequestId) return;

    entriesLoading.style.display = "none";
    const entries = result.data.data || [];

    if (entries.length === 0) {
      emptyStateMessage.style.display = "block";
      entriesList.style.display = "none";
      return;
    }

    emptyStateMessage.style.display = "none";
    entriesList.style.display = "flex";
    entries.sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));
    entriesList.innerHTML = entries.map(renderEntryCard).join("");

    entriesList.querySelectorAll(".entry-card").forEach(function (card) {
      card.addEventListener("click", function () {
        const entry = entries.find((e) => e._id === card.dataset.id);
        openEntryModal(entry);
      });
    });
  } catch (error) {
    if (requestId !== entriesRequestId) return;
    entriesLoading.style.display = "none";
    entriesList.style.display = "flex";
    entriesList.textContent = "Something went wrong!";
  }
}

// Asks for confirmation, deletes the entry and reloads the list.
// Returns true when the entry was deleted.
export async function deleteEntry(entry) {
  if (!confirm("Are you sure you want to delete this entry?")) return false;

  try {
    const result = await deleteEntryApi(entry._id);
    if (!result.ok) {
      alert("Could not delete the entry. Please try again.");
      return false;
    }
    closeEntryModal();
    loadEntries();
    alert("Entry deleted successfully");
    return true;
  } catch (error) {
    alert("Could not delete the entry. Check your connection and try again.");
    return false;
  }
}

function setView(view) {
  currentView = view;
  thisMonthBtn.classList.toggle("active", view === "month");
  allEntriesBtn.classList.toggle("active", view === "all");
  loadEntries();
}

export function initEntries() {
  thisMonthBtn.addEventListener("click", () => setView("month"));
  allEntriesBtn.addEventListener("click", () => setView("all"));
}
