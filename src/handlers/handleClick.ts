import { handleCountDown, msToTime } from "../utility/timers";
import { handleModalClose, logger } from "../utility/utility";
import handleLimitsCheck from "./handleLimits";
import { findItemWithLowestCd, handleItemsData } from "./handleToolData";
import { navigateToItem } from "./handleUINavigation";

export const handleClick = async (
  arrayOfItemNodes: HTMLCollectionOf<HTMLElement>,
  itemsData: (ToolInterface | MemberInterface)[],
  currentItem: ToolInterface | MemberInterface
) => {
  const mainButton = document.querySelector<HTMLElement>(".button-section");
  if (mainButton.textContent.toLocaleLowerCase() === "countdown") {
    return handleDisabledButton(arrayOfItemNodes, itemsData, currentItem);
  }

  const clickIsPossible = await handleLimitsCheck(currentItem);

  if (clickIsPossible) {
    handleActiveButton(arrayOfItemNodes, currentItem, mainButton);
  }
};

const handleActiveButton = async (
  arrayOfItemNodes: HTMLCollectionOf<HTMLElement>,
  currentItem: ToolInterface | MemberInterface,
  button: HTMLElement
) => {
  logger("---===Click Action Performing===---");
  button.click();
  const isModalClosed = await handleModalClose();
  if (isModalClosed) {
    if (button.textContent.toLowerCase() === "countdown") {
      logger(`Mine button click on ${currentItem.name}[id:${currentItem.id}] is SUCCESSFUL`);
      return setTimeout(async () => {
        const newItemsData = await handleItemsData(arrayOfItemNodes);
        if (newItemsData) {
          proceedToLowestCDAndClick(arrayOfItemNodes, newItemsData);
        }
      }, 4000);
    }
    logger("Button still active, retry click");
    handleActiveButton(arrayOfItemNodes, currentItem, button);
  }
};

const handleDisabledButton = (
  arrayOfItemNodes: HTMLCollectionOf<HTMLElement>,
  itemsData: (ToolInterface | MemberInterface)[],
  currentItem: ToolInterface | MemberInterface
) => {
  const countDownString = document.querySelector(".card-container--time").textContent;
  const countDown = handleCountDown(countDownString);

  const visibleItemName = document.querySelector(".info-title-name").textContent;

  if (visibleItemName !== currentItem.name) {
    proceedToLowestCDAndClick(arrayOfItemNodes, itemsData);
  }
  logger(
    `[${currentItem.name}: id ${
      currentItem.id
    }] Mine button not active yet, the click action will be performed in ${msToTime(countDown)}`
  );

  return setTimeout(() => {
    handleClick(arrayOfItemNodes, itemsData, currentItem);
  }, countDown);
};

export const proceedToLowestCDAndClick = async (
  arrayOfItemNodes: HTMLCollectionOf<HTMLElement>,
  itemsData: (ToolInterface | MemberInterface)[]
) => {
  const item = findItemWithLowestCd(itemsData);

  await navigateToItem(arrayOfItemNodes, item.id);
  handleClick(arrayOfItemNodes, itemsData, item);
};
