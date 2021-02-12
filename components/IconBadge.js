import React from "react";
import { View } from "react-native";

const IconBadge = ({ focused, children }) => {

    const color = focused ? "white" : "rgba(0, 0, 0, 0)";

    return (
        <View style={{ flex: 1, width: "100%", alignItems: "center", height: 80 }}>
            <View style={{ marginVertical: 5, width: "80%" }} />
            {children}
        </View>
    );
};

export default IconBadge;
