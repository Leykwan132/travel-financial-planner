import React, { CSSProperties, useState } from "react";
import { Image, Dimensions, View } from "react-native";
import Images from "../assets/countries";
import { Skeleton } from "native-base";
interface ImageViewProps {
  // Define your component props here
  isoCode: string;
  style: CSSProperties;
}

export const ImageView: React.FC<ImageViewProps> = ({
  isoCode,
  style,
}: ImageViewProps) => {
  const [image, setImage] = useState("");

  const handleImageLoad = () => {
    setImage("loaded");
  };
  return (
    <View>
      {!image && <Skeleton style={style} />}
      <Image source={Images[isoCode]} style={style} onLoad={handleImageLoad} />
    </View>
  );
};
