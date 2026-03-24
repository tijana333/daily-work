import { initTabs } from "./tabs.js";
import { initEntries } from "./entries.js";
import { initHeatmap } from "./heatmap.js";
import { initForm } from "./form.js";

const { fillFormForEdit } = initForm();
const { loadEntries } = initEntries(fillFormForEdit);

initTabs(loadEntries);
initHeatmap();
