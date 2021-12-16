const timer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function handleChargeTime(string: string) {
  const array = string.split(" ");
  // const newArray = array.map((item) => {
  //   console.log(item);
  //   let seconds;
  //   switch (item[1]) {
  //     case ("hours", "hour"):
  //       seconds = +item[0] * 3600;
  //       console.log(seconds);
  //       break;
  //     case "mins":
  //       seconds = +item[0] * 60;
  //       console.log(seconds);
  //       break;
  //     default:
  //       seconds = +item[0];
  //       console.log(seconds);
  //       break;
  //   }
  //   return seconds;
  // });
  return +array[0] * 60 * 1000 + 5 * 1000;
}

function handleCountDown(string: string) {
  // convert string to ms
  const delay = 5;
  const arr = string.split(":");
  const ms = (Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2])) * 1000 + delay * 1000;
  return ms;
}

function msToTime(ms: number) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = seconds / 3600; // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = seconds / 60; // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return `${hours > 0 ? hours + " hours" : ""} ${minutes > 0 ? minutes + " minutes" : ""} ${seconds > 0 ? seconds + " seconds" : ""}`.trim();
}

export { timer, msToTime, handleCountDown, handleChargeTime };
