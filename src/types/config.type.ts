type Item =
  | "ancientStoneAxe"
  | "stoneAxe"
  | "axe"
  | "saw"
  | "chainsaw"
  | "fishingRod"
  | "fishingNet"
  | "fishingBoat"
  | "miningExcavator";

type DurabilityTypes = {
  [key: string]: number;
};

interface Config {
  minAmount: {
    durability: DurabilityTypes;
    energy: number;
  };
  timer: boolean;
}
