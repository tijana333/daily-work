const API_URL = "https://daily-work-backend.vercel.app/api/entries";

export async function submitEntry(entry) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return response;
}

export async function updateEntry(id, entry) {
  const response = await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return response;
}

export async function loadEntryByDate(selectedDate) {
  const response = await fetch(API_URL + "?date=" + selectedDate);
  return response;
}
export async function loadEntries(url) {
  const response = await fetch(url);
  return response;
}
