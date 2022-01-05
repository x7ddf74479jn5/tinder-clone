import type { ImageSourcePropType } from "react-native";

type ImageName = "logo" | "logoFull" | "noImage" | "noProfile" | "matched";

export const images: { [key in ImageName]: ImageSourcePropType } = {
  logo: require("./logo.png"),
  logoFull: require("./Tinde-logo.png"),
  noImage: require("./no_image.png"),
  noProfile: require("./Crying_Face_Emoji_large.png"),
  matched: require("./its-a-match.png"),
};
