import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-rn";

import type { RootStackParamList } from "~/StackNavigator";

type Props = {
  title: string;
  callEnabled?: boolean;
};

export const Header = ({ title, callEnabled }: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={tw("p-2 flex-row items-center justify-between")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={handleGoBack} style={tw("p-2")}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw("rounded-full mr-4 p-3 bg-red-200")}>
          <Foundation name="telephone" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};
