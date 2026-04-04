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
const deleteConfirmModal = document.getElementById("delete-confirm-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

let onEditHandler = null;
let onDeleteHandler = null;

export function openEntryModal(entry) {
  state.selectedEntry = entry;

  modalDate.value = entry.date;
  modalHours.value = entry.hours;
  modalIntensity.value = entry.intensity;
  modalChallenge.value = entry.challenge;
  modalNote.value = entry.note || "";

  entryDetailsModal.style.display = "flex";
}

export function closeEntryModal() {
  entryDetailsModal.style.display = "none";
  state.selectedEntry = null;
}

export function initModal({ onEdit, onDelete }) {
  onEditHandler = onEdit;
  onDeleteHandler = onDelete;

  closeEntryModalButton.addEventListener("click", function () {
    closeEntryModal();
  });

  editBtn.addEventListener("click", function () {
    if (!state.selectedEntry) return;

    if (onEditHandler) {
      onEditHandler(state.selectedEntry);
    }

    closeEntryModal();
  });

  deleteEntryButton.addEventListener("click", function () {
    if (!state.selectedEntry) return;

    deleteConfirmModal.style.display = "flex";
  });

  cancelDeleteBtn.addEventListener("click", function () {
    deleteConfirmModal.style.display = "none";
  });

  confirmDeleteBtn.addEventListener("click", async function () {
    if (!state.selectedEntry) return;

    try {
      if (onDeleteHandler) {
        await onDeleteHandler(state.selectedEntry);
      }

      deleteConfirmModal.style.display = "none";
      closeEntryModal();
    } catch (error) {
      alert("Failed to delete entry.");
    }
  });
}
