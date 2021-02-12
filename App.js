import React from "react";
import { connect, Provider } from "react-redux";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { store } from "./redux/store";
import { LoggedIn, LoggedOut } from "./router";

import { useFonts, OpenSans_400Regular, OpenSans_700Bold, } from '@expo-google-fonts/open-sans';
import { LogBox } from 'react-native';

// Ignore log notification by message:
LogBox.ignoreAllLogs();

const dayjs = require("dayjs");
require("dayjs/locale/pt");
const localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);
dayjs.locale("pt");

import _ from "lodash";

const App = ({ user }) => {

    const [loaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_700Bold,
    });

    if (!loaded)
        return null;

    return (
        <NavigationContainer>
            {user.uid ?
                (<LoggedIn />) : (<LoggedOut />)
            }
        </NavigationContainer>
    );
};

const RootNavigation = connect((state) => ({ user: state.user }))(App);

const Root = () => (
    <Provider store={store}>
        {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
        <RootNavigation />
    </Provider>
);

export default Root;
