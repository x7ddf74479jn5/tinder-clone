import type { Profile } from "~/types";

export const getMatchedUserInfo = (users: Record<string, Profile>, userLogin: string) => {
  const newUsers: { [key: string]: Profile } = { ...users };
  delete newUsers[userLogin];

  const [id, user] = Object.entries(newUsers).flat() as [id: string, user: Profile];

  return { ...user, id };
};
