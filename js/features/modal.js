/* ========================================
ENTRY DETAILS MODAL
Shows a single entry with Edit and Delete actions
===========================================*/
const modal = document.getElementById("entry-details-modal");
const closeButton = document.getElementById("close-entry-modal");
const editButton = document.getElementById("edit-entry-btn");
const deleteButton = document.getElementById("delete-entry-btn");

const modalDate = document.getElementById("modal-date");
const modalHours = document.getElementById("modal-hours");
const modalIntensity = document.getElementById("modal-intensity");
const modalChallenge = document.getElementById("modal-challenge");
const modalNote = document.getElementById("modal-note");

let selectedEntry = null;

export function openEntryModal(entry) {
  selectedEntry = entry;
  modalDate.value = entry.date;
  modalHours.value = entry.hours;
  modalIntensity.value = entry.intensity;
  modalChallenge.value = entry.challenge;
  modalNote.value = entry.note || "";
  modal.style.display = "flex";
  closeButton.focus();
}

export function closeEntryModal() {
  modal.style.display = "none";
}

// onEdit(entry) and onDelete(entry) are called with the selected entry.
// onDelete should return a promise; the button is disabled until it ends.
export function initModal({ onEdit, onDelete }) {
  closeButton.addEventListener("click", closeEntryModal);

  // Close when clicking the dark background outside the box
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeEntryModal();
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display !== "none") {
      closeEntryModal();
    }
  });

  editButton.addEventListener("click", function () {
    closeEntryModal();
    onEdit(selectedEntry);
  });

  deleteButton.addEventListener("click", async function () {
    deleteButton.disabled = true;
    try {
      await onDelete(selectedEntry);
    } finally {
      deleteButton.disabled = false;
    }
  });
}
