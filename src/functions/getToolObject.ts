import { config } from "./../config";
import { sentenceToCamelCase } from "../utility/utility";
import { handleCountDown } from "../utility/timerHandlers";

export default function getToolObject(index: number) {
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
  };
  return toolObj;
}
