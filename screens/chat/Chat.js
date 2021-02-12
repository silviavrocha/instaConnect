import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import { GiftedChat, Send, Bubble, LoadEarlier } from "react-native-gifted-chat";
import { fetchMessages, sendMessage } from "../../api/chat";
import { loadMessagesAction, updateChatAction } from "../../redux/chatActions";
import { auth, db } from "../../config";

// Components
import LoadingIndicator from "../../components/LoadingIndicator";

const Chat = ({ chat, id, messages, updateChatAction, loadMessagesAction }) => {

    const [chatMessages, setChatMessages] = useState(messages);
    const [showLoadEarlier, setShowLoadEarlier] = useState(messages.length === 10);
    const [loadingEarlier, setLoadingEarlier] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        setLoadingEarlier(true);
        setLoading(true);


        // Subscribe to changes
        let unsubscribe = db.collection("messages")
            .where("chatId", "==", id)
            .onSnapshot(async (snapshot) => {
                const fetchedMessages = await Promise.all(snapshot.docChanges()
                    .filter((change) => {
                        return change.type === "added" && !change.doc.metadata.hasPendingWrites;
                    })
                    .map(async (change) => {
                        let message = { id: change.doc.id, ...change.doc.data() };

                        // Convert timestamp attribute to Date object
                        message = { ...message, timestamp: message.timestamp.toDate() };

                        // Get sender
                        let senderRef = await message.sender.get();
                        message.sender = { id: senderRef.id, ...senderRef.data() };

                        return message;
                    })
                    .sort((m1, m2) => m2.timestamp - m1.timestamp));

                if (isMounted) {
                    loadMessagesAction(fetchedMessages);
                    updateChatAction(id, fetchedMessages[fetchedMessages.length - 1]);
                }

                // Convert to their format and ignore repeated messages
                let newMessages = fetchedMessages
                    .filter((message) => {
                        return !chatMessages.some((m) => m._id === message.id)
                    })
                    .map((message) => {
                        return {
                            _id: message.id,
                            text: message.content,
                            createdAt: message.timestamp,
                            user: {
                                _id: message.sender.id,
                                name: message.sender.name
                            }
                        };
                    });
                
                if (isMounted) {
                    setChatMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
                    setLoadingEarlier(false);
                    setShowLoadEarlier(newMessages.length === 10);
                    setLoading(false);
                }
            });

            return () => {
                unsubscribe(),
                isMounted = false
            }
    }, []);

    const onSend = async (newMessages = []) => {
        // Get messageId and add to chat
        const sentMessages = await Promise.all(newMessages.map(async (message) => {
            const messageId = await sendMessage({
                chatId: id,
                content: message.text,
                sender: db.collection("users").doc(auth.currentUser.uid),
                timestamp: message.createdAt
            });
            
            return {
                ...message,
                _id: messageId,
            };
        }));

        setChatMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages));

        // Convert to our format
        const messages = sentMessages.map((message) => {
            return {
                id: message._id,
                chatId: id,
                content: message.text,
                sender: {
                    id: message.user._id,
                    name: message.user.name
                },
                timestamp: message.createdAt
            };
        });

        loadMessagesAction(messages);
        updateChatAction(id, messages[messages.length - 1]);
    };

    const onLoadEarlier = () => {
        setLoadingEarlier(true);
        setLoading(true);

        let lastMessage = chatMessages[chatMessages.length - 1];

        fetchMessages(id, lastMessage.createdAt)
            .then((fetchedMessages) => {
                loadMessagesAction(fetchedMessages);

                // Convert to their format and ignore repeated messages
                let newMessages = fetchedMessages
                    .filter((message) => {
                        return chatMessages.filter((e) => e._id === message.id).length === 0;
                    })
                    .map((message) => {
                        return {
                            _id: message.id,
                            text: message.content,
                            createdAt: message.timestamp,
                            user: {
                                _id: message.sender.id,
                                name: message.sender.name
                            }
                        };
                    });

                setChatMessages(previousMessages => GiftedChat.prepend(previousMessages, newMessages));
                
                setLoadingEarlier(false);
                setShowLoadEarlier(newMessages.length === 10);
                setLoading(false);
            });
    }

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={chatMessages}
                onSend={(messages) => onSend(messages)}

                placeholder="Mensagem"
                alwaysShowSend
                isAnimated
                locale="pt"

                infiniteScroll
                loadEarlier={showLoadEarlier}
                isLoadingEarlier={loadingEarlier}
                onLoadEarlier={() => onLoadEarlier()}

                user={{
                    _id: auth.currentUser.uid,
                    name: auth.currentUser.displayName
                }}

                renderLoading={() => <ActivityIndicator size="large" color="#8c0808" />}
                renderSend={(props) => <Send {...props} textStyle={{ fontFamily: "OpenSans_400Regular", color:'#b3442f' }} label="Enviar" />}
                renderLoadEarlier={(props) => <LoadEarlier {...props} textStyle={{ fontFamily: "OpenSans_400Regular" }} label="Carregar mais mensagens" />}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        timeTextStyle={{
                            right: {
                                fontFamily: "OpenSans_400Regular",
                                color: "white"
                            },
                            left: {
                                fontFamily: "OpenSans_400Regular",
                                color: "white"
                            }
                        }}
                        textStyle={{
                            left: {
                                fontFamily: "OpenSans_400Regular",
                                color: "white"
                            },
                            right: {
                                fontFamily: "OpenSans_400Regular",
                                color: "white"
                            }
                        }}
                        wrapperStyle={{
                            left: {
                                backgroundColor: "#a5a5a5"
                            },
                            right: {
                                backgroundColor: "#b3442f"
                            }
                        }}
                    />
                )}
            />
            
            <LoadingIndicator show={loading} />
        </View>
    );
};

const mapStateToProps = (state, { route }) => {

    // Convert to their format
    const messages = Object.values(state.messages)
        .filter((message) => {
            return message.chatId === route.params.id;
        })
        .map((message) => {
            return {
                _id: message.id,
                text: message.content,
                createdAt: message.timestamp,
                user: {
                    _id: message.sender.id,
                    name: message.sender.name
                }
            };
        })
        .sort((m1, m2) => m2.createdAt - m1.createdAt);

    return {
        chat: route.params.chat,
        id: route.params.id,
        messages: messages
    };
};

export default connect(mapStateToProps, { updateChatAction, loadMessagesAction })(Chat);
