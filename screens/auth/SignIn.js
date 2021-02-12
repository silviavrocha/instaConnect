import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Alert, Image } from "react-native";
import { signInAction } from "../../redux/authActions";
import { auth, db } from "../../config";

import axios from 'axios';

// Components
import KeyboardAwareView from "../../components/KeyboardAwareView";
import LoadingIndicator from "../../components/LoadingIndicator";

import { NetworkInfo } from "react-native-network-info";
import publicIP from 'react-native-public-ip';


const height = Dimensions.get('window').height;

const SignIn = ({ navigation, signInAction }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editable, setEditable] = useState(false);


    const verifyLogin = async () => {

        await auth.onAuthStateChanged(async user => {
            if (user) {
                // User is signed in.
                const userDB = (await db.collection("users").doc(user.uid).get()).data();
                signInAction({ uid: user.uid, name: user.displayName, email: user.email, description: userDB.description, tags: userDB.tags, image: userDB.image });
            } else {
                // No user is signed in.
            }
        });
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted)
            setLoading(true);

        verifyLogin().then(() => {
            if (isMounted) setLoading(false);
        })

        setTimeout(() => {
            setEditable(true)
        }, 100)

        return () => { isMounted = false };
    }, []);

    const handleSignIn = async () => {
        setLoading(true);

        try {
            const user = (await auth.signInWithEmailAndPassword(email, password)).user;
            publicIP()
            .then(async ip => {    
              console.log(ip);
                let a = await axios.get('http://api.ipstack.com/' + ip+ '?access_key=81a79c0633b72484636e6946f299042a')
                .then((response) => {
                    console.log(response.data);
                    return response.data;
                }).catch((err) => {
                    console.log(err)
                }); 
            });
          
            const userDB = (await db.collection("users").doc(user.uid).get()).data();
            setLoading(false);

            signInAction({ uid: user.uid, name: user.displayName, email: user.email, description: userDB.description, tags: userDB.tags });

        } catch (error) {
            let errorMessage = error.message;

            switch (error.code) {
                case "auth/invalid-email":
                    errorMessage = "O e-mail não é válido.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "O utilizador encontra-se suspenso.";
                    break;
                case "auth/user-not-found":
                case "auth/wrong-password":
                    errorMessage = "A combinação e-mail/palavra-passe está incorreta.";
                    break;
                case "E_AWAIT_PROMISE":
                    errorMessage = "Apenas dispositivos móveis físicos podem registar-se para notificações";
                    break;
                default:
                    console.error(error.code);
            }

            setPassword("");
            setLoading(false);

            Alert.alert("Erro na autenticação", errorMessage);
        }
    };

    const handleSignUp = () => {
        setEmail("");
        setPassword("");
        setError(false);

        navigation.navigate("SignUp");
    };

    const handleRecover = () => {
        setEmail("");
        setPassword("");
        setError(false);

        navigation.navigate("Recover");
    };


    // Components

    const SignIn = ({ style }) => (
        <View style={{ ...style, height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={[styles.buttonText, { color: '#8c0808' }]}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );

    const GoToSignUp = ({ style }) => (
        <View style={{ ...style, height: 60, justifyContent: "center", alignSelf: "center" }}>
            <Text style={{ fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 15, textAlign: 'center' }}>Ainda não tens conta?</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>

        </View>
    );

    const GoToRecover = ({ style }) => (
        <TouchableOpacity style={style} onPress={handleRecover}>
            <Text style={{ textDecorationLine: "underline", fontFamily: "OpenSans_400Regular", fontWeight: "bold" }}>Esqueci-me da palavra-passe</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAwareView >
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
                            style={{ fontSize: 16, flex: 10 }}
                            autoCapitalize="none"
                            editable={editable}
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            placeholder="Endereço de email"
                            onChangeText={(email) => setEmail(email)}
                        />

                        <Image
                            style={{ alignSelf: "center", flex: 1 }}
                            source={require("../../assets/auth/user.png")}
                            resizeMode="contain"
                            resizeMethod="scale"
                            width={30}
                            height={40}
                        />
                    </View>
                    {
                        showError ?
                            (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>O e-mail inserido não é válido</Text>)
                            :
                            null
                    }
                </View>
                <View style={{ marginTop: 40, width: '90%', marginBottom: 20 }}>
                    <Text style={{ color: "grey", fontFamily: "OpenSans_400Regular", fontWeight: "bold", fontSize: 18 }}>Password</Text>
                    <View style={styles.inputField}>
                        <TextInput
                            style={{ fontSize: 16, flex: 10 }}
                            autoCapitalize="none"
                            autoCompleteType="password"
                            textContentType="password"
                            secureTextEntry
                            autoCorrect={false}
                            value={password}
                            placeholder="Password"
                            enablesReturnKeyAutomatically={true}
                            returnKeyType='done'
                            onChangeText={(password) => setPassword(password)}
                            onSubmitEditing={handleSignIn}
                        />
                        <Image
                            style={{ alignSelf: "center", flex: 1 }}
                            source={require("../../assets/auth/password.png")}
                            resizeMode="contain"
                            resizeMethod="scale"
                            width={30}
                            height={40}
                        />
                    </View>
                </View>
                <GoToRecover style={{ alignItems: 'center' }} />
                <SignIn style={{ marginBottom: '10%' }} />

                <GoToSignUp />

                <LoadingIndicator show={loading} full />
            </View>
        </KeyboardAwareView>

    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "space-around",
        height: height * 0.9,
    },
    inputField: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderBottomColor: "grey",
        borderBottomWidth: 1
    },
    submitButton: {
        alignItems: "center",
        width: "80%",
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

export default connect(null, { signInAction })(SignIn);
