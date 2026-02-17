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
  dateError.classList.remove("error");

  if (dateValue.length == 0) {
    dateError.textContent = "Select date!";
    classList.add("error");
  }
  return;
  console.log(dateValue);

  const hoursElement = document.getElementById("number");
  const hoursValue = Number(hoursElement.value);
  console.log(hoursValue);

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
