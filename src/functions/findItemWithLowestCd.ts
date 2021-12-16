export default function findItemWithLowestCd(arrayOfTools: ToolTypes[]) {
  const toolWithLowestCD = arrayOfTools.reduce((prev, cur) => {
    return prev.countdown < cur.countdown ? prev : cur;
  });
  return toolWithLowestCD;
}
