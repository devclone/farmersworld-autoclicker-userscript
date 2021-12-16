const timer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return `${hours > 0 ? hours + (hours > 1 ? " hours" : " hour") : ""} ${minutes > 0 ? minutes + (minutes > 1 ? " mins" : " min") : ""} ${
    seconds > 0 ? seconds + (seconds > 1 ? " seconds" : " second") : ""
  }`.trim();
}

export { timer, msToTime, handleCountDown };
