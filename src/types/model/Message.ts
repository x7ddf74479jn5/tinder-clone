import type { FieldValue } from "firebase/firestore";

import type { Profile } from "./Profile";

export type Message = {
  id: string;
  userId: string;
  message: string;
  timestamp: FieldValue;
} & Pick<Profile, "displayName" | "photoURL">;
