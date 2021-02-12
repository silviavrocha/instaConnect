import { auth, db } from "../config";

const firebase = require("firebase/app");

export const fetchChats = async () => {
    if (!auth.currentUser) console.error("Not authenticated");

    const chats = [];
    let documents = null;

    try {
        documents = await db.collection("chats")
            .where("users", "array-contains", db.collection("users").doc(auth.currentUser.uid))
            .get();
        
        console.log(documents)

        documents.forEach((doc) => {
            chats.push({ id: doc.id, ...doc.data() });
        });

    } catch (error) {
        console.error(error);
    }



    console.log(chats)

    // Get contact and last message
    for (let i = 0; i < chats.length; i++) {
        const contactRef = await chats[i].users.find((user) => user.email !== auth.currentUser.email).get();
        chats[i].contact = { id: contactRef.id, ...contactRef.data() };

        delete chats[i].users;

        if (chats[i].lastMessage) {
            const lastMessageRef = await chats[i].lastMessage.get();
            const lastMessage = { id: lastMessageRef.id, ...lastMessageRef.data(), timestamp: lastMessageRef.data().timestamp.toDate() };

            const senderRef = await lastMessage.sender.get();
            lastMessage.sender = { id: senderRef.id, ...senderRef.data() };

            chats[i].lastMessage = lastMessage;
        }
    }

    return chats;
};

export const addChat = async (chat) => {
    if (!auth.currentUser) console.error("Not authenticated");

    let document = null;

    try {
        document = await db.collection("chats").add(chat);
    } catch (error) {
        console.error(error);
    }

    return document.id;
};

export const fetchMessages = async (chatId, date) => {
    if (!auth.currentUser) console.error("Not authenticated");

    const messages = [];
    let documents = null;

    try {
        documents = await db.collection("messages")
            .where("chatId", "==", chatId)
            .startAfter(firebase.firestore.Timestamp.fromDate(date))
            .get();
    } catch (error) {
        console.error(error);
    }

    documents.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
    });

    // Convert timestamp attribute to Date object
    messages.forEach((message, index) => {
        message = { ...message, timestamp: message.timestamp.toDate() };
        messages[index] = message;
    });

    // Get sender
    for (let i = 0; i < messages.length; i++) {
        const senderRef = await messages[i].sender.get();
        messages[i].sender = { id: senderRef.id, ...senderRef.data() };
    }

    return messages;
};

export const sendMessage = async (message) => {
    if (!auth.currentUser) console.error("Not authenticated");

    let document = null;

    try {
        document = await db.collection("messages").add(message);
    } catch (error) {
        console.error(error);
    }

    try {
        console.log(message)
        await db.collection("chats").doc(message.chatId).update({ lastMessage: document });
    } catch (error) {
        console.error(error);
    }

    return document.id;
};
