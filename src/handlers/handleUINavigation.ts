import { timer } from "../utility/timers";

export async function navigateToItem(arrayOfNodes: HTMLCollectionOf<HTMLElement>, id: number) {
  arrayOfNodes[id].click();
  await timer(3000);
}
