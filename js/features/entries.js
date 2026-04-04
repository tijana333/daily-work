const entriesList = document.getElementById("entries-list");
const entriesLoading = document.getElementById("entries-loading");
const emptyStateMessage = document.getElementById("empty-state-message");
let renderedEntries = [];

// SHOW ENTRIES
export function showEntriesLoading() {
  entriesLoading.style.display = "flex";
  entriesList.style.display = "none";
  emptyStateMessage.style.display = "none";
}
// HIDE ENTRIES
export function hideEntriesLoading() {
  entriesLoading.style.display = "none";
}
// ENTRIES ERROR
export function showEntriesError() {
  entriesLoading.style.display = "none";
  entriesList.style.display = "block";
  entriesList.textContent = "Something went wrong!";
}
//RENDER ENTRIES
export function renderEntries(entries) {
  if (entries.length === 0) {
    emptyStateMessage.style.display = "block";
    entriesList.style.display = "none";
  } else {
    emptyStateMessage.style.display = "none";
    entriesList.style.display = "flex";
  }
  renderedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  entriesList.innerHTML = renderedEntries
    .map((entry) => {
      const date = new Date(entry.date);
      const day = date.getDate();
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      return `
    <div class="entry-card" data-id="${entry._id}">
      
      <div class="entry-date">
        <span class="day">${day}</span>
        <span class="month">${monthYear}</span>
      </div>

      <div class="entry-content">
        <div class="hours">${entry.hours} hours</div>
        <div class="challenge">${entry.challenge}</div>
      </div>

      <div class="entry-intensity">
        ${entry.intensity}
      </div>

    </div>
  `;
    })
    .join("");
}
// INIT ENTRIES
export function initEntries({ onOpenModal }) {
  entriesList.addEventListener("click", function (event) {
    const card = event.target.closest(".entry-card");
    if (!card) return;

    const entryId = card.getAttribute("data-id");
    const entry = renderedEntries.find(function (item) {
      return item._id === entryId;
    });

    if (!entry) return;

    if (onOpenModal) {
      onOpenModal(entry);
    }
  });
}
