import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./SignedInStack/Home";
import Profile from "./SignedInStack/Profile";
import { Ionicons } from "@expo/vector-icons";
import ProfileSettingsPage from "./SignedInStack/ProfileSettingsPage";
import Personal from "./SignedInStack/components/Personal";
import AboutMe from "./SignedInStack/components/AboutMe";
import HostelDetails, { ViewImage } from "./SignedInStack/components/HostelDetails";
import ApartmentsList from "./SignedInStack/components/Apartments";
import AgentProperties from "./SignedInStack/components/AgentProperties";
import Settings from "./SignedInStack/components/Settings";
import Bookings from "./SignedInStack/components/Bookings";
import RequestTour from "./SignedInStack/components/RequestTour";
import Dashboard from "./SignedInStack/Agent/Dashboard";
import TourRequests from "./SignedInStack/Agent/TourRequests";
import Chatscreen from "./SignedInStack/Agent/Chatscreen";
import Chat from "./SignedInStack/Agent/Chat";
import RoomManagement from "./SignedInStack/Agent/RoomManagement";
import More from "./SignedInStack/Agent/More";
import Listings from "./SignedInStack/Agent/Listings";
import HostelUpload from "./SignedInStack/Agent/HostelUpload";
import Guests from "./SignedInStack/Agent/Guests";
import GuestList from "./SignedInStack/Agent/GuestList";
import GuestMessage from "./SignedInStack/Agent/GuestMessage";
import GuestRating from "./SignedInStack/Agent/GuestRating";
import ManageReviews from "./SignedInStack/Agent/ManageReviews";
import GuestProfile from "./SignedInStack/Agent/GuestProfile";
import ProfileApprovalStatus from "./SignedInStack/Agent/ProfileApprovalStatus";
import AgentProfile from "./SignedInStack/Agent/AgentProfile";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import EditHostel from "./SignedInStack/Agent/EditHostel";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function SignedInStack() {
    return (
        <Stack.Navigator initialRouteName='BottomTab'>
            <Stack.Screen name='BottomTab' component={BottomTab} options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePage" component={ProfileSettingsPage} />
            <Stack.Screen name="Personal" component={Personal} />
            <Stack.Screen name="AboutMe" component={AboutMe} />
            <Stack.Screen name="HostelDetails" component={HostelDetails} options={{ headerShown: false }} />
            <Stack.Screen name="ViewImage" component={ViewImage} options={{ headerShown: false }} />
            <Stack.Screen name="Apartments" component={ApartmentsList} options={{ headerShown: false }} />
            <Stack.Screen name="AgentProperties" component={AgentProperties} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="RequestTour" component={RequestTour} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={Chatscreen} options={{ headerShown: false }} />
            <Stack.Screen name="Listings" component={Listings} options={{ headerShown: false }} />
            <Stack.Screen name="EditHostel" component={EditHostel} options={{ headerShown: false }} />
            <Stack.Screen name="HostelUpload" component={HostelUpload} options={{ headerShown: false }} />
            <Stack.Screen name="Guests" component={Guests} options={{ headerShown: false }} />
            <Stack.Screen name="GuestList" component={GuestList} options={{ headerShown: false }} />
            <Stack.Screen name="GuestProfile" component={GuestProfile} options={{ headerShown: false }} />
            <Stack.Screen name="GuestMessage" component={GuestMessage} options={{ headerShown: false }} />
            <Stack.Screen name="GuestRating" component={GuestRating} options={{ headerShown: false }} />
            <Stack.Screen name="ManageReviews" component={ManageReviews} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileApprovalStatus" component={ProfileApprovalStatus} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={AgentProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export function BottomTab() {
    const [user, setUser] = useState('')
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        async function fetchUserType() {
            try {
                const user = auth.currentUser
                const userRef = doc(db, 'users', user.uid)
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()) {
                    setUser(userSnap.data().userType)
                    setInitializing(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserType()
    }, [])

    if (initializing) return <ActivityIndicator size='large' color='#003366' style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />

    function getTabBarIcon(route, focused, color) {
        let iconName;
        if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Account') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Bookings') {
            iconName = focused ? 'book' : 'book-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Tour Request') {
            iconName = focused ? 'list-sharp' : 'list-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
            color = focused ? '#003366' : 'gray';
        }
        return <Ionicons name={iconName} size={24} color={color} />;
    }

    return (
        <Tab.Navigator initialRouteName="Explore" screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => getTabBarIcon(route, focused, color),
            tabBarActiveTintColor: '#003366',
            tabBarInactiveTintColor: 'gray',
        })}>
            {user === 'agent' ? (
                <Tab.Group>
                    <Tab.Screen name='Dashboard' component={Dashboard} options={{ headerShown: false }} />
                    <Tab.Screen name="Tour Request" component={TourRequests} options={{ headerShown: false }} />
                    <Tab.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                    <Tab.Screen name='More' component={More} options={{ headerShown: false }} />
                </Tab.Group>
            ) : (
                <Tab.Group>
                    <Tab.Screen name='Explore' component={Home} options={{ headerShown: false }} />
                    <Tab.Screen name='Bookings' component={Bookings} options={{ headerShown: false }} />
                    <Tab.Screen name='Account' component={Profile} options={{ headerShown: false }} />
                </Tab.Group>
            )}
        </Tab.Navigator>
    );
}
