export type IconType = "SEND" | "RECEIVE" | "SWAP" | "TOKENS";

export interface QuickAction {
  icon: IconType;
  label: string;
  onPress: () => void;
}
