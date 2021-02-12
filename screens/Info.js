import React from "react";
import { StyleSheet, ScrollView, View, Image, Text } from "react-native";

const Info = () => {

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                style={{ alignSelf: "center", width: '100%' }}
                source={require("../assets/logo.png")}
                resizeMode="contain"
            />

            <Text style={styles.title}>O nosso produto</Text>
            <Text style={styles.content}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis consequat metus. Quisque est lectus, rhoncus sit amet dui quis, viverra auctor elit. Donec at maximus ipsum, ut viverra erat. Vestibulum sem nisl, scelerisque et eros sed, semper pellentesque sapien. Praesent non lorem facilisis, rutrum ante et, mollis enim. Morbi vulputate, diam sed dictum convallis, ipsum lectus sodales sem, eu auctor nulla odio et purus. Maecenas cursus iaculis lectus, vitae porttitor urna sollicitudin at. Fusce rutrum lobortis mauris, viverra blandit risus lacinia nec. Mauris consectetur at lacus et gravida. Aliquam accumsan et erat at tincidunt. Nullam molestie quis nibh eu ultricies.</Text>

            <Text style={styles.title}>A Equipa</Text>

            <View style={{ flexDirection: 'row', height: 200, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image style={{ width: '48%', marginRight: '2%', borderRadius: 5 }} resizeMode='contain' source={require('../assets/jpraca.jpeg')} />
                <Image style={{ width: '48%', marginLeft: '2%', borderRadius: 5 }} resizeMode='contain' source={require('../assets/srocha.jpeg')} />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%'
    },
    title: {
        fontFamily: "OpenSans_700Bold",
        fontWeight: "bold",
        fontSize: 22,
        marginVertical: 10,
    },
    content: {
        fontFamily: "OpenSans_400Regular",
        fontSize: 16,
        paddingBottom: 5
    },
});

export default Info;
