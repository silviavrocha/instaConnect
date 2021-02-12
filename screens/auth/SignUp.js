import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Alert, Image } from "react-native";
import { signUpAction } from "../../redux/authActions";
import { auth, db } from "../../config";
//import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Components
import LoadingIndicator from "../../components/LoadingIndicator";
import KeyboardAwareView from "../../components/KeyboardAwareView";

const height = Dimensions.get('window').height;

const SignUp = ({ navigation, signUpAction }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNameError, setNameError] = useState("");
    const [showEmailError, setEmailError] = useState(false);
    const [showPasswordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let array = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.exec(email)
        setNameError(name === "");
        setEmailError(email !== "" && array === null);
        setPasswordError((password !== "" || confirmPassword !== "") && password !== confirmPassword);
    }, [name, email, password, confirmPassword]);

    const handleSignUp = async () => {
        setLoading(true);
        
        try {
            const user = (await auth.createUserWithEmailAndPassword(email, password)).user;
            console.log(user);
            try {
                await auth.currentUser.updateProfile({ displayName: name });
                await db.collection("users").doc(user.uid).set({ name: name, email: email, id: auth.currentUser.uid });
            } catch (error) {
                console.error(error);
            }

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setNameError(false);
            setEmailError(false);
            setPasswordError(false);
            setLoading(false);

            signUpAction({ uid: user.uid, name: name, email: user.email });

        } catch (error) {
            console.log(error)
            let errorMessage = "";

            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "O e-mail já se encontra registado.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "O e-mail não é válido.";
                    break;
                case "auth/weak-password":
                    errorMessage = "A password escolhida é demasiado fraca.";
                    break;
                default:
                    errorMessage = error.message;
            }

            setLoading(false);

            Alert.alert("Erro na autenticação", errorMessage);
        }
    };

    const handleSignIn = () => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNameError(false);
        setEmailError(false);
        setPasswordError(false);

        navigation.navigate("SignIn");
    };

    // Components

    const SignUp = ({ style }) => (
        <View style={{ ...style, flex: 1, justifyContent: "center" , alignItems:'center'}}>
            <TouchableOpacity style={(name === "" || email === "" || password === ""  || confirmPassword === ""  || showNameError || showEmailError || showPasswordError) ? [styles.button, { backgroundColor: "#dadada" }] : styles.button} onPress={handleSignUp} disabled={email === "" || password === "" || showNameError || showEmailError || showPasswordError}>
                <Text style={[styles.buttonText, { color: '#8c0808'}]}>Registar</Text>
            </TouchableOpacity>
        </View>
    );

    const GoToSignIn = ({ style }) => (

        <View style={{ ...style, height: 60, justifyContent: "center", alignSelf: "center" }}>
            <Text style={{ fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 15, textAlign: 'center' }}>Já tens conta?</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAwareView>
            <View style={styles.container}>
                <View>
                    <Image
                        style={{ alignSelf: "center"}}
                        source={require("../../assets/logo.png")}
                        resizeMode="contain"
                        resizeMethod="scale"
                        width={350}
                        height={200}
                    />
                </View>

                <View style={{ marginTop: '5%' }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18, marginBottom:10  }}>Nome:</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            autoCompleteType="name"
                            textContentType="name"
                            keyboardType="default"
                            placeholder="Nome"
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />
                    </View>
                    {
                        showNameError ? 
                        (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>O nome é obrigatório</Text>)
                        :
                        null
                    }
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18, marginBottom:10  }}>E-mail:</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            placeholder="Endereço de email"
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                    {
                        showEmailError ? 
                        (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>O e-mail inserido não é válido</Text>)
                        :
                        null
                    }
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18, marginBottom:10  }}>Password</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            autoCapitalize="none"
                            autoCompleteType="password"
                            textContentType="password"
                            secureTextEntry
                            value={password}
                            placeholder="Password"
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18, marginBottom:10 }}>Confirmar password</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            autoCapitalize="none"
                            autoCompleteType="password"
                            textContentType="password"
                            secureTextEntry
                            value={confirmPassword}
                            placeholder="Password"
                            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                        />
                    </View>
                    {
                        showPasswordError ?
                        (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>As passwords não coincidem</Text>)
                        :
                        null
                    }
                </View>

                <SignUp />
                <GoToSignIn style={{ marginTop: 40, marginBottom: '5%', alignItems: 'center' }} />

                <LoadingIndicator show={loading} full />
            </View>
        </KeyboardAwareView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        justifyContent: "space-around",
        height: height*0.9,

    },
    inputField: {
        flexDirection: "row",
        borderBottomColor: "grey",
        borderBottomWidth: 1
    },
    submitButton: {
        alignItems: "center",
        marginHorizontal: '15%',
        paddingVertical: 5,
        paddingHorizontal: 40,
        backgroundColor: "#2084ef",
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
    }
});

export default connect(null, { signUpAction })(SignUp);
