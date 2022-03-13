import { config } from "./config";
import { proceedToLowestCDAndClick } from "./handlers/handleClick";
import { handleItemsData } from "./handlers/handleToolData";
import { logger, waitForElement } from "./utility/utility";

config;
async function init() {
  const isGameLoaded = await waitForElement(".button-section");
  if (!isGameLoaded) {
    return logger("Error with login occurred");
  }
  logger("Auto-Click script is running...");

  const arrayOfItemNodes = document.querySelector("section.vertical-carousel-container").children;
  const initialItemsData = await handleItemsData(arrayOfItemNodes as HTMLCollectionOf<HTMLElement>);

  if (initialItemsData) {
    console.log(initialItemsData);
    proceedToLowestCDAndClick(arrayOfItemNodes as HTMLCollectionOf<HTMLElement>, initialItemsData);
  }
}
init();
