import { ChatActionTypes } from "./actionTypes";

export const loadChatsAction = (chats) => {
    const chatsDict = {};
    for (const chat of chats) {
        chatsDict[chat.id] = chat;
    }

    return { type: ChatActionTypes.LOAD_CHATS, chats: chatsDict };
};

export const updateChatAction = (chatId, lastMessage) => (
    { type: ChatActionTypes.UPDATE_CHAT, chatId: chatId, message: lastMessage }
);

export const loadMessagesAction = (messages) => {
    const messagesDict = {};
    for (const message of messages) {
        messagesDict[message.id] = message;
    }

    return { type: ChatActionTypes.LOAD_MESSAGES, messages: messagesDict };
};
