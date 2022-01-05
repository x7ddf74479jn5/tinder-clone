import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-rn";

import { db } from "~/firebase";
import { useAuth } from "~/hooks/useAuth";
import { getMatchedUserInfo } from "~/lib/getMatchedUserInfo";
import type { RootStackParamList } from "~/StackNavigator";
import type { Match, Profile } from "~/types";

type Props = {
  matchDetails: Match;
};

export const ChatRow = ({ matchDetails }: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState<Profile | null>(null);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    if (!matchDetails.users || !user?.uid) return;
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user?.uid));
  }, [matchDetails.users, user?.uid]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data().message)
      ),
    [matchDetails.id]
  );

  const handleNavigateMessage = () =>
    navigation.navigate("Message", {
      matchDetails,
    });

  return (
    <TouchableOpacity
      style={[tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"), style.cardShadow]}
      onPress={handleNavigateMessage}
    >
      <Image style={tw("rounded-full h-16 y-16 mr-4")} source={{ uri: matchedUserInfo?.photoURL }} />

      <View>
        <Text style={tw("text-lg font-semibold")}>{matchedUserInfo?.displayName}</Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
