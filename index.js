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
    intesity: intesity,
    challenge: challengeValue,
    note: noteValue,
  };
  console.log(entry);
});

let intesity = 0;
const button = document.querySelectorAll(".intesity-button");
button.forEach(function (button) {
  button.addEventListener("click", function (element) {
    const buttonValue = Number(element.target.textContent);
    intesity = buttonValue;
    console.log(intesity);
  });
});
