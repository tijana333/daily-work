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

  function hideMessages() {
    successMsg.style.display = "none";
    serverError.style.display = "none";
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
    hideMessages();

    try {
      const response = await editEntry(id, entry);

      if (response.status === 200 || response.ok) {
        successMsg.textContent = "Entry updated successfully!";
        successMsg.style.display = "block";
      } else {
        serverError.textContent = "Update failed!";
        serverError.style.display = "block";
      }
    } catch (error) {
      serverError.textContent = "Update failed!";
      serverError.style.display = "block";
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function submitEntry(entry) {
    setLoading(true);
    hideMessages();

    try {
      const response = await createEntry(entry);

      if (response.status === 409) {
        serverError.textContent = "Entry for this date already exists";
        serverError.style.display = "block";
        return;
      }

      if (response.status === 201 || response.ok) {
        successMsg.textContent = "Entry saved successfully!";
        successMsg.style.display = "block";

        form.reset();
        dateElement.value = today;
        intensity = 1;
        editingEntryId = null;
        submitBtnText.textContent = "Save Entry";

        buttons.forEach((button) => {
          button.classList.remove("active");
          const num = button.querySelector(".tab-number");
          if (num.textContent === "1") {
            button.classList.add("active");
          }
        });
      } else {
        serverError.textContent = "Something went wrong!";
        serverError.style.display = "block";
      }
    } catch (error) {
      serverError.textContent = "Something went wrong!";
      serverError.style.display = "block";
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideMessages();

    let hasErrors = false;

    const isValidDate = validateDate(dateElement, dateError, todayDate);
    if (!isValidDate) hasErrors = true;

    const isValidHours = validateHours(hoursElement, hoursError);
    if (!isValidHours) hasErrors = true;

    const isValidChallenge = validateChallenge(
      challengeElement,
      challengeError,
    );
    if (!isValidChallenge) hasErrors = true;

    const entry = {
      date: dateElement.value,
      hours: Number(hoursElement.value),
      intensity,
      challenge: challengeElement.value.trim(),
      note: noteElement.value.trim(),
    };

    if (hasErrors) {
      return;
    }

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
