import React from "react";
import { StyleSheet, Modal, View, ActivityIndicator } from "react-native";

const LoadingIndicator = ({ show, full }) => (
    <Modal
        transparent
        animationType="none"
        visible={show}
    >
        <View style={{ ...styles.loading, top: full ? 0 : 55, bottom: full ? 0 : 50 }}>
            <ActivityIndicator color="#2084ef" size="large" />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
});

export default LoadingIndicator;
