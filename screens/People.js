import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from "react-native";
import { fetchUsers } from "../api/users";
import { addChat } from "../api/chat";

import SwipeCards from "react-native-swipe-cards-deck";
import { auth, db } from "../config";

const screen = Dimensions.get('screen');

const CARD_BORDER_RADIUS = 15;

const _People = ({ navigation, user }) => {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (user.tags) {
            fetchUsers().then((users) => {
                setUsers(users);
            });
        }
        setLoading(false);

    }, []);

    // Components

    const NoMoreCards = () => {
        return (
            <View style={{ justifyContent: 'center', height: 400 }}>
                <Text style={styles.noMoreCardsText}>No more cards</Text>
            </View>
        );
    }

    const Tag = ({ tag }) => {
        return (
            <View style={{ height: 20, minWidth: 30, marginRight: 10, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#b3442f', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 12, textAlignVertical: 'center', color: 'white' }}>{tag}</Text>
            </View>
        );
    }

    const PersonCard = ({ person }) => {
        return (
            <View style={styles.card}>
                <View style={styles.imageBox}>
                    <Image
                        source={{ uri: person.image }}
                        resizeMode='cover'
                        style={{ height: '100%', borderTopLeftRadius: CARD_BORDER_RADIUS, borderTopRightRadius: CARD_BORDER_RADIUS }}
                    />
                </View>
                <View style={styles.textBox}>
                    <Text style={{ fontFamily: 'OpenSans_700Bold', fontSize: 30 }}>{person.name}</Text>
                    <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 16, marginBottom: 10 }}>Porto, Portugal</Text>
                    <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 14, marginBottom:20 }} numberOfLines={3}>{person.description}</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} fadingEdgeLength={10}>
                        {person.tags.map((t) => <Tag key={t} tag={t} />)}
                    </ScrollView>
                </View>
            </View>
        );
    };

    const handleYup = async (card) => {
        let chatId = await addChat({
            lastMessage: null,
            users: [
                db.collection("users").doc(auth.currentUser.uid),
                db.collection("users").doc(card.id)
            ]
        });

        navigation.navigate("Chat", {
            screen: "Chat", params: {
                id: chatId, name: card.name
            }
        });

        return true;
    }

    const handleNope = (card) => {
        return true;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'OpenSans_700Bold', fontSize: 24, color: '#8c0808', paddingLeft: screen.width * 0.05, marginVertical: 10 }}>
                Relacionados consigo
            </Text>
            <SwipeCards
                cards={users}
                renderCard={(cardData) => <PersonCard person={cardData} />}
                keyExtractor={(cardData) => String(cardData.id)}
                renderNoMoreCards={() => <NoMoreCards />}
                handleYup={handleYup}
                handleNope={handleNope}
            />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 15,
    },

    noMoreCardsText: {
        fontFamily: "OpenSans_700Bold",
        fontSize: 24,
        color: 'black'
    },

    card: {
        height: 570,
        width: screen.width * 0.9,
        backgroundColor: 'white',
        borderRadius: CARD_BORDER_RADIUS,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },

    imageBox: {
        flex: 2,
    },

    textBox: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});

const mapStateToProps = (state) => ({
    user: state.user
});

export const People = connect(mapStateToProps, {})(_People);
