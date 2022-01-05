import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { LogBox } from "react-native";

import { AuthProvider } from "~/hooks/useAuth";

import { StackNavigator } from "./StackNavigator";

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);
