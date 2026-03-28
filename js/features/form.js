import {
  submitEntry as submitEntryApi,
  updateEntry as updateEntryApi,
  loadEntryByDate as loadEntryByDateApi,
} from "../api/entriesApi.js";

import {
  validateDate,
  validateHours,
  validateChallenge,
} from "../utils/validators.js";
import { state } from "../state/state.js";

const form = document.getElementById("entry-form");
const dateElement = document.getElementById("date");
const hoursElement = document.getElementById("number");
const challengeElement = document.getElementById("text");
const noteElement = document.getElementById("note");

const submitBtn = form.querySelector('button[type="submit"]');
const submitBtnText = submitBtn.querySelector("span");

const successMsg = document.getElementById("success-message");
const serverError = document.getElementById("server-error");

const dateError = document.getElementById("date-error");
const hoursError = document.getElementById("hours-error");
const challengeError = document.getElementById("challenge-error");
const buttons = document.querySelectorAll(".intensity-button");

const todayDate = new Date().toISOString().substring(0, 10);
const originalSubmitButtonText = submitBtnText.textContent;
// SET LOADING
function setLoading(isLoading) {
  if (isLoading === true) {
    submitBtnText.textContent = "Saving...";
    submitBtn.disabled = true;
  } else {
    submitBtnText.textContent = originalSubmitButtonText;
    submitBtn.disabled = false;
  }
}
async function updateEntry(id, entry) {
  setLoading(true);
  try {
    const result = await updateEntryApi(id, entry);

    if (result.status === 200) {
      successMsg.textContent = "Entry updated successfully!";
      successMsg.style.display = "block";
      serverError.style.display = "none";
    } else {
      serverError.textContent = "Update failed!";
      serverError.style.display = "block";
      successMsg.style.display = "none";
    }
  } catch (error) {
    serverError.textContent = "Update failed!";
    serverError.style.display = "block";
    successMsg.style.display = "none";
  } finally {
    setLoading(false);
  }
}

// SUBMIT ENTRY
async function submitEntry(entry) {
  setLoading(true);
  try {
    const result = await submitEntryApi(entry);
    if (result.status === 409) {
      serverError.textContent = "Entry for this date already exists";
      serverError.style.display = "block";
      successMsg.style.display = "none";
      return;
    }
    if (result.status === 201) {
      form.reset();
      dateElement.value = todayDate;
      editingEntryId = null;
      submitBtnText.textContent = "Save Entry";
      intensity = 1;
      successMsg.style.display = "block";
      serverError.style.display = "none";
      buttons.forEach(function (button) {
        const numberSpan = button.querySelector(".tab-number");
        const spanValue = numberSpan.textContent;
        button.classList.remove("active");
        if (spanValue === "1") {
          button.classList.add("active");
        }
      });
    } else {
      serverError.textContent = "Something went wrong!";
      serverError.style.display = "block";
      successMsg.style.display = "none";
    }
  } finally {
    setLoading(false);
  }
}
// START EDITING ENTRY
export function startEditingEntry(entry) {
  editingEntryId = entry._id;
  submitBtnText.textContent = "Update Entry";

  dateElement.value = entry.date;
  hoursElement.value = entry.hours;
  challengeElement.value = entry.challenge;
  noteElement.value = entry.note || "";
  intensity = entry.intensity;

  buttons.forEach(function (intensityButton) {
    intensityButton.classList.remove("active");
    const numberSpan = intensityButton.querySelector(".tab-number");
    if (numberSpan.textContent == entry.intensity) {
      intensityButton.classList.add("active");
    }
  });
}
// LOAD ENTRY BY DATE
async function loadEntryByDate(selectedDate) {
  console.log("Selected date:", selectedDate);
  const result = await loadEntryByDateApi(selectedDate);
  console.log(result);

  if (result.status === 404) {
    editingEntryId = null;
    submitBtnText.textContent = "Save Entry";
    return;
  }
  const data = result.data;
  if (!data.data[0]) {
    editingEntryId = null;
    submitBtnText.textContent = "Save Entry";
    return;
  }
  const entry = data.data[0];
  if (data.data[0]) {
    editingEntryId = entry._id;
    console.log("SET ID:", editingEntryId);
    submitBtnText.textContent = "Update Entry";
  }
  console.log("ENTRY:", entry);
  hoursElement.value = entry.hours || "";
  challengeElement.value = entry.challenge;
  noteElement.value = entry.note || "";

  buttons.forEach(function (button) {
    button.classList.remove("active");
    const numberSpan = button.querySelector(".tab-number");
    if (numberSpan.textContent == entry.intensity) {
      button.classList.add("active");
    }
  });
}
dateElement.addEventListener("change", function () {
  const isValid = validateDate(dateElement, dateError, todayDate);
  if (isValid === true) {
    loadEntryByDate(dateElement.value);
  }
});
hoursElement.addEventListener("input", function () {
  validateHours(hoursElement, hoursError);
});

challengeElement.addEventListener("input", function () {
  validateChallenge(challengeElement, challengeError);
});
// FORM SUBMISSION
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let hasErrors = false;

  const isValidHours = validateHours(hoursElement, hoursError);

  if (!isValidHours) {
    hasErrors = true;
  }
  const isValidChallenge = validateChallenge(challengeElement, challengeError);
  if (!isValidChallenge) {
    hasErrors = true;
  }
  const isValidDate = validateDate(dateElement, dateError, todayDate);
  if (!isValidDate) {
    hasErrors = true;
  }
  let noteError = document.getElementById("note-error");
  const noteValue = noteElement.value.trim();

  noteError.textContent = "";
  noteError.classList.remove("show");
  noteElement.classList.remove("error");

  if (noteValue !== "" && noteValue.length > 500) {
    noteError.textContent = "Maximum 500 characters";
    noteError.classList.add("show");
    noteElement.classList.add("error");
    hasErrors = true;
  }
  if (hasErrors) {
    return;
  }
  const entry = {
    date: dateElement.value,
    hours: Number(hoursElement.value),
    intensity: intensity,
    challenge: challengeElement.value.trim(),
    note: noteValue,
  };
  if (editingEntryId) {
    updateEntry(editingEntryId, entry);
  } else {
    submitEntry(entry);
  }
});
// INTENSITY BUTTON
buttons.forEach(function (button) {
  const numberSpan = button.querySelector(".tab-number");
  const spanValue = numberSpan.textContent;
  if (spanValue === "1") {
    button.classList.add("active");
  }
});

buttons.forEach(function (button) {
  button.addEventListener("click", function (element) {
    buttons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    const numberSpan = button.querySelector(".tab-number");
    const buttonValue = numberSpan.textContent;
    intensity = Number(buttonValue);
  });
});
// INIT FORM
export function initForm() {
  dateElement.value = todayDate;
  dateElement.max = todayDate;
}
