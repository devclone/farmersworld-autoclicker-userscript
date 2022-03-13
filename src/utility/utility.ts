import { timer } from "./timers";

async function waitForElement(selector: string) {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return document.querySelector<HTMLElement>(selector);
}

async function handleModalClose() {
  const modal = await waitForElement(".modal");
  if (modal) {
    const wrapper = document.querySelector<HTMLElement>(".wapper");
    wrapper.click();
    await timer(1000);
    logger("Modal is closed");
    return true;
  }
}

function logger(string: string) {
  const date = new Date().toTimeString().split(" ")[0];
  return console.log(`[${date}] ${string}`);
}

function sentenceToCamelCase(string: string) {
  return string
    .split(" ")
    .map((word, index) => (index === 0 ? word.toLowerCase() : word))
    .join("");
}

export { logger, sentenceToCamelCase, waitForElement, handleModalClose };
