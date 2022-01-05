import { ANDROID_CLIENT_ID, I0S_CLIENT_ID } from "@env";
import * as Google from "expo-google-app-auth";
import type { User } from "firebase/auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "~/firebase";

const config = {
  androidClientId: ANDROID_CLIENT_ID,
  iosClientId: I0S_CLIENT_ID,
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

interface UserContext {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<UserContext>({
  user: null,
  isLoading: false,
  isError: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signInWithGoogle: () => new Promise(() => {}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }

        setIsLoadingInitial(false);
      }),

    []
  );

  const logout = () => {
    setIsLoading(true);

    signOut(auth)
      .catch((e) => setIsError(e))
      .finally(() => setIsLoading(false));
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);

    Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === "success") {
          const { idToken, accessToken } = loginResult;
          const credential = GoogleAuthProvider.credential(idToken, accessToken);

          await signInWithCredential(auth, credential);
        }

        return Promise.reject();
      })
      .catch((e) => setIsError(e))
      .finally(() => setIsLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      isLoading,
      isError,
      signInWithGoogle,
      logout,
    }),
    [isError, isLoading, user]
  );

  return <AuthContext.Provider value={memoedValue}>{!isLoadingInitial && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
