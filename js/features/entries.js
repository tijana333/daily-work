let selectedEntry = null;

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
// OPEN ENTRY MODAL
export function openEntryModal(entry) {
  selectedEntry = entry;
  modalDate.value = entry.date;
  modalHours.value = entry.hours;
  modalIntensity.value = entry.intensity;
  modalChallenge.value = entry.challenge;
  modalNote.value = entry.note || "";
  entryDetailsModal.style.display = "flex";
}
// SHOW ENTRIES
export function showEntriesLoading() {
  entriesLoading.style.display = "flex";
  entriesList.style.display = "none";
  emptyStateMessage.style.display = "none";
}
// HIDE ENTRIES
export function hideEntriesLoading() {
  entriesLoading.style.display = "none";
}
// ENTRIES ERROR
export function showEntriesError() {
  entriesLoading.style.display = "none";
  entriesList.style.display = "block";
  entriesList.textContent = "Something went wrong!";
}
//RENDER ENTRIES
export function renderEntries(entries) {
  if (entries.length === 0) {
    emptyStateMessage.style.display = "block";
    entriesList.style.display = "none";
  } else {
    emptyStateMessage.style.display = "none";
    entriesList.style.display = "flex";
  }
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  entriesList.innerHTML = sortedEntries
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
      const data_id = sortedEntries.find((entry) => entry._id === data);
      openEntryModal(data_id);
    });
  });
}
//CLOSE MODAL
function closeModal() {
  entryDetailsModal.style.display = "none";
}
export function initEntries({ onEdit, onDelete }) {
  closeEntryModal.addEventListener("click", function () {
    closeModal();
  });

  editBtn.addEventListener("click", function () {
    if (!selectedEntry) return;

    closeModal();

    if (onEdit) {
      onEdit(selectedEntry);
    }
  });

  deleteEntryButton.addEventListener("click", function () {
    if (!selectedEntry) return;

    const confirmed = confirm("Are you sure you want to delete this entry?");
    if (!confirmed) return;

    if (onDelete) {
      onDelete(selectedEntry);
      closeModal();
    }
  });
}
