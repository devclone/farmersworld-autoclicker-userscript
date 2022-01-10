import { config } from "./../config";
import { logger, sentenceToCamelCase, waitForElement } from "../utility/utility";
import { timer } from "../utility/timerHandlers";

async function handleToolRepair() {
  const durabilityContent = document.querySelector(".content");
  const maxDurability = durabilityContent.textContent.split("/ ")[1];
  const repairButton = document.querySelectorAll<HTMLElement>(".plain-button.semi-short")[1];
  let response;
  // if repair button is disabled, then return false
  if (repairButton.className.includes("disabled")) {
    logger(`You dont have enough gold to perform repair action. Tool repair action is FAILED`);
    response = false;
    return response;
  }

  logger(`---===Tool Repair Action Performing===---`);
  repairButton.click();
  await timer(5000);
  if (durabilityContent.textContent === `${maxDurability}/ ${maxDurability}`) {
    logger("Tool repair action is SUCCESSFUL");
    response = true;
    return response;
  } else {
    handleToolRepair();
  }
}

async function handleEnergyRestore(currentEnergy: number) {
  const energyContent = document.querySelectorAll(".resource-number")[3];
  const maxCapEnergy = energyContent.textContent.split(" /")[1];
  const currentFood = +document.querySelectorAll(".resource-number")[2].textContent;
  let response;

  if (currentFood < 1) {
    logger(`You need at least 1 whole piece of food to perform energy restoration action\/n Energy restore action is FAILED`);
    response = false;
    return response;
  }
  logger(`---===Energy Restore Action Performing===---`);
  const addEnergyButton: HTMLElement = document.querySelector(".resource-energy--plus");
  addEnergyButton.click();
  const energyModal = await waitForElement(".exchange-modal");
  if (energyModal) {
    const plusEnergyButton: HTMLElement = document.querySelector('img[alt="Plus Icon"]');
    const pointsPerFood = 5;
    const foodRequired = Math.floor((Number(maxCapEnergy) - currentEnergy) / pointsPerFood);
    if (currentFood >= foodRequired) {
      // DO FULL ENERGY RESTORE
      for (let i = 0; i < foodRequired; i++) {
        plusEnergyButton.click();
      }
      logger(`Total energy restored: ${pointsPerFood * foodRequired}, food spent: ${foodRequired}`);
    } else {
      // DO ENERGY RESTORE WITH AVAILABLE AMOUNT OF FOOD
      for (let i = 0; i < Math.floor(currentFood); i++) {
        plusEnergyButton.click();
      }
      logger(`Total energy restored: ${pointsPerFood * Math.floor(currentFood)}, food spent: ${Math.floor(currentFood)}`);
    }
    const exchangeButton = await waitForElement(".plain-button.long:not(.disabled)");
    exchangeButton.click();
  }
  await timer(5000);
  if (energyContent.textContent === `${maxCapEnergy} /${maxCapEnergy}`) {
    logger("Energy restore action is SUCCESSFUL");
    response = true;
    return response;
  } else {
    handleEnergyRestore(currentEnergy);
  }
}

function checkIfOneMoreClickIsAvailable(currentTool: ToolType, currentValue: number, action: string) {
  let response;
  switch (action) {
    case "durability":
      if (currentValue > currentTool.durabilityConsumed) {
        response = true;
      } else {
        response = false;
      }
      break;
    case "energy":
      if (currentValue > currentTool.energyConsumed) {
        response = true;
      } else {
        response = false;
      }
      break;
    default:
      break;
  }
  return response;
}

export default async function checkLimitsHandler(currentTool: ToolType) {
  const clicker = document.getElementById("#auto-clicker");
  let response;
  logger("---===Limit check Action Performing===---");

  const currentEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[0];
  if (currentEnergy <= config.minAmount.energy) {
    logger(`Current energy (${currentEnergy}) less than or equal to specified limit (${config.minAmount.energy})`);
    const energyRestoreResult = await handleEnergyRestore(currentEnergy);
    logger("await energy restore?");
    if (!energyRestoreResult) {
      const checker = checkIfOneMoreClickIsAvailable(currentTool, currentEnergy, "energy");
      if (!checker) {
        clicker.textContent = "Auto-Click deactivated(fail occurred)";
        logger("You dont have enough energy to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
        response = false;
      }
    }
  }

  const currentDurability = +document.querySelector(".card-number").textContent.split("/")[0];
  if (currentDurability <= config.minAmount.durability[sentenceToCamelCase(currentTool.name)]) {
    logger(
      `Current durability (${currentDurability}) less than or equal to specified limit (${
        config.minAmount.durability[sentenceToCamelCase(currentTool.name)]
      }), repairing...`
    );
    const toolRepairResult = await handleToolRepair();
    if (!toolRepairResult) {
      const checker = checkIfOneMoreClickIsAvailable(currentTool, currentDurability, "durability");
      if (!checker) {
        clicker.textContent = "Auto-Click deactivated(fail occurred)";
        logger("You dont have enough durability to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
        response = false;
      }
    }
  }
  logger("Limit check action SUCCESSFUL");
  response = true;
  return response;
}
