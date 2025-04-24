import { getUser } from "@/actions/user";
import { atom } from "jotai";

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  columnOrder: string;
}

const baseUserAtom = atom<User | null>(null);

export const userAtom = atom(
  async (get) => {
    const user = get(baseUserAtom);
    if (user) return user;

    const dbUser = await getUser();
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      planColumnOrder: dbUser.planColumnOrder || "",
      shipmentColumnOrder: dbUser.shipmentColumnOrder || "",
    };
  },
  async (get, set, newUser: User | null) => {
    set(baseUserAtom, newUser);
  },
);
