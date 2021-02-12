import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const KeyboardAwareView = ({ children }) => (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column", justifyContent: "center", width: "100%", height: "100%" }} behavior="height" enabled>
        <ScrollView style={{ flex: 1, flexDirection: "column"}} keyboardShouldPersistTaps={"handled"}>
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
);

export default KeyboardAwareView;
