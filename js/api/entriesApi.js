const API_URL = "https://daily-work-backend.vercel.app/api/entries";

export async function submitEntry(entry) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

export async function updateEntry(id, entry) {
  const response = await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

export async function loadEntryByDate(selectedDate) {
  const response = await fetch(API_URL + "?date=" + selectedDate);
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
// Without arguments loads all entries,
// with { month, year } loads only that month (month is 1-12)
export async function loadEntries({ month, year } = {}) {
  let url = API_URL;
  if (month && year) {
    url = API_URL + "?month=" + month + "&year=" + year;
  }
  const response = await fetch(url);
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

export async function deleteEntry(id) {
  const response = await fetch(API_URL + "/" + id, {
    method: "DELETE",
  });
  // DELETE may return an empty body, so the JSON is not read here
  return {
    status: response.status,
    ok: response.ok,
  };
}
