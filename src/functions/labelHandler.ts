export function labelInit() {
  const container = document.querySelector(".game-container");
  const divWrapper = document.createElement("div");
  divWrapper.classList.add("label");

  divWrapper.id = "auto-clicker";
  divWrapper.style.top = "50px";
  divWrapper.style.left = "50%";
  divWrapper.style.transform = "translateX(-50%)";
  divWrapper.style.border = "1px solid transparent";
  divWrapper.style.borderRadius = "5px";
  divWrapper.style.padding = "3px 8px";
  divWrapper.style.backgroundColor = "#D1A79D";
  divWrapper.style.position = "absolute";
  divWrapper.style.color = "#fafafa";
  divWrapper.style.fontSize = "15px";
  divWrapper.style.display = "flex";
  divWrapper.style.flexDirection = "column";

  const divTitle = document.createElement("div");
  divTitle.classList.add("label__title");
  divTitle.innerText = `Auto-Clicker activated`;

  const divContent = document.createElement("div");
  divContent.classList.add("label__content");

  container.appendChild(divWrapper);
  divWrapper.appendChild(divTitle);
  divWrapper.appendChild(divContent);
}

export function labelTimer(string: string, ms: number) {
  const end = Date.now() + ms;
  const interval = setInterval(() => {
    const content = document.querySelector(".label__content");
    let start = Date.now();
    let diff = end - start;

    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    content.innerHTML =
      string +
      " " +
      `in ${hours > 0 ? hours + (hours > 1 ? " hours" : " hour") : ""} ${minutes > 0 ? minutes + (minutes > 1 ? " mins" : " min") : ""} ${
        seconds > 0 ? seconds + (seconds > 1 ? " seconds" : " second") : ""
      }`.trim();
    if (diff < 0) {
      clearInterval(interval);
      content.innerHTML = string + " EXPIRED";
    }
  }, 1000);
}
