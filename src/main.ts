import { config } from "./config";
import { logger, waitForElement } from "./utility/utility";
import getToolData from "./functions/getToolData";
import clickHandler from "./functions/clickHandler";
import { labelInit } from "./functions/labelHandler";

config;
async function activateAutoClicker() {
  const isGameLoaded = await waitForElement(".button-section");
  if (!isGameLoaded) {
    return logger("Error with login occurred");
  }
  logger("Auto-Click script is running...");
  labelInit();
  const arrayOfToolNodes = document.querySelector("section.vertical-carousel-container").children;
  const initialToolsData = await getToolData(arrayOfToolNodes as HTMLCollectionOf<HTMLElement>);
  if (initialToolsData) {
    logger("Initial Tool data is complete");
    clickHandler(arrayOfToolNodes as HTMLCollectionOf<HTMLElement>, initialToolsData);
  }
}
activateAutoClicker();
