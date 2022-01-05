import { SafeAreaView } from "react-native";

import { ChatList, Header } from "~/components";

export const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};
