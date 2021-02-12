import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, View, Image, Text, TouchableOpacity } from "react-native";
import { fetchChats } from "../../api/chat";
import { loadChatsAction } from "../../redux/chatActions";

// Components
import LoadingIndicator from "../../components/LoadingIndicator";
import ImageButton from "../../components/ImageButton";
import { roundToNearestPixel } from "react-native/Libraries/Utilities/PixelRatio";

const dayjs = require("dayjs");

export const ChooseChatHeaderRight = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("AddContact");
    };

    return (
        <View style={{ marginRight: 10 }}>
        </View>
    );
};

const _ChooseChat = ({ navigation, chats, loadChatsAction }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
     
        setLoading(true);

        fetchChats()
            .then((chats) => {
                loadChatsAction(chats);
                setLoading(false);
            })
            .catch((err) =>
            console.log(err));
    }, []);

    // Components

    const ChatEntry = ({ chat }) => {
        let date = "";

        if (chat.lastMessage) {
            const lastMessageDate = dayjs(chat.lastMessage.timestamp);

            if (lastMessageDate.isSame(dayjs(), "day"))
                date = lastMessageDate.format("HH:mm");
            else if (lastMessageDate.isSame(dayjs().subtract(1, "day"), "day"))
                date = "Ontem";
            else if (lastMessageDate.isSame(dayjs(), "year"))
                date = lastMessageDate.format("DD/MM");
            else
                date = lastMessageDate.format("DD/MM/YYYY");
        }

        const handlePress = () => {
           navigation.navigate("Chat", { chat: chat, name: chat.contact.name, id:chat.id});
        };

        return (
            <View>

            <View style={{
                borderWidth: 0.5,
                borderColor: '#ddd',
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 1,
                elevation: 2,
            }} />
                <TouchableOpacity onPress={handlePress}>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <View style={{ marginLeft: 15, flexShrink: 1 }}>
                            <Text style={{ flex: 1, fontWeight: "bold", fontSize: 22, textAlign: "left" }}>{chat.contact.name}</Text>
                            {chat.lastMessage ?
                                <Text style={{ fontWeight: "bold", fontSize: 18, color: "grey", paddingTop: 10 }} numberOfLines={2}>{chat.lastMessage.content}</Text>
                                :
                                null
                            }
                        </View>
                        <Text style={{ position: "absolute", right: 0, fontWeight: "bold", fontSize: 18, color: "grey", marginRight: 15 }}>{date}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {chats.map((chat, i) => <ChatEntry key={i} chat={chat} />)}
            </ScrollView>

            <LoadingIndicator show={loading} />
        </View>
    );
};

const mapStateToProps = (state, { route }) => {
    console.log(route.params)
    let chats;
    if(state.chats) {
        chats = Object.values(state.chats).sort((c1, c2) => {
            if (!c1.lastMessage && !c2.lastMessage)
                return 0;
            else if (!c1.lastMessage)
                return 1;
            else if (!c2.lastMessage)
                return -1;
            else
                return c2.lastMessage.timestamp - c1.lastMessage.timestamp;
        });
    }
    else { chats = null;}

    return {
        chats: chats,
    }
};

export const ChooseChat = connect(mapStateToProps, { loadChatsAction })(_ChooseChat);

