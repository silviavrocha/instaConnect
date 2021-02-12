import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { signOutAction, updateUserAction } from "../redux/authActions";
import { auth, db } from "../config";

// Components
import LoadingIndicator from "../components/LoadingIndicator";
import KeyboardAwareView from "../components/KeyboardAwareView";

import Tags from "react-native-tags";

const firebase = require("firebase/app");

const Profile = ({ user, signOutAction, updateUserAction }) => {

    const [newEmail, setNewEmail] = useState(user.email);
    const [newDescription, setDescription] = useState(user.description ? user.description : '');
    const [newTags, setTags] = useState(user.tags ? user.tags : []);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const array = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.exec(newEmail);
        setShowEmailError(newEmail !== "" && array === null);
        setShowPasswordError(newPassword !== confirmNewPassword);

    }, [newEmail, newPassword, confirmNewPassword, image]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSignOut = async () => {
        setLoading(true);

        try {
            const uid = auth.currentUser.uid;
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }

        setLoading(false);

        signOutAction();
    };

    const handleSaveChanges = async () => {
        setLoading(true);

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
            await auth.currentUser.reauthenticateWithCredential(credential);

            if (user.email !== newEmail) {
                await auth.currentUser.updateEmail(newEmail);
            }

            await db.collection("users").doc(auth.currentUser.uid).update({ email: newEmail });
            await db.collection("users").doc(auth.currentUser.uid).update({ description: newDescription });
            await db.collection("users").doc(auth.currentUser.uid).update({ tags: newTags });

            updateUserAction(newEmail, newDescription, newTags);

            if (newPassword !== "" && newPassword === confirmNewPassword)
                await auth.currentUser.updatePassword(newPassword);

        } catch (error) {
            console.log(error);
        }

        setNewEmail(user.email);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowEmailError(false);
        setShowPasswordError(false);
        setEditMode(false);
        setLoading(false);
    };

    const handleCancelChanges = () => {
        setNewEmail(user.email);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowEmailError(false);
        setShowPasswordError(false);
        setEditMode(false);
    };

    // Components
    const EditProfile = () => (
        <View style={{ height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
        </View>
    );

    const SignOut = () => (
        <View style={{ height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={[styles.buttonText, { color: 'red' }]}>Sair</Text>
            </TouchableOpacity>
        </View>
    );

    const SaveChanges = () => (
        <View style={{ height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={oldPassword === ""}>
                <Text style={[styles.buttonText, { color: '#2084ef' }]}>Guardar dados</Text>
            </TouchableOpacity>
        </View>
    );

    const CancelChanges = () => (
        <View style={{ height: 60, justifyContent: "center", alignSelf: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleCancelChanges}>
                <Text style={[styles.buttonText, { color: '#808080' }]}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );

    const Tag = ({ tag }) => {
        return (
            <View style={{ height: 20, minWidth: 30, maxWidth: 100, marginBottom: 5, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#b3442f', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' }}>
                <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 12, textAlignVertical: 'center', color: 'white' }}>{tag}</Text>
            </View>
        );
    }

    return (
        <KeyboardAwareView>
            <View style={styles.container}>
                <Text style={{ fontFamily: "OpenSans_700Bold", fontSize: 26, color: '#8c0808', textAlign: 'center' }}>
                    {user.name ? user.name : "John Doe"}
                </Text>

                {editMode ?
                    (
                        <View >
                            <View style={{ marginTop: 40 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontSize: 18 }}>Email:</Text>
                                <View style={styles.inputField}>
                                    <TextInput
                                        style={{ fontSize: 16, flex: 10 }}
                                        placeholder="Email"
                                        autoCapitalize="none"
                                        autoCompleteType="email"
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        value={newEmail}
                                        onChangeText={(email) => setNewEmail(email)}
                                    />
                                </View>
                            </View>
                            {
                                showEmailError ?
                                    (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>O e-mail inserido não é válido</Text>)
                                    :
                                    null
                            }

                            <View style={{ marginTop: 25 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontWeight: "bold", fontSize: 18 }}>Descrição:</Text>
                                <View style={styles.inputField}>
                                    <TextInput
                                        style={{ fontSize: 16, flex: 10, height: 16 * 5, textAlignVertical: 'top' }}
                                        placeholder="Descrição"
                                        enablesReturnKeyAutomatically={true}
                                        autoCapitalize="none"
                                        value={newDescription}
                                        multiline
                                        numberOfLines={5}
                                        onChangeText={(description) => setDescription(description)}
                                    />
                                </View>
                            </View>


                            <View style={{ marginTop: 25 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontWeight: "bold", fontSize: 18 }}>Tags:</Text>
                                <View>
                                    <Tags
                                        textInputProps={{
                                            placeholder: "Ex.: futebol, cinema, música, teatro, etc"
                                        }}
                                        initialTags={newTags}
                                        onChangeTags={tags => setTags(tags)}
                                        onTagPress={(index, tagLabel, event, deleted) =>
                                            console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                                        }
                                        containerStyle={{ justifyContent: "center" }}
                                        inputStyle={{}}
                                        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                                            <TouchableOpacity key={`${tag}-${index}`} onPress={onPress} style={{ marginHorizontal: 5 }}>
                                                <Text>{tag}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 25 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontWeight: "bold", fontSize: 18 }}>Password atual:</Text>
                                <View style={styles.inputField}>
                                    <TextInput
                                        style={{ fontSize: 16, flex: 10 }}
                                        placeholder="Password atual"
                                        autoCapitalize="none"
                                        autoCompleteType="password"
                                        textContentType="password"
                                        secureTextEntry
                                        value={oldPassword}
                                        onChangeText={(password) => setOldPassword(password)}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 25 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontWeight: "bold", fontSize: 18 }}>Nova password:</Text>
                                <View style={styles.inputField}>
                                    <TextInput
                                        style={{ fontSize: 16, flex: 10 }}
                                        placeholder="Nova password"
                                        autoCapitalize="none"
                                        autoCompleteType="password"
                                        textContentType="password"
                                        secureTextEntry
                                        value={newPassword}
                                        onChangeText={(newPassword) => setNewPassword(newPassword)}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 25, marginBottom: 50 }}>
                                <Text style={{ color: "grey", fontFamily: "OpenSans_700Bold", fontWeight: "bold", fontSize: 18 }}>Confirmar password:</Text>
                                <View style={styles.inputField}>
                                    <TextInput
                                        style={{ fontSize: 16, flex: 10 }}
                                        placeholder="Confirmação da password"
                                        autoCapitalize="none"
                                        autoCompleteType="password"
                                        textContentType="password"
                                        secureTextEntry
                                        value={confirmNewPassword}
                                        onChangeText={(newPassword) => setConfirmNewPassword(newPassword)}
                                    />
                                </View>
                                {
                                    showPasswordError ?
                                        (<Text style={{ marginTop: 10, color: "red", fontSize: 13 }}>As passwords não coincidem</Text>)
                                        :
                                        null
                                }
                            </View>

                            <SaveChanges />
                            <CancelChanges />
                        </View>
                    )
                    :
                    (
                        <>
                            <Text style={styles.subtitle}>
                                Photo
                            </Text>
                            <Image
                                source={{ uri: user.image }}
                                resizeMode='cover'
                                style={{ height: 250, width: 200 }}
                            />
                            <Text style={styles.subtitle}>
                                E-mail:
                            </Text>
                            <Text style={styles.text}>
                                {newEmail}
                            </Text>

                            <Text style={styles.subtitle}>
                                Sobre Mim
                            </Text>
                            <Text style={styles.text}>
                                {newDescription}
                            </Text>

                            <Text style={styles.subtitle}>
                                Interesses
                            </Text>
                                {(newTags).map((t) => {
                                    return <Tag key={t} tag={t} />
                                })}
                            <EditProfile />
                            <SignOut />
                        </>
                    )

                }

                <LoadingIndicator show={loading} />
            </View>
        </KeyboardAwareView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 15,
    },
    inputField: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        // height: 40
    },

    subtitle: {
        fontFamily: "OpenSans_700Bold",
        fontSize: 24,
        fontWeight: "bold",
        color: 'black'
    },

    text: {
        paddingLeft: 10,
        fontFamily: "OpenSans_400Regular",
        fontSize: 16,
        fontWeight: "normal",
        textAlignVertical: "center",
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

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, { signOutAction, updateUserAction })(Profile);
