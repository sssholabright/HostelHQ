import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../../firebase';
import { signOut } from 'firebase/auth';
import axios from 'axios';

// Dummy data
const appVersion = '1.0.0';

const Settings = ({navigation}) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [email, setEmail] = useState('example@example.com');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
    const [name, setName] = useState('John Doe');
    const [language, setLanguage] = useState('English');
    const [currency, setCurrency] = useState('USD');
    const [dateTimeFormat, setDateTimeFormat] = useState('MM/DD/YYYY');
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [loginHistory, setLoginHistory] = useState([
        { date: '2024-07-22', location: 'New York' },
        { date: '2024-07-21', location: 'San Francisco' },
    ]);

    
    
    
    const handleSave = () => {
        try {
            async function verifyFirebaseToken() {
                if (!auth.currentUser) {
                    console.log('User not signed in')
                    return
                }
        
                const token = await auth.currentUser.getIdToken()
        
                const response = await axios.post('http://192.168.217.91:8000/api/create-or-update-profile/', {
                    token,
                    name,
                    email,
                    phone: phoneNumber,
                })
        
                if (response.status === 200) {
                    Alert.alert('Success', 'Your settings have been saved successfully.');
                } else {
                    Alert.alert('Error', 'An error occurred while saving your settings. Please try again.');
                } 
            }
            verifyFirebaseToken()
        } 
        catch (error) {
            console.log('Error occurred', error)
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
        // Handle save settings logic
    };

    const handleDelete = () => {
        // Handle delete account logic
        Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
    };

    const handleLogout = () => {
        // Handle logout logic
        signOut(auth).then(() => {
            // Sign-out successful.
           
        Alert.alert('Logged Out', 'You have been logged out successfully.');
        })

    };

    const handleContactSupport = () => {
        // Handle contact support action
        Linking.openURL('mailto:support@example.com');
    };

    const handleFAQs = () => {
        // Open FAQs or help center link
        Linking.openURL('https://example.com/faqs');
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>            
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>Settings</Text>
                <TouchableOpacity style={{ backgroundColor: '#003366',  padding: 8, borderRadius: 4 }} activeOpacity={1}>
                </TouchableOpacity>
            </View>
            
            {/* Account Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            {/* Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.preference}>
                    <Text style={styles.preferenceText}>New Bookings Notifications</Text>
                    <Switch value={notificationsEnabled} onValueChange={(value) => setNotificationsEnabled(value)} style={{ color: '#003366' }} />
                </View>
                <View style={styles.preference}>
                    <Text style={styles.preferenceText}>Cancellation Notifications</Text>
                    <Switch value={notificationsEnabled} onValueChange={(value) => setNotificationsEnabled(value)} />
                </View>
                <View style={styles.preference}>
                    <Text style={styles.preferenceText}>Guest Messages and Reviews</Text>
                    <Switch value={notificationsEnabled} onValueChange={(value) => setNotificationsEnabled(value)} />
                </View>
            </View>

            {/* Cancellation Policies */}
            <View style={styles.section}>
                <Text style={styles.sectionSubtitle}>Cancellation Policies</Text>
                <Text style={styles.policyText}>Your cancellation policy details go here.</Text>
            </View>

            {/* App Behavior */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Behavior</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Language Preference"
                    value={language}
                    onChangeText={(text) => setLanguage(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Currency Preference"
                    value={currency}
                    onChangeText={(text) => setCurrency(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date and Time Format"
                    value={dateTimeFormat}
                    onChangeText={(text) => setDateTimeFormat(text)}
                />
            </View>

            {/* Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.preference}>
                    <Text style={styles.preferenceText}>Enable Two-Factor Authentication (2FA)</Text>
                    <Switch value={twoFAEnabled} onValueChange={(value) => setTwoFAEnabled(value)} />
                </View>
                <Text style={styles.sectionSubtitle}>Login History</Text>
                {loginHistory.map((entry, index) => (
                    <View key={index} style={styles.historyItem}>
                        <Text>{entry.date}</Text>
                        <Text>{entry.location}</Text>
                    </View>
                ))}
            </View>

            {/* Support */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.button} onPress={handleContactSupport} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleFAQs} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>FAQs / Help Center</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ padding: 20 }}>
                <TouchableOpacity style={{...styles.button, backgroundColor: 'red'}} onPress={handleDelete} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 20, marginTop: -20 }}>
                <Text style={styles.versionText}>App Version: {appVersion}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
  
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
  
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
  
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
  
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
  
    preferenceText: {
        fontSize: 16,
        color: '#333',
    },

    button: {
        backgroundColor: '#003366',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 12,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16
    },

    policyText: {
        fontSize: 16,
        color: '#333',
    },
  
    historyItem: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
  
    versionText: {
        textAlign: 'center',
        color: '#333',
        marginTop: 20,
    },
});

export default Settings;
