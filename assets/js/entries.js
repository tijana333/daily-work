import { getEntries, removeEntry } from "./api.js";

export function initEntries(fillFormForEdit) {
  const entriesList = document.getElementById("entries-list");
  const emptyStateMessage = document.getElementById("empty-state-message");
  const entriesLoading = document.getElementById("entries-loading");

  const entryDetailsModal = document.getElementById("entry-details-modal");
  const closeEntryModal = document.getElementById("close-entry-modal");
  const deleteEntryButton = document.getElementById("delete-entry-btn");
  const editBtn = document.getElementById("edit-entry-btn");

  const modalDate = document.getElementById("modal-date");
  const modalHours = document.getElementById("modal-hours");
  const modalIntensity = document.getElementById("modal-intensity");
  const modalChallenge = document.getElementById("modal-challenge");
  const modalNote = document.getElementById("modal-note");

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

  async function loadEntries() {
    entriesLoading.style.display = "flex";
    entriesList.style.display = "none";
    emptyStateMessage.style.display = "none";

    try {
      const response = await getEntries(currentView);
      const data = await response.json();
      const entries = data.data;

      entriesLoading.style.display = "none";

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
        card.addEventListener("click", function () {
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

  closeEntryModal.addEventListener("click", function () {
    entryDetailsModal.style.display = "none";
  });

  deleteEntryButton.addEventListener("click", async function () {
    if (confirm("Are you sure you want to delete this entry?")) {
      await removeEntry(selectedEntry._id);
      entryDetailsModal.style.display = "none";
      loadEntries();
      alert("Entry deleted successfully");
    }
  });

  editBtn.addEventListener("click", function () {
    entryDetailsModal.style.display = "none";
    fillFormForEdit(selectedEntry);
  });

  return { loadEntries };
}
