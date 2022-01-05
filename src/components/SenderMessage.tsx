import { Text, View } from "react-native";
import tw from "tailwind-rn";

import type { Message } from "~/types";

type Props = {
  message: Message;
};

export const SenderMessage = ({ message }: Props) => {
  return (
    <View
      style={[
        tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
        {
          alignSelf: "flex-start",
          marginLeft: "auto",
        },
      ]}
    >
      <Text style={tw("text-white")}>{message.message}</Text>
    </View>
  );
};
