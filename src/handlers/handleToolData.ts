import { config } from "../config";
import { handleCountDown, timer } from "../utility/timers";
import { sentenceToCamelCase } from "../utility/utility";

export async function handleItemsData(arrayOfToolNodes: HTMLCollectionOf<HTMLElement>) {
  const initialArray = [];
  for (let index = 0; index < arrayOfToolNodes.length; index++) {
    arrayOfToolNodes[index].click();
    await timer(3000);
    const toolObj = makeItemObject(index);
    initialArray.push(toolObj);
  }
  return initialArray;
}

export function makeItemObject(index: number) {
  const name = document.querySelector(".info-title-name").textContent;
  const id = index;
  const countDown = handleCountDown(document.querySelector(".card-container--time").textContent);

  const isMember = name.toLowerCase().includes("member");

  const minDurability = config.minAmount.durability[sentenceToCamelCase(name)];
  const energyConsumed = +document.querySelectorAll(".info-description")[3]?.textContent;
  const durabilityConsumed = +document.querySelectorAll(".info-description")[4]?.textContent;
  const charges = +document.querySelector(".info-title-level")?.textContent.split("/")[0];

  if (isMember) {
    const resultMemberData: MemberInterface = {
      name,
      type: "member",
      countDown,
      id,
    };
    return resultMemberData;
  }
  const resultToolData: ToolInterface = {
    name,
    id,
    type: "tool",
    countDown,
    minDurability,
    energyConsumed,
    durabilityConsumed,
    charges,
  };

  return resultToolData;
}

export function findItemWithLowestCd(arrayOfItems: (ToolInterface | MemberInterface)[]) {
  const item = arrayOfItems.reduce((prev, cur) => {
    return prev.countDown < cur.countDown ? prev : cur;
  });
  return item;
}
