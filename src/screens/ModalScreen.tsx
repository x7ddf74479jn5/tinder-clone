import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-rn";

import { images } from "~/assets";
import { db } from "~/firebase";
import { useAuth } from "~/hooks/useAuth";
import type { RootStackParamList } from "~/StackNavigator";

export const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");

  const handleImageInputChange = setImage;
  const handleJobInputChange = setJob;
  const handleAgeInputChange = setAge;

  const isIncompleteForm = !image || !job || !age;

  const handleUpdateUserProfile = () => {
    if (!user) return;
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image style={tw("h-20 w-full")} resizeMode="contain" source={images.logoFull} />

      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Welcome {user?.displayName}</Text>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 1: The Profile Pic</Text>
      <TextInput
        value={image}
        onChangeText={handleImageInputChange}
        style={tw("text-center text-xl bb-2")}
        placeholder="Enter a Profile Pic URL"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 2: The Job</Text>
      <TextInput
        value={job}
        onChangeText={handleJobInputChange}
        style={tw("text-center text-xl bb-2")}
        placeholder="Enter your occupation"
        keyboardType="numeric"
        maxLength={2}
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 3: The Age</Text>
      <TextInput
        value={age}
        onChangeText={handleAgeInputChange}
        style={tw("text-center text-xl bb-2")}
        placeholder="Enter your age"
      />

      <TouchableOpacity
        onPress={handleUpdateUserProfile}
        disabled={isIncompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400"),
          isIncompleteForm ? tw("bg-gray-400") : tw("be-red-400"),
        ]}
      >
        <Text style={tw("text-center text-white text-sl")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
