let refreshHeatmapData = null;

export function initHeatmap({ apiUrl }) {
  const currentMonthElement = document.getElementById("current-month");
  const previousMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");
  const monthCarousel = document.getElementById("month-carousel");

  const grid = document.querySelector(".heatmap-grid");
  const emptyState = document.querySelector(".heatmap-empty-state");
  const tooltip = document.querySelector(".heatmap-tooltip");
  const heatmapContainer = document.querySelector(".heatmap-container");
  const totalHours = document.getElementById("total-hours");
  const daysLogged = document.getElementById("days-logged");
  const avgIntensity = document.getElementById("avg-intensity");
  let activeMonth = new Date();
  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;
  // RENDER MONTH
  function renderMonth() {
    const monthText = activeMonth.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
    });
    currentMonthElement.textContent = monthText;
  }
  // RENDER HEATMAP
  function renderHeatmap() {
    grid.innerHTML = "";

    const month = activeMonth.getMonth();
    const year = activeMonth.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    emptyState.style.display = "none";
    grid.style.display = "grid";

    for (let i = 1; i <= daysInMonth; i++) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("heatmap-day");

      newDiv.addEventListener("mouseenter", function () {
        if (!newDiv.entryData) return;

        const entry = newDiv.entryData;

        tooltip.textContent =
          "Date: " +
          entry.date +
          " | Hours: " +
          entry.hours +
          " | Intensity: " +
          entry.intensity;

        const rect = newDiv.getBoundingClientRect();
        const containerRect = heatmapContainer.getBoundingClientRect();

        tooltip.style.left =
          rect.left - containerRect.left + rect.width / 2 + "px";
        tooltip.style.top =
          rect.top - containerRect.top + rect.height + 12 + "px";
        tooltip.style.display = "block";
      });

      newDiv.addEventListener("mouseleave", function () {
        tooltip.style.display = "none";
      });

      grid.appendChild(newDiv);
    }
  }
  // LOAD HEATMAP DATA
  async function loadHeatmapData() {
    const month = activeMonth.getMonth();
    const year = activeMonth.getFullYear();

    try {
      const response = await fetch(
        apiUrl + "?month=" + (month + 1) + "&year=" + year,
      );

      if (!response.ok) {
        emptyState.style.display = "block";
        grid.style.display = "none";
        totalHours.textContent = "0";
        daysLogged.textContent = "0";
        avgIntensity.textContent = "0.0";
        return;
      }

      const data = await response.json();
      const entries = data.data || [];

      if (entries.length > 0) {
        grid.style.display = "grid";
        emptyState.style.display = "none";

        entries.forEach(function (entry) {
          const day = new Date(entry.date).getDate();
          const daySquare = grid.children[day - 1];

          if (!daySquare) return;

          daySquare.classList.add("level-" + entry.intensity);
          daySquare.entryData = entry;
        });
      } else {
        emptyState.style.display = "block";
        grid.style.display = "none";
      }

      let totalHoursSum = 0;
      let totalIntensity = 0;

      entries.forEach(function (entry) {
        totalHoursSum += entry.hours;
        totalIntensity += entry.intensity;
      });

      const daysLoggedCount = entries.length;
      const averageIntensity =
        entries.length > 0 ? totalIntensity / daysLoggedCount : 0;

      totalHours.textContent = totalHoursSum;
      daysLogged.textContent = daysLoggedCount;
      avgIntensity.textContent = averageIntensity.toFixed(1);
    } catch (error) {
      emptyState.style.display = "block";
      grid.style.display = "none";
      totalHours.textContent = "0";
      daysLogged.textContent = "0";
      avgIntensity.textContent = "0.0";
      console.error("Failed to load heatmap data:", error);
    }
    refreshHeatmapData = updateHeatmapMonth;
  }
  // UPDATE HEATMAP MONTH
  function updateHeatmapMonth() {
    renderMonth();
    renderHeatmap();
    loadHeatmapData();
  }

  previousMonthButton.addEventListener("click", function () {
    activeMonth = new Date(
      activeMonth.getFullYear(),
      activeMonth.getMonth() - 1,
      1,
    );
    updateHeatmapMonth();
  });

  nextMonthButton.addEventListener("click", function () {
    activeMonth = new Date(
      activeMonth.getFullYear(),
      activeMonth.getMonth() + 1,
      1,
    );
    updateHeatmapMonth();
  });

  monthCarousel.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  });

  monthCarousel.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX < 0) {
      activeMonth = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth() + 1,
        1,
      );
      updateHeatmapMonth();
    }

    if (deltaX > 0) {
      activeMonth = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth() - 1,
        1,
      );
      updateHeatmapMonth();
    }
  });

  updateHeatmapMonth();
}
export function refreshHeatmap() {
  if (refreshHeatmapData) {
    refreshHeatmapData();
  }
}
