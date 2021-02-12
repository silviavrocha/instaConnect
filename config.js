
// Fix bug in firebase. Probably remove later
window.addEventListener = (x) => x;

import { decode, encode } from "base-64";
if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}


const firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAh2yugfPwiS_V3HDtN6sJ7HoHCE53Qjqw",
    authDomain: "tab-hackathon.firebaseapp.com",
    projectId: "tab-hackathon",
    storageBucket: "tab-hackathon.appspot.com",
    messagingSenderId: "604669916701",
    appId: "1:604669916701:web:a8e02b6d2481a3718578f4"
};

const app = firebase.initializeApp(firebaseConfig);

module.exports = { auth: app.auth(), db: app.firestore() };
