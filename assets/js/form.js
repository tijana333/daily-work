import {
  validateDate,
  validateHours,
  validateChallenge,
} from "./validation.js";
import { getEntryByDate, createEntry, editEntry } from "./api.js";

export function initForm() {
  const today = new Date().toISOString().split("T")[0];

  const form = document.getElementById("entry-form");
  const dateElement = document.getElementById("date");
  const successMsg = document.getElementById("success-message");
  const serverError = document.getElementById("server-error");

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnText = submitBtn.querySelector("span");
  const originalSubmitButtonText = submitBtnText.textContent;

  const noteElement = document.getElementById("note");
  const hoursElement = document.getElementById("number");
  const challengeElement = document.getElementById("text");

  const dateError = document.getElementById("date-error");
  const hoursError = document.getElementById("hours-error");
  const challengeError = document.getElementById("challenge-error");

  const date = new Date();
  const todayDate = date.toISOString().substring(0, 10);

  dateElement.max = todayDate;
  dateElement.value = today;

  let editingEntryId = null;
  let intensity = 1;

  const buttons = document.querySelectorAll(".intensity-button");

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtnText.textContent = "Saving...";
      submitBtn.disabled = true;
    } else {
      submitBtnText.textContent = originalSubmitButtonText;
      submitBtn.disabled = false;
    }
  }

  function fillFormForEdit(entry) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((t) => t.classList.remove("active"));

    document.querySelector('[data-tab="today"]').classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    document.getElementById("today-section").classList.add("active");

    editingEntryId = entry._id;
    submitBtnText.textContent = "Update Entry";

    dateElement.value = entry.date;
    hoursElement.value = entry.hours;
    challengeElement.value = entry.challenge;
    noteElement.value = entry.note || "";
    intensity = entry.intensity;

    buttons.forEach((button) => {
      button.classList.remove("active");
      const num = button.querySelector(".tab-number");

      if (num.textContent == String(entry.intensity)) {
        button.classList.add("active");
      }
    });
  }

  async function updateEntry(id, entry) {
    setLoading(true);
    await editEntry(id, entry);
    setLoading(false);
  }

  async function submitEntry(entry) {
    setLoading(true);
    await createEntry(entry);
    setLoading(false);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const entry = {
      date: dateElement.value,
      hours: Number(hoursElement.value),
      intensity,
      challenge: challengeElement.value.trim(),
      note: noteElement.value.trim(),
    };

    if (editingEntryId) {
      updateEntry(editingEntryId, entry);
    } else {
      submitEntry(entry);
    }
  });

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      intensity = Number(button.querySelector(".tab-number").textContent);
    });
  });

  return { fillFormForEdit };
}
