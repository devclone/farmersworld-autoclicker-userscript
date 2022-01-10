import { config } from "./../config";
import { handleCountDown, msToTime } from "../utility/timerHandlers";
import { handleModalClose, logger } from "../utility/utility";
import findItemWithLowestCd from "./findItemWithLowestCd";
import checkLimitsHandler from "./checkLimitsHandler";
import getToolData from "./getToolData";
import { labelTimer } from "./labelHandler";

async function handleClickOnMineButton(arrayOfToolNodes: HTMLCollectionOf<HTMLElement>, toolWithLowestCd: ToolType, toolData: ToolType[]) {
  // 1) Check if 'Mine' button is available
  const mineButton = document.querySelector<HTMLElement>(".button-section");
  if (mineButton.textContent !== "Mine") {
    const countDownString = document.querySelector(".card-container--time").textContent;
    const countDown = handleCountDown(countDownString);
    const visibleToolName = document.querySelector(".info-title-name").textContent;
    console.log(toolData);
    console.log(toolWithLowestCd.name, visibleToolName);
    if (toolWithLowestCd.name !== visibleToolName) {
      logger("Names doesn't matches, searching for tool with lowest cd again...");
      return clickHandler(arrayOfToolNodes, toolData);
    } else {
      logger(`CD diff ${msToTime(toolData[1].countdown - toolData[0].countdown)}`);
      logger(
        `[${toolWithLowestCd.name}: id ${toolWithLowestCd.id}] Mine button not active yet, the click action will be performed in ${msToTime(
          countDown
        )}`
      );
      config.timer && labelTimer(`Next click: ${toolWithLowestCd.name} [id ${toolWithLowestCd.id}]`, countDown);
      return setTimeout(() => {
        handleClickOnMineButton(arrayOfToolNodes, toolWithLowestCd, toolData);
      }, countDown);
    }
  }

  // 2) Check resources
  const checkedResult = await checkLimitsHandler(toolWithLowestCd);

  // 3) Click action
  if (checkedResult) {
    logger("---===Click Action Performing===---");
    mineButton.click();
    await handleModalClose();
    logger(`Mine button click on ${toolWithLowestCd.name}[id:${toolWithLowestCd.id}] is SUCCESSFUL`);
    setTimeout(async () => {
      const newToolData = await getToolData(arrayOfToolNodes);
      clickHandler(arrayOfToolNodes, newToolData);
    }, 10000);
  }
}

export default function clickHandler(arrayOfToolNodes: HTMLCollectionOf<HTMLElement>, toolData: ToolType[]) {
  const toolWithLowestCd = findItemWithLowestCd(toolData);
  arrayOfToolNodes[toolWithLowestCd.id].click();
  setTimeout(() => handleClickOnMineButton(arrayOfToolNodes, toolWithLowestCd, toolData), 3000);
}
