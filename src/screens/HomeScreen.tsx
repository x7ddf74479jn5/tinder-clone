import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";

import { images } from "~/assets";
import { db } from "~/firebase";
import { useAuth } from "~/hooks/useAuth";
import { generateId } from "~/lib/generateId";
import type { RootStackParamList } from "~/StackNavigator";
import type { Profile } from "~/types";

// const DUMMY_DATA = [
//   {
//     id: "123",
//     firstName: "Elon",
//     lastName: "Musk",
//     job: "Software Developer",
//     photo: images.noImage,
//     age: 40,
//   },
//   {
//     id: "456",
//     firstName: "Elon",
//     lastName: "Musk",
//     job: "Software Developer",
//     photo: images.noImage,
//     age: 40,
//   },
//   {
//     id: "789",
//     firstName: "Elon",
//     lastName: "Musk",
//     job: "Software Developer",
//     photo: images.noImage,
//     age: 40,
//   },
// ];

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const swiperRef = useRef<Swiper<Profile>>(null);

  const handleNavigateChat = () => navigation.navigate("Chat");
  const handleNavigateModal = () => navigation.navigate("Modal");

  const handleLogout = () => logout();

  const handleSwipeLeft = async (index: number) => {
    if (!profiles[index] || !user) return;

    const userSwiped = profiles[index];

    if (!userSwiped) return;

    setDoc(doc(db, "users", user?.uid, "passes", userSwiped.id), userSwiped);
  };
  const handleSwipeRight = async (index: number) => {
    if (!profiles[index] || !user) return;

    const userSwiped = profiles[index];

    if (!userSwiped) return;

    const loggedInProfile = (await (await await getDoc(doc(db, "users", user.uid))).data()) as Profile;

    // Check if the user swiped on you
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then((snapshot) => {
      if (snapshot.exists()) {
        // user has matched with you before your matched with them

        setDoc(doc(db, "users", user?.uid, "swipes", userSwiped.id), userSwiped);

        // create a match
        setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          userMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });

        if (loggedInProfile) {
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        }
      } else {
        // user has swiped at first interaction between the two rod didn't get swiped on

        setDoc(doc(db, "users", user?.uid, "swipes", userSwiped.id), userSwiped);
      }
    });
  };

  const handlePressNopeButton = () => swiperRef.current?.swipeLeft();
  const handlePressMatchButton = () => swiperRef.current?.swipeRight();

  useLayoutEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });

    return () => unsubscribe();
  }, [navigation, user]);

  useEffect(() => {
    if (!user) return;

    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, "users", user?.uid, "passes")).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const swipes = await getDocs(collection(db, "users", user?.uid, "swipes")).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const passedUserId = passes.length > 0 ? passes : ["test"];
      const swipedUserId = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(collection(db, "users"), where("id", "not-in", [...passedUserId, ...swipedUserId])),
        (snapshot) => {
          setProfiles(
            snapshot.docs.map((doc) => ({
              ...(doc.data() as Profile),
              id: doc.id,
            }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [user]);

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row items-center justify-between")}>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={tw("w-10 h-10 rounded-full")} source={{ uri: user?.photoURL || "" }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateModal}>
          <Image style={tw("w-14 h-14")} source={images.logo} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateChat}>
          <Ionicons name="chatbubble-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swiperRef}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          containerStyle={{ backgroundColor: "transparent" }}
          renderCard={(card) =>
            card ? (
              <View key={card.id} style={tw("relative bg-white h-3/4 rounded-xl")}>
                <Image style={tw("absolute top-0 h-full w-full rounded-xl")} source={{ uri: card.photoURL }} />

                <View
                  style={[
                    tw(
                      "absolute bottom-0  flex-row justify-between items-center bg-white w-full h-20 px-6 py-2 rounded-b-xl"
                    ),
                    style.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>{card.displayName}</Text>
                  </View>
                  <View>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), style.cardShadow]}>
                <Text style={tw("font-bold pb-5")}></Text>

                <Image style={tw("h-20 w-full")} height={100} width={100} source={images.noProfile} />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity onPress={handlePressNopeButton}>
          <Entypo
            name="cross"
            style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
            size={24}
            color="red"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePressMatchButton}>
          <Entypo
            name="heart"
            style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
            size={24}
            color="green"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
