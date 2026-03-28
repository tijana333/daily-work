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
import { initModal, openEntryModal } from "./features/modal.js";
import { initHeatmap } from "./features/heatmap.js";
import { state } from "./state/state.js";

/* ========================================
CONFIGURATION
API endpoint used for all entry requests
===========================================*/
const API_URL = "https://daily-work-backend.vercel.app/api/entries";
const thisMonthBtn = document.getElementById("this-month");
const allEntriesBtn = document.getElementById("all-entries");

/* ========================================
    ENTRIES LOADING
    Fetch and render all entries
===========================================*/
export async function loadEntries() {
  showEntriesLoading();
  let url = API_URL;
  try {
    if (state.currentView === "month") {
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
  onOpenModal(entry) {
    openEntryModal(entry);
  },
});
initModal({
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
initHeatmap({ apiUrl: API_URL });
loadEntries();

thisMonthBtn.addEventListener("click", function () {
  state.currentView = "month";
  thisMonthBtn.classList.add("active");
  allEntriesBtn.classList.remove("active");
  loadEntries();
});

allEntriesBtn.addEventListener("click", function () {
  state.currentView = "all";
  allEntriesBtn.classList.add("active");
  thisMonthBtn.classList.remove("active");
  loadEntries();
});
