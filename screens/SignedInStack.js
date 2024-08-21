import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./SignedInStack/Renter/Home";
import Profile from "./SignedInStack/Renter/Profile";
import { Ionicons } from "@expo/vector-icons";
import ProfileSettingsPage from "./SignedInStack/Renter/components/ProfileSettingsPage";
import Personal from "./SignedInStack/Renter/components/Personal";
import AboutMe from "./SignedInStack/Renter/components/AboutMe";
import HostelDetails, { ViewImage } from "./SignedInStack/Renter/components/HostelDetails";
import ApartmentsList from "./SignedInStack/Renter/components/Apartments";
import AgentProperties from "./SignedInStack/Renter/components/AgentProperties";
import Settings from "./SignedInStack/Renter/components/Settings";
import Bookings from "./SignedInStack/Renter/Bookings";
import RequestTour from "./SignedInStack/Renter/components/RequestTour";
import Dashboard from "./SignedInStack/Agent/Dashboard";
import TourRequests from "./SignedInStack/Agent/TourRequests";
import TourRequestDetails from "./SignedInStack/Renter/components/TourRequestDetails";
import ApprovedRequestDetails from "./SignedInStack/Agent/components/ApprovedRequestDetails";
import Chatscreen from "./SignedInStack/Agent/components/Chatscreen";
import Chat from "./SignedInStack/Agent/Chat";
import RoomManagement from "./SignedInStack/Agent/components/RoomManagement";
import More from "./SignedInStack/Agent/More";
import Listings from "./SignedInStack/Agent/components/Listings";
import HostelUpload from "./SignedInStack/Agent/components/HostelUpload";
import Guests from "./SignedInStack/Agent/components/Guests";
import GuestList from "./SignedInStack/Agent/components/GuestList";
import GuestMessage from "./SignedInStack/Agent/components/GuestMessage";
import GuestRating from "./SignedInStack/Agent/components/GuestRating";
import ManageReviews from "./SignedInStack/Agent/components/ManageReviews";
import GuestProfile from "./SignedInStack/Agent/components/GuestProfile";
import ProfileApprovalStatus from "./SignedInStack/Agent/components/ProfileApprovalStatus";
import AgentProfile from "./SignedInStack/Agent/AgentProfile";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import EditHostel from "./SignedInStack/Agent/components/EditHostel";
import Notifications from "./SignedInStack/Renter/components/Notifications";
import ClientChatScreen from "./SignedInStack/Renter/ClientChatScreen";
import BookingConfirmation from "./SignedInStack/Renter/components/BookingConfirmation";
import BookingDetails from "./SignedInStack/Renter/components/BookingDetails";
import FilterScreen from "./SignedInStack/Renter/components/FilterScreen";
import RateApp from "./SignedInStack/Renter/components/RateApp";
import Terms from "./SignedInStack/Renter/components/Terms";
import HelpCenter from "./SignedInStack/Renter/components/HelpCenter";
import CustomerService from "./SignedInStack/Renter/components/CustomerService";
import AgentProfileView from "./SignedInStack/Agent/components/AgentProfileView";
import ActiveHostel from "./SignedInStack/Agent/components/ActiveHostel";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function SignedInStack() {
    return (
        <Stack.Navigator initialRouteName='BottomTab'>
            <Stack.Screen name='BottomTab' component={BottomTab} options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePage" component={ProfileSettingsPage} />
            <Stack.Screen name="Personal" component={Personal}  options={{ headerShown: false }} />
            <Stack.Screen name="AboutMe" component={AboutMe} />
            <Stack.Screen name="HostelDetails" component={HostelDetails} options={{ headerShown: false }} />
            <Stack.Screen name="ViewImage" component={ViewImage} options={{ headerShown: false }} />
            <Stack.Screen name="Apartments" component={ApartmentsList} options={{ headerShown: false }} />
            <Stack.Screen name="AgentProperties" component={AgentProperties} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="RequestTour" component={RequestTour} options={{ headerShown: false }} />
            <Stack.Screen name="TourRequestDetails" component={TourRequestDetails} options={{ headerShown: false }} />
            <Stack.Screen name="ApprovedRequestDetails" component={ApprovedRequestDetails} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={Chatscreen} options={{ headerShown: false }} />
            <Stack.Screen name="Listings" component={Listings} options={{ headerShown: false }} />
            <Stack.Screen name="EditHostel" component={EditHostel} options={{ headerShown: false }} />
            <Stack.Screen name="HostelUpload" component={HostelUpload} options={{ headerShown: false }} />
            <Stack.Screen name="Guests" component={Guests} options={{ headerShown: false }} />
            <Stack.Screen name="GuestList" component={GuestList} options={{ headerShown: false }} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} options={{ headerShown: false }} />
            <Stack.Screen name="BookingDetails" component={BookingDetails} options={{ headerShown: false }} />
            <Stack.Screen name="GuestProfile" component={GuestProfile} options={{ headerShown: false }} />
            <Stack.Screen name="GuestMessage" component={GuestMessage} options={{ headerShown: false }} />
            <Stack.Screen name="GuestRating" component={GuestRating} options={{ headerShown: false }} />
            <Stack.Screen name="ManageReviews" component={ManageReviews} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileApprovalStatus" component={ProfileApprovalStatus} options={{ headerShown: false }} />
            <Stack.Screen name="RateApp" component={RateApp} options={{ headerShown: false }} />
            <Stack.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
            <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerService" component={CustomerService} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ActiveHostel" component={ActiveHostel} options={{ headerShown: false }} />
            <Stack.Screen name="AgentView" component={AgentProfileView} options={{ headerShown: false }} />
            <Stack.Screen name="RoomManagement" component={RoomManagement} options={{ headerShown: false }} />
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
            iconName = focused ? 'calendar' : 'book-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Management') {
            iconName = focused ? 'business' : 'business-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
            color = focused ? '#003366' : 'gray';
        } else if (route.name === 'My Property') {
            iconName = focused ? 'home' : 'home-outline';
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
                    <Tab.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                    <Tab.Screen name="My Property" component={Listings} options={{ headerShown: false }} />
                    <Tab.Screen name="Management" component={TourRequests} options={{ headerShown: false }} />
                    <Tab.Screen name='Account' component={More} options={{ headerShown: false }} />
                </Tab.Group>
            ) : (
                <Tab.Group>
                    <Tab.Screen name='Explore' component={Home} options={{ headerShown: false }} />
                    <Tab.Screen name='Bookings' component={Bookings} options={{ headerShown: false }} />
                    <Tab.Screen name='Chat' component={ClientChatScreen} options={{ headerShown: false }} />
                    <Tab.Screen name='Account' component={Profile} options={{ headerShown: false }} />
                </Tab.Group>
            )}
        </Tab.Navigator>
    );
}
