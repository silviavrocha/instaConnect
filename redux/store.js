import { createStore, combineReducers } from "redux";
import { AuthActionTypes, ChatActionTypes } from "./actionTypes";

const authReducer = (state = { uid: null }, action) => {
    switch (action.type) {
        case AuthActionTypes.SIGN_IN:
            return { uid: action.user.uid, name: action.user.name, email: action.user.email, description: action.user.description, tags: action.user.tags, image: action.user.image };
        case AuthActionTypes.SIGN_UP:
            return { uid: action.user.uid, name: action.user.name, email: action.user.email, description: action.user.description, tags: action.user.tags, image: action.user.image};
        case AuthActionTypes.SIGN_OUT:
            return { uid: null };
        case AuthActionTypes.UPDATE_USER:
            return { ...state, email: action.email, description: action.user.description, tags: action.user.tags, image: action.user.image };
        default:
            return state;
    }
};


const chatReducer = (state = {}, action) => {
    switch (action.type) {
        case AuthActionTypes.SIGN_OUT:
            return {};
        case ChatActionTypes.LOAD_CHATS:
            return { ...state, ...action.chats };
        case ChatActionTypes.UPDATE_CHAT:
            return {
                ...state,
                [action.chatId]: {
                    ...state[action.chatId],
                    lastMessage: action.message,
                },
            };
        default:
            return state;
    }
};

const messageReducer = (state = {}, action) => {
    switch (action.type) {
        case AuthActionTypes.SIGN_OUT:
            return {};
        case ChatActionTypes.LOAD_MESSAGES:
            return { ...state, ...action.messages };
        default:
            return state;
    }
};

const reducers = combineReducers({
    user: authReducer,
    chats: chatReducer,
    messages: messageReducer,
});

const store = createStore(reducers);

module.exports = { store: store };
