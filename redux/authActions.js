import { AuthActionTypes } from "./actionTypes";

export const signInAction = (user) => (
    { type: AuthActionTypes.SIGN_IN, user: user }
);

export const signUpAction = (user) => (
    { type: AuthActionTypes.SIGN_UP, user: user }
);

export const signOutAction = () => (
    { type: AuthActionTypes.SIGN_OUT }
);

export const updateUserAction = (email, description, tags, image) => (
    { type: AuthActionTypes.UPDATE_USER, email: email, description: description, tags: tags, image: image }
);
