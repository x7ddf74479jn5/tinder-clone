import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "tailwind-rn";

import { Header, ReceiverMessage, SenderMessage } from "~/components";
import { db } from "~/firebase";
import { useAuth } from "~/hooks/useAuth";
import { getMatchedUserInfo } from "~/lib/getMatchedUserInfo";
import type { RootStackParamList } from "~/StackNavigator";
import type { Message } from "~/types";

export const MessageScreen = () => {
  const { user } = useAuth();
  const router = useRoute<RouteProp<RootStackParamList, "Message">>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { matchDetails } = router.params;

  if (!user) throw new Error();

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              ...(doc.data() as Message),
              id: doc.id,
            }))
          )
      ),
    [matchDetails.id]
  );

  const handleChangeText = setInput;

  const handleSendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "message"), {
      timestamp: serverTimestamp(),
      userID: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid]?.photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header title={getMatchedUserInfo(matchDetails.users, user?.uid).displayName} callEnabled />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("pl-4")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback>
          <FlatList
            data={messages}
            inverted={true}
            style={tw("flex-1")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View style={tw("flex-row justify-between items-center border-t border-gray-200 px-5 py-2")}>
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder="Send Message..."
            onChangeText={handleChangeText}
            onSubmitEditing={handleSendMessage}
            value={input}
          />
          <Button onPress={handleSendMessage} title="Send" color="#FF5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
