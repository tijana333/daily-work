import { state } from "../state/state.js";

const entryDetailsModal = document.getElementById("entry-details-modal");
const closeEntryModalButton = document.getElementById("close-entry-modal");
const deleteEntryButton = document.getElementById("delete-entry-btn");
const modalDate = document.getElementById("modal-date");
const modalHours = document.getElementById("modal-hours");
const modalIntensity = document.getElementById("modal-intensity");
const modalChallenge = document.getElementById("modal-challenge");
const modalNote = document.getElementById("modal-note");
const editBtn = document.getElementById("edit-entry-btn");

let onEditHandler = null;
let onDeleteHandler = null;

export function openEntryModal(entry) {
  selectedEntry = entry;

  modalDate.value = entry.date;
  modalHours.value = entry.hours;
  modalIntensity.value = entry.intensity;
  modalChallenge.value = entry.challenge;
  modalNote.value = entry.note || "";

  entryDetailsModal.style.display = "flex";
}

export function closeEntryModal() {
  entryDetailsModal.style.display = "none";
  selectedEntry = null;
}

export function initModal({ onEdit, onDelete }) {
  onEditHandler = onEdit;
  onDeleteHandler = onDelete;

  closeEntryModalButton.addEventListener("click", function () {
    closeEntryModal();
  });

  editBtn.addEventListener("click", function () {
    if (!selectedEntry) return;

    if (onEditHandler) {
      onEditHandler(selectedEntry);
    }

    closeEntryModal();
  });

  deleteEntryButton.addEventListener("click", async function () {
    if (!selectedEntry) return;

    const confirmed = confirm("Are you sure you want to delete this entry?");
    if (!confirmed) return;

    if (onDeleteHandler) {
      await onDeleteHandler(selectedEntry);
    }

    closeEntryModal();
  });
}
