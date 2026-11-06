/* ========================================
HTML ESCAPING
Converts special characters so user input
is shown as text instead of being run as HTML
===========================================*/
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ========================================
LOCAL DATES
toISOString() returns the date in UTC, which is
"yesterday" in Serbia between midnight and 1-2 AM.
These helpers always work with the local date.
===========================================*/

// Date object -> "YYYY-MM-DD" in local time
export function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// "YYYY-MM-DD" (or a full ISO string) -> Date at local midnight.
// new Date("2026-11-06") is parsed as UTC, which can shift the day.
export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.substring(0, 10).split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
