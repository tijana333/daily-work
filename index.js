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
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const dateElement = document.getElementById("date");
  const dateValue = dateElement.value;
  let dateError = document.getElementById("date-error");
  dateError.textContent = "";
  dateElement.classList.remove("error");
  let formMessage = document.getElementById("form-message");
  formMessage.textContent = "";
  formMessage.classList.add("hidden");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    dateElement.classList.add("error");
    formMessage.textContent = "Select date!";
    formMessage.classList.remove("hidden");
    dateElement.closest(".form-group").prepend(formMessage);
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateValue);

  if (selectedDate > today) {
    dateError.textContent = "Date cannot be in the future";
    dateElement.classList.add("error");
    formMessage.textContent = "Date cannot be in the future";
    formMessage.classList.remove("hidden");
    dateElement.closest(".form-group").prepend(formMessage);

    return;
  }

  const hoursElement = document.getElementById("number");
  const hoursValue = Number(hoursElement.value);
  let hoursError = document.getElementById("hours-error");
  hoursError.textContent = "";
  hoursElement.classList.remove("error");

  if (hoursElement.value === "") {
    hoursError.textContent = "Select hours!";
    hoursElement.classList.add("error");
    formMessage.textContent = "Select hours!";
    formMessage.classList.remove("hidden");
    hoursElement.closest(".form-group").prepend(formMessage);
    return;
  }
  if (isNaN(hoursValue)) {
    hoursError.textContent = "Hours must be a number!";
    hoursElement.classList.add("error");
    formMessage.textContent = "Hours must be a number!";
    formMessage.classList.remove("hidden");
    hoursElement.closest(".form-group").prepend(formMessage);
    return;
  }

  if (hoursValue < 0 || hoursValue > 24) {
    hoursError.textContent = "Hours must be between 0 and 24";
    hoursElement.classList.add("error");
    formMessage.textContent = "Hours must be between 0 and 24";
    formMessage.classList.remove("hidden");
    hoursElement.closest(".form-group").prepend(formMessage);
    return;
  }

  const challengeElement = document.getElementById("text");
  const challengeValue = challengeElement.value.trim();
  let challengeError = document.getElementById("challenge-error");
  if (challengeElement.value === "") {
    challengeError.textContent = "Challenge is required";
    challengeElement.classList.add("error");
    formMessage.textContent = "Challenge is required!";
    formMessage.classList.remove("hidden");
    challengeElement.closest(".form-group").prepend(formMessage);
    return;
  }

  if (challengeValue === "") {
    challengeError.textContent = "Challenge is required";
    challengeElement.classList.add("error");
    formMessage.textContent = "Challenge is required!";
    formMessage.classList.remove("hidden");
    challengeElement.closest(".form-group").prepend(formMessage);
    return;
  }
  if (challengeValue.length > 100) {
    challengeError.textContent = "Maximum 100 characters";
    challengeElement.classList.add("error");
    formMessage.textContent = "Maximum 100 characters";
    formMessage.classList.remove("hidden");
    challengeElement.closest(".form-group").prepend(formMessage);
    return;
  }

  console.log(challengeValue);

  const noteElement = document.getElementById("note");
  const noteValue = noteElement.value.trim();
  let noteError = document.getElementById("note-error");

  if (noteValue !== "" && noteValue.length > 500) {
    noteError.textContent = "Maximum 500 characters";
    noteElement.classList.add("error");
    formMessage.textContent = "Maximum 500 characters";
    formMessage.classList.remove("hidden");
    noteElement.closest(".form-group").prepend(formMessage);
    return;
  }
  console.log(noteValue);

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
