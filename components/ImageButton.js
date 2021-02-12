import React from "react";
import { TouchableOpacity, Image } from "react-native";

const ImageButton = ({ source, onPress }) => (
    <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={onPress}>
        <Image
            style={{ alignSelf: "center", height: 35, width: 50 }}
            source={source}
            resizeMode="contain"
            resizeMethod="scale"
            width={50}
            height={35}
        />
    </TouchableOpacity>
);

export default ImageButton;
