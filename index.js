const API_URL = "https://daily-work-backend.vercel.app/api/entries";
const tabs = document.querySelectorAll(".tab");
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (tbs) {
      tbs.classList.remove("active");
    });
    tab.classList.add("active");
    const content = document.querySelectorAll(".tab-content");
    content.forEach((c) => c.classList.remove("active"));

    const name = tab.dataset.tab;
    const id = name + "-section";
    if (name === "entries") {
      loadEntries();
    }

    document.getElementById(id).classList.add("active");
  });
});
const today = new Date().toISOString().split("T")[0];
document.getElementById("date").value = today;

const form = document.getElementById("entry-form");
const dateElement = document.getElementById("date");
const successMsg = document.getElementById("success-message");
const serverError = document.getElementById("server-error");
const entriesList = document.getElementById("entries-list");
const submitBtn = form.querySelector('button[type="submit"]');
const submitBtnText = submitBtn.querySelector("span");
let editingEntryId = null;
const originalSubmitButtonText = submitBtnText.textContent;
function setLoading(isLoading) {
  if (isLoading === true) {
    submitBtnText.textContent = "Saving...";
    submitBtn.disabled = true;
  } else {
    submitBtnText.textContent = originalSubmitButtonText;
    submitBtn.disabled = false;
  }
}
const date = new Date();
const todayDate = date.toISOString().substring(0, 10);
dateElement.max = todayDate;
let dateError = document.getElementById("date-error");

function validateDate() {
  const dateValue = dateElement.value;
  dateError.classList.remove("show");
  dateElement.classList.remove("error");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    dateError.classList.add("show");
    dateElement.classList.add("error");
    return false;
  } else if (dateValue > todayDate) {
    dateError.textContent = "Date cannot be in the future";
    dateError.classList.add("show");
    dateElement.classList.add("error");
    return false;
  }
  return true;
}
const noteElement = document.getElementById("note");

async function loadEntryByDate(selectedDate) {
  console.log("Selected date:", selectedDate);
  const response = await fetch(API_URL + "?date=" + selectedDate);
  console.log(response);

  if (response.status === 404) {
    editingEntryId = null;
    submitBtnText.textContent = "Save Entry";
    return;
  }
  const data = await response.json();
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
  const isValid = validateDate();
  if (isValid === true) {
    loadEntryByDate(dateElement.value);
  }
});
const hoursElement = document.getElementById("number");
let hoursError = document.getElementById("hours-error");

function validateHours() {
  const hoursValue = Number(hoursElement.value);
  hoursError.textContent = "";
  hoursError.classList.remove("show");
  hoursElement.classList.remove("error");

  if (hoursElement.value === "") {
    hoursError.textContent = "Select hours!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    return false;
  } else if (isNaN(hoursValue)) {
    hoursError.textContent = "Hours must be a number!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    return false;
  } else if (hoursValue < 0 || hoursValue > 24) {
    hoursError.textContent = "Hours must be between 0 and 24";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    return false;
  }
  return true;
}
hoursElement.addEventListener("input", function () {
  validateHours();
});

let challengeError = document.getElementById("challenge-error");
const challengeElement = document.getElementById("text");

function validateChallenge() {
  const challengeValue = challengeElement.value.trim();
  challengeError.textContent = "";
  challengeError.classList.remove("show");
  challengeElement.classList.remove("error");

  if (challengeValue === "") {
    challengeError.textContent = "Challenge is required";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
    return false;
  } else if (challengeValue.length > 100) {
    challengeError.textContent = "Maximum 100 characters";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
    return false;
  }
  return true;
}
challengeElement.addEventListener("input", function () {
  validateChallenge();
});

async function updateEntry(id, entry) {
  setLoading(true);
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (response.status === 200) {
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
async function submitEntry(entry) {
  setLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (response.status === 409) {
      serverError.textContent = "Entry for this date already exists";
      serverError.style.display = "block";
      successMsg.style.display = "none";
      return;
    }
    if (response.status === 201) {
      form.reset();
      intensity = 1;
      successMsg.style.display = "block";
      serverError.style.display = "none";
      const buttons = document.querySelectorAll(".intensity-button");
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

async function loadEntries() {
  entriesList.textContent = "Loading...";
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const entries = data.data;
    entriesList.innerHTML = entries
      .map(
        (entry) => `<div class="entries">
    data: ${entry.date}, hours: ${entry.hours}, intensity: ${entry.intensity}, challenge: ${entry.challenge}, note: ${entry.note}
  </div>`,
      )
      .join("");
  } catch (error) {
    entriesList.textContent = "Something went wrong!";
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let hasErrors = false;

  const isValidHours = validateHours();
  if (!isValidHours) {
    hasErrors = true;
  }
  const isValidChallenge = validateChallenge();
  if (!isValidChallenge) {
    hasErrors = true;
  }
  const isValidDate = validateDate();
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

let intensity = 1;
const buttons = document.querySelectorAll(".intensity-button");
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
