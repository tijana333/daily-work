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
