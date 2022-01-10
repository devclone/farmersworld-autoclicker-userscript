enum Type {
  "mining",
  "cow",
  "plant",
  "chicken",
}

interface ToolType {
  name: string;
  type: string;
  id: number;
  quantity: number;
  energyConsumed: number;
  durabilityConsumed: number;
  minDurability: number;
  countdown: number;
}
