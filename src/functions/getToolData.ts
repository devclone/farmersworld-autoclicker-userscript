import { timer } from "../utility/timerHandlers";
import getToolObject from "./getToolObject";

export default async function getToolData(arrayOfToolNodes: HTMLCollectionOf<HTMLElement>) {
  const initialArray = [];
  for (let index = 0; index < arrayOfToolNodes.length; index++) {
    arrayOfToolNodes[index].click();
    await timer(2000);
    const toolObj = getToolObject(index);
    initialArray.push(toolObj);
  }
  return initialArray;
}
