import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, Alert, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { auth } from '../../../firebase';
import { reauthenticateWithCredential, sendEmailVerification, updateEmail } from 'firebase/auth';

export default function AgentProfile({navigation}) {
    const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
    const [name, setName] = useState('John Doe');
    const [approvalStatus, setApprovalStatus] = useState('Unapproved'); // Can be 'Approved', 'Pending', 'Unapproved'
    const [email, setEmail] = useState(auth.currentUser.email);
    const [phone, setPhone] = useState('+1234567890');
    const [approvedAgent, setApprovedAgent] = useState('No');
    const [editProfile, setEditProfile] = useState(false);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = () => {
        // Simulate profile update
        function editEmailFromFirebase() {
            sendEmailVerification(email).then(() => {
                console.log('Email verification sent')
            }).catch((error) => {
                console.log('Error sending email verification', error)
            })


        } 



        try {
            async function verifyFirebaseToken() {
                if (!auth.currentUser) {
                    console.log('User not signed in')
                    return
                }
        
                const token = await auth.currentUser.getIdToken()
            
                const response = await axios.post('http://192.168.127.91:8000/api/create-or-update-profile/', {
                    token,
                    name,
                    phone
                })
                
                if (response.status === 200) {
                    console.log('Profile updated successfully')
                    Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => setEditProfile(false) }])
                      

                } else {
                    console.log('Profile update failed')
                    Alert.alert('Error', 'Profile update failed')
                }
            }
            verifyFirebaseToken()
        }
        catch (error) {
            console.log('Error occurred', error)
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    // Status indicator styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
                return { backgroundColor: '#28a745', color: '#ffffff' }; // Green for approved
            case 'Pending':
                return { backgroundColor: '#ffc107', color: '#000000' }; // Yellow for pending
            case 'Unapproved':
                return { backgroundColor: '#dc3545', color: '#ffffff' }; // Red for unapproved
            default:
                return { backgroundColor: '#6c757d', color: '#ffffff' }; // Gray for unknown status
        }
    };

    const statusStyle = getStatusStyle(approvalStatus);

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, marginBottom: 20, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>My Profile</Text>
                <View style={{ backgroundColor: '#fff',  padding: 8 }} />
            </View>
            {editProfile && <Text style={{ color: '#dc3545', textAlign: 'center', marginBottom: 10 }}>You are in edit mode</Text>}
            {editProfile ? (
                <View>
                    <View style={styles.profileHeader}>
                        {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
                        <Button title="Change Picture" onPress={handlePickImage} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Profile Details</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput
                                style={{ ...styles.info, borderBottomWidth: 1,width: 150, borderColor: '#495057' }}
                                value={name}
                                onChangeText={(text) => setName(text)}
                            />
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Email:</Text>
                            <TextInput
                                style={{ ...styles.info, borderBottomWidth: 1,width: 150, borderColor: '#495057' }}
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Phone:</Text>
                            <TextInput
                                style={{ ...styles.info, borderBottomWidth: 1,width: 150, borderColor: '#495057' }}
                                value={phone}
                                onChangeText={(text) => setPhone(text)}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                <View style={styles.profileHeader}>
                    {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>Profile Details</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.info}>{name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Approval Status:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                            <Text style={[styles.statusText, { color: statusStyle.color }]}>{approvalStatus}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text style={styles.info}>{phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Approved Agent:</Text>
                        <Text style={styles.info}>{approvedAgent}</Text>
                    </View>
                </View>
            
                <TouchableOpacity style={styles.button} onPress={() => setEditProfile(!editProfile)}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
  
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },

    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 5,
        borderStyle: 'dashed',
        borderColor: '#003366',
    },
  
    detailsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 20,
        elevation: 2,
        marginBottom: 20,
    },
  
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#003366',
        marginBottom: 12,
    },
  
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
  
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#495057',
    },
  
    info: {
        fontSize: 16,
        color: '#495057',
    },
  
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
  
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
  
    updateButton: {
        margin: 20,
    },

    button: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
