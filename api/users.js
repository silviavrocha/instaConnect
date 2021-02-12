import { auth, db } from "../config";

export const fetchUsers = async () => {
    if (!auth.currentUser) console.error("Not authenticated");

    const users = [];
    let documents = null;

    try {
        documents = await db.collection("users").get();
    } catch (error) {
        console.error(error);
    }

    documents.forEach((doc) => {
        if(doc.data().email != auth.currentUser.email)
            users.push({id: doc.id,  ...doc.data() });
    });

    return users;
};

export const fetchUsersByTag = async (tag) => {
    if (!auth.currentUser) console.error("Not authenticated");

    const users = [];
    let documents = null;

    try {
        documents = await db.collection("users").where("tags", "array-contains", tag).get();
    } catch (error) {
        console.error(error);
    }

    documents.forEach((doc) => {
        if(doc.data().email != auth.currentUser.email)
            users.push({id: doc.id,  ...doc.data() });
    });


    return users;
};



