export function validateDate(input, errorElement, todayDate) {
  const value = input.value;

  if (!value) {
    errorElement.textContent = "Date is required";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  if (value > todayDate) {
    errorElement.textContent = "Future date is not allowed";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  errorElement.classList.remove("show");
  input.classList.remove("error");
  return true;
}

export function validateHours(input, errorElement) {
  const value = Number(input.value);

  if (!input.value.trim()) {
    errorElement.textContent = "Hours are required";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  if (Number.isNaN(value) || value <= 0) {
    errorElement.textContent = "Hours must be greater than 0";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }
  if (value > 24) {
    errorElement.textContent = "Hours cannot be greater than 24";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  errorElement.classList.remove("show");
  input.classList.remove("error");
  return true;
}

export function validateChallenge(input, errorElement) {
  const value = input.value.trim();

  if (!value) {
    errorElement.textContent = "Challenge is required";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  if (value.length < 3) {
    errorElement.textContent = "Challenge must be at least 3 characters";
    errorElement.classList.add("show");
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  errorElement.classList.remove("show");
  input.classList.remove("error");
  return true;
}
