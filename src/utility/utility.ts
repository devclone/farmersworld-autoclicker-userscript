async function waitForElement(selector: string) {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return document.querySelector<HTMLElement>(selector);
}

async function handleModalClose() {
  const modal = await waitForElement(".modal");
  if (modal) {
    const wrapper = document.querySelector<HTMLElement>(".wapper");
    setTimeout(() => {
      wrapper.click();
      logger("Modal is closed");
    }, 10000);
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

function appendLabel() {
  const container = document.querySelector(".game-container");
  const label = document.createElement("div");
  label.id = "auto-clicker";
  label.innerText = `Auto-Clicker activated`;
  label.style.top = "50px";
  label.style.left = "50%";
  label.style.transform = "translateX(-50%)";
  label.style.border = "1px solid transparent";
  label.style.borderRadius = "5px";
  label.style.padding = "3px 8px";
  label.style.backgroundColor = "#D1A79D";
  label.style.position = "absolute";
  label.style.color = "#fafafa";
  label.style.fontSize = "15px";
  container!.appendChild(label);
}

export { logger, sentenceToCamelCase, appendLabel, waitForElement, handleModalClose };
