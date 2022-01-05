/* eslint-disable @typescript-eslint/naming-convention */
import { createStackNavigator } from "@react-navigation/stack";
import type { DocumentData } from "firebase/firestore";

import { useAuth } from "~/hooks/useAuth";
import { ChatScreen, HomeScreen, LoginScreen, MatchedScreen, MessageScreen, ModalScreen } from "~/screens";
import type { Match, Profile } from "~/types";

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Modal: undefined;
  Login: undefined;
  Match: { loggedInProfile: DocumentData; userSwiped: Profile };
  Message: { matchDetails: Match };
};

const Stack = createStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={MatchedScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
