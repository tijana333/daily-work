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
import { toLocalDateString } from "../utils/helpers.js";

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
let editingEntryId = null;
let intensity = 1;

const todayDate = toLocalDateString(new Date());
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
      clearEntryFields();
      successMsg.textContent = "Entry created successfully!";
      successMsg.style.display = "block";
      serverError.style.display = "none";
    } else {
      serverError.textContent = "Something went wrong!";
      serverError.style.display = "block";
      successMsg.style.display = "none";
    }
  } finally {
    setLoading(false);
  }
}
// INTENSITY
// Keeps the intensity variable and the active button in sync
function setIntensity(value) {
  intensity = Number(value);
  buttons.forEach(function (button) {
    const numberSpan = button.querySelector(".tab-number");
    button.classList.toggle("active", Number(numberSpan.textContent) === intensity);
  });
}

// FILL / CLEAR FORM
function fillEntryFields(entry) {
  editingEntryId = entry._id;
  submitBtnText.textContent = "Update Entry";
  hoursElement.value = entry.hours ?? "";
  challengeElement.value = entry.challenge || "";
  noteElement.value = entry.note || "";
  setIntensity(entry.intensity || 1);
}

// Clears everything except the date, so a date without an entry
// doesn't keep the values from the previously selected date
function clearEntryFields() {
  editingEntryId = null;
  submitBtnText.textContent = "Save Entry";
  hoursElement.value = "";
  challengeElement.value = "";
  noteElement.value = "";
  setIntensity(1);
}

// START EDITING ENTRY
export function startEditingEntry(entry) {
  dateElement.value = entry.date;
  fillEntryFields(entry);
}

// LOAD ENTRY BY DATE
async function loadEntryByDate(selectedDate) {
  try {
    const result = await loadEntryByDateApi(selectedDate);

    // The user picked another date while this request was running
    if (dateElement.value !== selectedDate) return;

    const entry = result.status === 200 ? result.data.data?.[0] : null;
    if (entry) {
      fillEntryFields(entry);
    } else {
      clearEntryFields();
    }
  } catch (error) {
    clearEntryFields();
    serverError.textContent = "Could not load the entry for this date";
    serverError.style.display = "block";
    successMsg.style.display = "none";
  }
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
setIntensity(1);

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const numberSpan = button.querySelector(".tab-number");
    setIntensity(numberSpan.textContent);
  });
});
// INIT FORM
export function initForm() {
  dateElement.value = todayDate;
  dateElement.max = todayDate;
}
