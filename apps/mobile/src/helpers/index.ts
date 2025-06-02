import { User } from "./interfaces";
import { useWalletStore } from "~/src/store/useWalletStore";
class Helpers {
  activeUser() {
    const { walletState } = useWalletStore();

    const user: User = {
      id: "1",
      fullName: "Account 1",
      avatar: "https://gravatar.com/avatar/151e7810a9fcf145111c80fb14011827?s=400&d=robohash&r=x",
      addressWallet: walletState?.address ? walletState?.address : "NaN"
    };

    return user;
  }

  genFriendsList(max: number | undefined = 5): Array<User> {
    const users: Array<User> = [];

    for (let index = 0; index < max; index++) {
      users.push({
        id: `"id${index + 1}"`,
        fullName: "Sam Allen",
        avatar: "https://gravatar.com/avatar/151e7810a9fcf145111c80fb14011827?s=400&d=robohash&r=x"
      } as never);
    }

    return users;
  }

  genAccountBalance(minAmount: number, maxAmount: number): number {
    const amount = minAmount + maxAmount;
    return Number(amount);
  }
}

export default new Helpers();
