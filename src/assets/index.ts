import type { ImageSourcePropType } from "react-native";

type ImageName = "icon";

export const images: { [key in ImageName]: ImageSourcePropType } = {
  icon: require("./icon.png"),
};
