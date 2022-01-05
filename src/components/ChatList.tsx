import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import tw from "tailwind-rn";

import { ChatRow } from "~/components";
import { db } from "~/firebase";
import { useAuth } from "~/hooks/useAuth";
import type { Match } from "~/types";

export const ChatList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    onSnapshot(query(collection(db, "matches"), where("usersMatches", "array-contains", user.uid)), (snapshot) =>
      setMatches(
        snapshot.docs.map((doc) => ({
          ...(doc.data() as Match),
          id: doc.id,
        }))
      )
    );
  }, [user]);

  return matches.length > 0 ? (
    <FlatList
      style={tw("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw("p-5")}>
      <Text style={tw("text-center text-lg")}>No matches at the moment 🥲</Text>
    </View>
  );
};
