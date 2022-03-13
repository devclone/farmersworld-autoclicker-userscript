interface ItemInterface {
  name: string;
  id: number;
  countDown: number;
}

interface ToolInterface extends ItemInterface {
  type: "tool";
  energyConsumed: number;
  durabilityConsumed: number;
  minDurability: number;
  charges: number;
}
interface MemberInterface extends ItemInterface {
  type: "member";
}
