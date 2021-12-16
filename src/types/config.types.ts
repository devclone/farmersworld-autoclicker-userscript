type Item = "ancientStoneAxe" | "stoneAxe" | "axe" | "saw" | "chainSaw" | "fishingRod" | "fishingNet" | "fishingBoat" | "miningExcavator";

type DurabilityTypes = {
  [key: string]: number;
};

interface ConfigTypes {
  minAmount: {
    durability: DurabilityTypes;
    energy: number;
  };
  timer: boolean;
}
