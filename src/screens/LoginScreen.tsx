import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-rn";

import { useAuth } from "~/hooks/useAuth";

export const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();

  const handleSignIn = () => signInWithGoogle();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={tw("flex-1")}>
      <ImageBackground resizeMode="cover" style={tw("flex-1")} source={{ uri: "https://tinder.com/static/tinder.png" }}>
        <TouchableOpacity
          style={[tw("absolute  bottom-40 w-52 bg-white p-4 rounded-2xl"), { marginHorizontal: "25%" }]}
          onPress={handleSignIn}
        >
          <Text style={tw("text-center font-semibold")}>Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
