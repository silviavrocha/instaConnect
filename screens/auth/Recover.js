import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { auth } from "../../config";

// Components
import LoadingIndicator from "../../components/LoadingIndicator";
import KeyboardAwareView from "../../components/KeyboardAwareView";

const Recover = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        let array = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.exec(email)
        setShowError(email !== "" && array === null);
    }, [email]);


    useEffect(() => {
        setTimeout(() => {
            setEditable(true)
        }, 100)
    }, []);

    const handleRecover = async () => {
        setLoading(true);

        try {
            await auth.sendPasswordResetEmail(email);

            Alert.alert("Recuperação de conta", "Em breve irá receber um e-mail para recuperar a sua conta");

            navigation.navigate("SignIn");

        } catch (error) {
            console.error(error);

            Alert.alert("Recuperação de conta", "O email inserido não é válido, por favor tente outra vez.");
        }

        setEmail("");
        setLoading(false);
    };

    const handleSignIn = () => {
        setEmail("");

        navigation.navigate("SignIn");
    };

    // Components

    const Recover = ({ style }) => (
        <View style={{ ...style, flex: 1, justifyContent: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleRecover} disabled={email === "" || showError}>
                <Text style={[styles.buttonText, { color: '#8c0808' }]}>Recuperar Conta</Text>
            </TouchableOpacity>
        </View>
    );

    const GoToSignIn = ({ style }) => (

        <View style={{ ...style, height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAwareView>
            <View style={styles.container}>
                <View>
                    <Image
                        style={{ alignSelf: "center" }}
                        source={require("../../assets/logo.png")}
                        resizeMode="contain"
                        resizeMethod="scale"
                        width={350}
                        height={200}
                    />
                </View>

                <View style={{ width: '90%' }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18 }}>E-mail</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            autoCapitalize="none"
                            editable={editable}
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            placeholder="Endereço de email"
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                    {
                        showError ?
                            (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>O e-mail inserido não é válido</Text>)
                            :
                            null
                    }
                </View>

                <Recover style={{ marginTop: 40 }} />
                <GoToSignIn style={{ marginTop: '15%' }} />

                <LoadingIndicator show={loading} full />
            </View>
        </KeyboardAwareView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: '10%'
    },
    inputField: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        height: 40
    },
    submitButton: {
        alignItems: "center",
        marginHorizontal: 25,
        paddingVertical: 5,
        paddingHorizontal: 40,
        backgroundColor: "#1986e9",
        borderRadius: 35,
    },
    button: {
        backgroundColor: 'white',
        marginTop: 20,
        height: 50,
        width: 150,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },

    buttonText: {
        fontFamily: "OpenSans_700Bold",
        fontSize: 18,
        color: 'black',
        textAlign:'center'
    }
});

export default Recover;
