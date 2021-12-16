import { config } from "./config";
import { logger, waitForElement, appendLabel } from "./utility/utility";
import getToolData from "./functions/getToolData";
import { findLowestCdAndClick } from "./functions/clickHandlers";
// CONFIG
config;
// CONFIG
async function activateAutoClicker() {
  const isGameLoaded = await waitForElement(".button-section");
  if (!isGameLoaded) {
    return logger("Error with login occurred");
  }
  logger("Auto-Click script is running...");
  appendLabel();
  // If login succeed, then get info about all tools
  const arrayOfToolsDOM = document.querySelector("section.vertical-carousel-container").children;
  const initialToolsData = await getToolData(arrayOfToolsDOM as HTMLCollectionOf<HTMLElement>);
  if (initialToolsData) {
    logger("Initial Tool data is complete");
    console.log(initialToolsData);
    findLowestCdAndClick(arrayOfToolsDOM as HTMLCollectionOf<HTMLElement>, initialToolsData);
  }
}
activateAutoClicker();
