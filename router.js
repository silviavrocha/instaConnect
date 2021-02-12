import React from "react";
import { View, Image, StatusBar, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Logged in

// # People
import { People } from "./screens/People";


// # Chat
import { ChooseChat } from "./screens/chat/ChooseChat";
import AddContact from "./screens/chat/AddContact";
import Chat from "./screens/chat/Chat";

// # Info
import Info from "./screens/Info";

// # Profile
import Profile from "./screens/Profile";
// ----

// Logged out
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import Recover from "./screens/auth/Recover";
// ----

import IconBadge from "./components/IconBadge";
import { getStatusBarHeight } from "react-native-status-bar-height";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight;

const PeopleStack = createStackNavigator();

const PeopleStackScreen = () => (
    <PeopleStack.Navigator
        initialRouteName="Index"
        headerMode="screen"
        screenOptions={{
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStatusBarHeight: STATUSBAR_HEIGHT,
            headerStyle: {
                // backgroundColor: "#2084ef",
            },
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 27,
                fontFamily: "OpenSans_700Bold",
                color: "black"
            },
        }}
    >
        <PeopleStack.Screen
            name="Index"
            component={People}
            options={{
                title: "Explorar",
            }}
        />
    </PeopleStack.Navigator>
);

const ChatStack = createStackNavigator();

const ChatStackScreen = () => (
    <ChatStack.Navigator
        initialRouteName="Index"
        headerMode="screen"
        screenOptions={{
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStatusBarHeight: STATUSBAR_HEIGHT,
            headerStyle: {
                // backgroundColor: "#2084ef",
            },
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 27,
                fontFamily: "OpenSans_700Bold",
                color: "black"
            },
        }}
    >
        <ChatStack.Screen
            name="Index"
            component={ChooseChat}
            options={{
                title: "Conversas",
                // headerRight: (props) => (<ChooseChatHeaderRight {...props} />),
            }}
        />
        <ChatStack.Screen
            name="Chat"
            component={Chat}
            options={
                ({ route, navigation }) => ({
                    title: route.params.name,
                    headerLeft: (navigation) =>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={(navigation) => navigation.goBack()}>
                            <Ionicons name={'chevron-back-outline'} size={30} color="#8c0808" />
                        </TouchableOpacity>
                })
            }
        />
    </ChatStack.Navigator>
);

const InfoStack = createStackNavigator();

const InfoStackScreen = () => (
    <InfoStack.Navigator
        initialRouteName="Info"
        headerMode="screen"
        screenOptions={{
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStatusBarHeight: STATUSBAR_HEIGHT,
            headerStyle: {
                // backgroundColor: "#2084ef",
            },
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 27,
                fontFamily: "OpenSans_700Bold",
                color: "black"
            },
        }}
    >
        <InfoStack.Screen
            name="Info"
            component={Info}
            options={{
                title: "Sobre Nós",
            }}
        />
    </InfoStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        initialRouteName="Profile"
        headerMode="screen"
        screenOptions={{
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStatusBarHeight: STATUSBAR_HEIGHT,
            headerStyle: {
            },
            headerTitleStyle: {
                fontSize: 27,
                fontFamily: "OpenSans_700Bold",
                color: "black"
            },
        }}
    >
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{
                title: "Perfil",
            }}
        />
    </ProfileStack.Navigator>
);

const LoggedInTab = createBottomTabNavigator();

const LoggedIn = () => (
    <LoggedInTab.Navigator
        initialRouteName="People"
        backBehavior="none"
        tabBarOptions={{
            showLabel: false,
            keyboardHidesTabBar: true,
            activeTintColor: "white",
            inactiveTintColor: "white",
            activeBackgroundColor: "white",
            inactiveBackgroundColor: "white",
            style: {
                // height: 60
            },
        }}
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {

                const icons = {
                    People: 'people',
                    Chat: 'chatbubbles',
                    Profile: 'person-circle',
                    Information: 'information-circle',
                };

                return (
                    <IconBadge focused={focused}>
                        <View style={{ flex: 1 }}>
                            <Ionicons name={icons[route.name] + (focused ? '' : '-outline')} size={30} color="#8c0808" />
                        </View>
                    </IconBadge>
                );
            },
        })}
    >
        <LoggedInTab.Screen
            name="People"
            component={PeopleStackScreen}
            options={{
                title: "Explorar",
            }}
        />
        <LoggedInTab.Screen
            name="Chat"
            component={ChatStackScreen}
            options={{
                title: "Conversas",
            }}
        />
        <LoggedInTab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
                title: "Perfil",
            }}
        />
        <LoggedInTab.Screen
            name="Information"
            component={InfoStackScreen}
            options={{
                title: "Informações",
            }}
        />
    </LoggedInTab.Navigator>
);

const LoggedOutTab = createBottomTabNavigator();

const LoggedOut = () => (
    <LoggedOutTab.Navigator
        initialRouteName="SignIn"
        backBehavior="none"
        tabBarOptions={{
            keyboardHidesTabBar: true,
        }}
    >
        <LoggedOutTab.Screen
            name="SignIn"
            component={SignIn}
            options={{
                tabBarVisible: false,
            }}
        />
        <LoggedOutTab.Screen
            name="SignUp"
            component={SignUp}
            options={{
                tabBarVisible: false,
            }}
        />
        <LoggedOutTab.Screen
            name="Recover"
            component={Recover}
            options={{
                tabBarVisible: false,
            }}
        />
    </LoggedOutTab.Navigator>
);

module.exports = { LoggedIn: LoggedIn, LoggedOut: LoggedOut };
