import type { FieldValue } from "firebase/firestore";

import type { Profile } from "./Profile";

export type Match = {
  id: string;
  users: { [key: string]: Profile };
  userMatched: [string, string];
  timestamp: FieldValue;
};
