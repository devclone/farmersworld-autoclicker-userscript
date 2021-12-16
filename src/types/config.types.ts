type DurabilityTypes = {
  [key: string]: number;
  saw: number;
  fishingRod: number;
  ancientStoneAxe: number;
};

interface ConfigTypes {
  minAmount: {
    durability: DurabilityTypes;
    energy: number;
  };
}
