const API_URL = "https://daily-work-backend.vercel.app/api/entries";

export async function getEntryByDate(selectedDate) {
  const response = await fetch(API_URL + "?date=" + selectedDate);
  return response;
}

export async function createEntry(entry) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return response;
}

export async function editEntry(id, entry) {
  const response = await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return response;
}

export async function getEntries(currentView) {
  let url = API_URL;

  if (currentView === "month") {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    url = API_URL + "?month=" + month + "&year=" + year;
  }

  const response = await fetch(url);
  return response;
}

export async function getHeatmapEntries(activeMonth) {
  const month = activeMonth.getMonth();
  const year = activeMonth.getFullYear();

  const response = await fetch(
    API_URL + "?month=" + (month + 1) + "&year=" + year,
  );

  return response;
}

export async function removeEntry(id) {
  const response = await fetch(API_URL + "/" + id, {
    method: "DELETE",
  });
  return response;
}
