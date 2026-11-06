/* ========================================
APP ENTRY POINT
Connects the features together.
Each feature lives in its own file in js/features/
===========================================*/
import { initTabs, showTab } from "./features/tabs.js";
import { initForm, startEditingEntry } from "./features/form.js";
import { initEntries, loadEntries, deleteEntry } from "./features/entries.js";
import { initModal } from "./features/modal.js";
import { initHeatmap, refreshHeatmap } from "./features/heatmap.js";

initTabs(function (tabName) {
  if (tabName === "entries") loadEntries();
});

initModal({
  onEdit(entry) {
    showTab("today");
    startEditingEntry(entry);
  },
  async onDelete(entry) {
    const deleted = await deleteEntry(entry);
    if (deleted) refreshHeatmap();
  },
});

initEntries();
initHeatmap();
initForm();
