import { config } from "../config";
import { handleChargeTime, handleCountDown, timer } from "../utility/timerHandlers";
import { sentenceToCamelCase } from "../utility/utility";

export default async function getToolData(domArray: HTMLCollectionOf<HTMLElement>) {
  const initialArray = [];
  for (let index = 0; index < domArray.length; index++) {
    domArray[index].click();
    await timer(2000);
    const name = document.querySelector(".info-title-name").textContent;
    const countDown = document.querySelector(".card-container--time").textContent;
    const chargeTime = document.querySelectorAll(".info-description")[2].textContent;
    const toolObj: ToolTypes = {
      name,
      id: index,
      quantity: +document.querySelector(".info-title-level").textContent.split("/")[1],
      energyConsumed: +document.querySelectorAll(".info-description")[3].textContent,
      durabilityConsumed: +document.querySelectorAll(".info-description")[4].textContent,
      minDurability: config.minAmount.durability[sentenceToCamelCase(name)],
      countdown: handleCountDown(countDown),
      chargeTime: handleChargeTime(chargeTime),
    };
    initialArray.push(toolObj);
  }
  return initialArray;
}
