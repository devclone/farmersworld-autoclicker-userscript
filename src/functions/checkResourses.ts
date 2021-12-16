import { logger, waitForElement } from "../utility/utility";
import { config } from "./../config";

// async function handleToolRepair(currentDurability) {
//   let response;
//   if (currentDurability <= minAmount.durability) {
//     logger(
//       `Current durability (${currentDurability}) less than or equal to specified limit (${minAmount.durability}), repairing...`
//     );
//     const repairButton = document.querySelectorAll(
//       ".plain-button.semi-short"
//     )[1];
//     if (repairButton.className.includes("disabled")) {
//       logger(
//         `You dont have enough gold to perform repair action\/nTool repair action is FAILED`
//       );
//       response = false;
//       return response;
//     }
//     logger(`---===Tool Repair Action Performing===---`);
//     setTimeout(() => {
//       repairButton.click();
//     }, 5000);
//     logger("Tool has been repaired");
//   }
//   response = true;
//   return response;
// }

async function handleEnergyRestore(currentEnergy: number, maxCapEnergy: number) {
  let response;
  if (currentEnergy <= config.minAmount.energy) {
    logger(`Current energy (${currentEnergy}) less than or equal to specified limit (${config.minAmount.energy})`);
    const currentFood = +document.querySelectorAll(".resource-number")[2].textContent;
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
      const foodRequired = Math.floor((maxCapEnergy - currentEnergy) / pointsPerFood);
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
    const exchangeSuccess = await waitForElement(".flash-container");
    if (exchangeSuccess) {
      logger("Energy restore action is SUCCESSFUL");
    }
  }
  response = true;
  return response;
}
function checkIfOneMoreClickIsAvailable(currentTool: ToolTypes, currentValue: number, action: string) {
  let response;
  const durabilityPerClick = +document.querySelectorAll(".info-description")[4];
  switch (action) {
    case "durability":
      if (currentValue > durabilityPerClick) {
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

export default async function checkResources(currentTool: ToolTypes) {
  // const currentDurability = +document
  //   .querySelector(".card-number")
  //   .textContent.split("/")[0];

  const currentEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[0];
  const maxCapEnergy = +document.querySelectorAll(".resource-number")[3].textContent.split("/")[1];
  if (
    // currentDurability <= minAmount.durability ||
    currentEnergy <= config.minAmount.energy
  ) {
    const clicker = document.getElementById("#auto-clicker");
    const energyRestoreResult = await handleEnergyRestore(currentEnergy, maxCapEnergy);
    if (!energyRestoreResult) {
      const checker = checkIfOneMoreClickIsAvailable(currentTool, currentEnergy, "energy");
      if (!checker) {
        clicker.textContent = "Auto-Click deactivated(fail occurred)";
        logger("You dont have enough energy to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down...");
        return;
      }
    }
    // const toolRepairResult = await handleToolRepair(currentDurability);
    // if (!toolRepairResult) {
    //   const checker = checkIfOneMoreClickIsAvalible(
    //     currentDurability,
    //     "durability"
    //   );
    //   if (!checker) {
    //     clicker.textContent = "Auto-Click deactivated(fail occurred)";
    //     logger(
    //       "You dont have enough durability to perform click action, supply your stocks and refresh page./n Auto-Click script shutting down..."
    //     );
    //     return;
    //   }
    // }
  }
}
