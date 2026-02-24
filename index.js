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

let dateError = document.getElementById("date-error");
dateElement.addEventListener("change", function () {
  dateError.textContent = "";
  const dateValue = dateElement.value;
  dateError.classList.remove("show");
  dateElement.classList.remove("error");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    dateError.classList.add("show");
    dateElement.classList.add("error");
  } else if (dateValue > todayDate) {
    dateError.textContent = "Date cannot be in the future";
    dateError.classList.add("show");
    dateElement.classList.add("error");
  }
});
const hoursElement = document.getElementById("number");
let hoursError = document.getElementById("hours-error");
const hoursValue = Number(hoursElement.value);

hoursElement.addEventListener("input", function () {
  const hoursValue = Number(hoursElement.value);
  hoursError.textContent = "";
  hoursError.classList.remove("show");
  hoursElement.classList.remove("error");

  if (hoursElement.value === "") {
    hoursError.textContent = "Select hours!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
  } else if (isNaN(hoursValue)) {
    hoursError.textContent = "Hours must be a number!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
  } else if (hoursValue < 0 || hoursValue > 24) {
    hoursError.textContent = "Hours must be between 0 and 24";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
  }
});

let challengeError = document.getElementById("challenge-error");
const challengeElement = document.getElementById("text");

challengeElement.addEventListener("input", function () {
  const challengeValue = challengeElement.value.trim();
  challengeError.textContent = "";
  challengeError.classList.remove("show");
  challengeElement.classList.remove("error");

  if (challengeValue === "") {
    challengeError.textContent = "Challenge is required";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
  } else if (challengeValue.length > 100) {
    challengeError.textContent = "Maximum 100 characters";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
  }
});

async function submitEntry(entry) {
  console.log("saljem entry:", entry);
  const response = await fetch(
    "https://daily-work-backend.vercel.app/api/entries",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    },
  );
  const text = await response.text();
  if (response.status === 409) {
    alert("Entry for this date already exists");
    return;
  }
  if (response.status === 201) {
    form.reset();
    intensity = 1;
    const buttons = document.querySelectorAll(".intensity-button");
    buttons.forEach(function (button) {
      const numberSpan = button.querySelector(".tab-number");
      const spanValue = numberSpan.textContent;
      button.classList.remove("active");
      if (spanValue === "1") {
        button.classList.add("active");
      }
    });
  }

  console.log("status", response.status);
  console.log("response body:", text);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let hasErrors = false;
  const hoursValue = Number(hoursElement.value);

  hoursError.textContent = "";
  hoursError.classList.remove("show");
  hoursElement.classList.remove("error");

  if (hoursElement.value === "") {
    hoursError.textContent = "Select hours!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    hasErrors = true;
  } else if (isNaN(hoursValue)) {
    hoursError.textContent = "Hours must be a number!";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    hasErrors = true;
  } else if (hoursValue < 0 || hoursValue > 24) {
    hoursError.textContent = "Hours must be between 0 and 24";
    hoursError.classList.add("show");
    hoursElement.classList.add("error");
    hasErrors = true;
  }

  const challengeValue = challengeElement.value.trim();

  challengeError.textContent = "";
  challengeError.classList.remove("show");
  challengeElement.classList.remove("error");

  if (challengeValue === "") {
    challengeError.textContent = "Challenge is required";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
    hasErrors = true;
  } else if (challengeValue.length > 100) {
    challengeError.textContent = "Maximum 100 characters";
    challengeError.classList.add("show");
    challengeElement.classList.add("error");
    hasErrors = true;
  }

  const dateValue = dateElement.value;
  dateError.textContent = "";
  dateError.classList.remove("show");
  dateElement.classList.remove("error");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    dateError.classList.add("show");
    dateElement.classList.add("error");
    hasErrors = true;
  } else if (dateValue > todayDate) {
    dateError.textContent = "Date cannot be in the future";
    dateError.classList.add("show");
    dateElement.classList.add("error");
    hasErrors = true;
  }
  let noteError = document.getElementById("note-error");
  const noteElement = document.getElementById("note");
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
    date: dateValue,
    hours: hoursValue,
    intensity: intensity,
    challenge: challengeValue,
    note: noteValue,
  };
  submitEntry(entry);
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
    console.log(intensity);
  });
});
