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
  console.log(challengeValue);

  const noteElement = document.getElementById("note");
  const noteValue = noteElement.value.trim();
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

let intensity = 0;
const buttons = document.querySelectorAll(".intensity-button");
buttons.forEach(function (button) {
  button.addEventListener("click", function (element) {
    buttons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    const buttonValue = element.target.textContent;
    intensity = buttonValue;
    console.log(intensity);
  });
});
