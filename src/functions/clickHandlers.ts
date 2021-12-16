import { handleCountDown, msToTime } from "../utility/timerHandlers";
import { handleModalClose, logger } from "../utility/utility";
import findItemWithLowestCd from "./findItemWithLowestCd";
import checkResources from "./checkResourses";
import getToolData from "./getToolData";

async function handleClickOnMineButton(currentTool: ToolTypes, dataArray: ToolTypes[]) {
  // 1) Check if 'Mine' button is available
  const mineButton = document.querySelector<HTMLElement>(".button-section");
  const arrayOfToolsDOM = document.querySelector("section.vertical-carousel-container").children;
  if (mineButton.textContent !== "Mine") {
    const countDownString = document.querySelector(".card-container--time").textContent;
    const countDown = handleCountDown(countDownString);
    const toolWithLowestCd = findItemWithLowestCd(dataArray);
    logger(`Current tool [${currentTool.name}:id${currentTool.id}]: Tool with lowest CD [${currentTool.name}:id${currentTool.id}]`);
    console.log(dataArray);
    if (toolWithLowestCd.id === currentTool.id) {
      logger(`[${currentTool.name}:id${currentTool.id}] Mine button not active yet, the click action will be performed in ${msToTime(countDown)}`);
      setTimeout(() => {
        handleClickOnMineButton(currentTool, dataArray);
      }, countDown);
    } else {
      logger(`[debugger] on click fail]`);
      console.log(dataArray);
      findLowestCdAndClick(arrayOfToolsDOM as HTMLCollectionOf<HTMLElement>, dataArray);
    }
    return;
  }
  //  2) Check resources
  checkResources(currentTool);

  logger("---===Click Action Performing===---");
  mineButton.click();
  await handleModalClose();
  logger(`Mine button click on ${currentTool.name}[id:${currentTool.id}] is SUCCESSFUL`);

  setTimeout(async () => {
    const updatedData = await getToolData(arrayOfToolsDOM as HTMLCollectionOf<HTMLElement>);
    findLowestCdAndClick(arrayOfToolsDOM as HTMLCollectionOf<HTMLElement>, updatedData);
  }, 10000);
}

function findLowestCdAndClick(domArray: HTMLCollectionOf<HTMLElement>, dataArray: ToolTypes[]) {
  const toolWithLowestCD = findItemWithLowestCd(dataArray);
  console.log(toolWithLowestCD);
  domArray[toolWithLowestCD.id].click();
  setTimeout(() => handleClickOnMineButton(toolWithLowestCD, dataArray), 3000);
}

export { findLowestCdAndClick };
