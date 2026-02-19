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

    document.getElementById(id).classList.add("active");
  });
});

const form = document.getElementById("entry-form");
const dateElement = document.getElementById("date");
const date = new Date();
const todayDate = date.toISOString().substring(0, 10);
dateElement.max = todayDate;
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let hasErrors = false;
  let dateError = document.getElementById("date-error");
  const dateValue = dateElement.value;
  let hoursError = document.getElementById("hours-error");
  const hoursElement = document.getElementById("number");
  const hoursValue = Number(hoursElement.value);

  let challengeError = document.getElementById("challenge-error");
  const challengeElement = document.getElementById("text");
  const challengeValue = challengeElement.value.trim();

  let noteError = document.getElementById("note-error");
  const noteElement = document.getElementById("note");
  const noteValue = noteElement.value.trim();

  dateError.textContent = "";
  dateElement.classList.remove("error");

  hoursError.textContent = "";
  hoursElement.classList.remove("error");

  challengeError.textContent = "";
  challengeElement.classList.remove("error");

  noteError.textContent = "";
  noteElement.classList.remove("error");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    dateElement.classList.add("error");
    hasErrors = true;
  }

  if (dateValue > todayDate) {
    dateError.textContent = "Date cannot be in the future";
    dateElement.classList.add("error");
    hasErrors = true;
  }

  if (hoursElement.value === "") {
    hoursError.textContent = "Select hours!";
    hoursElement.classList.add("error");
    hasErrors = true;
  }
  if (isNaN(hoursValue)) {
    hoursError.textContent = "Hours must be a number!";
    hoursElement.classList.add("error");

    hasErrors = true;
  }

  if (hoursValue < 0 || hoursValue > 24) {
    hoursError.textContent = "Hours must be between 0 and 24";
    hoursElement.classList.add("error");
    hasErrors = true;
  }

  if (challengeValue === "") {
    challengeError.textContent = "Challenge is required";
    challengeElement.classList.add("error");
    hasErrors = true;
  }
  if (challengeValue.length > 100) {
    challengeError.textContent = "Maximum 100 characters";
    challengeElement.classList.add("error");
    hasErrors = true;
  }

  if (noteValue !== "" && noteValue.length > 500) {
    noteError.textContent = "Maximum 500 characters";
    noteElement.classList.add("error");
    hasErrors = true;
  }
  if (hasErrors) {
    return;
  }
  const entry = {
    date: dateValue,
    hours: hoursValue,
    intensity: intensity,
    challenge: challengeValue,
    note: noteValue,
  };
  console.log(entry);
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
    const buttonValue = element.target.textContent;
    intensity = Number(buttonValue);
    console.log(intensity);
  });
});
