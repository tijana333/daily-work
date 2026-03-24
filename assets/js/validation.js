export function validateDate(dateElement, dateError, todayDate) {
  const dateValue = dateElement.value;

  dateError.classList.remove("show");
  dateElement.classList.remove("error");

  if (dateValue.length === 0) {
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

export function validateHours(hoursElement, hoursError) {
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

export function validateChallenge(challengeElement, challengeError) {
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
