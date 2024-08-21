import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, Modal, Alert, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { reauthenticateWithCredential, sendEmailVerification, updateEmail } from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';

export default function AgentProfile({navigation}) {
    const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
    const [name, setName] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('Unapproved'); // Can be 'Approved', 'Pending', 'Unapproved'
    const [email, setEmail] = useState(auth.currentUser.email);
    const [phone, setPhone] = useState('');
    const [about, setAbout] = useState('')
    const [approvedAgent, setApprovedAgent] = useState('No');
    const [editProfile, setEditProfile] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

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

    const handleUpdateProfile = async() => {
        const user = auth.currentUser
        setLoading(true)
        try {
            const userProfile = {
                email: email,
                name: name,
                phone: phone,
                about: about,
                approvalStatus: 'Approved',
                approvedAgent: 'Yes',
                verified: approvalStatus === 'Approved' ? true : false
            };

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, userProfile, { merge: true });
            setShowModal(true)
            
        } catch (error) {
            console.error('Error registering user:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0]; // Assuming uid is unique, get the first document
                setName(doc.data().name);
                setEmail(doc.data().email);
                setPhone(doc.data().phone);
                setAbout(doc.data().about);
                //setProfilePicture(doc.data().profilePicture);
                setApprovalStatus(doc.data().approvalStatus);
                setApprovedAgent(doc.data().approvedAgent);
            } else {
                // Handle the case where no documents are found, if necessary
                // For example, you might want to reset state or show a message
            }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
    }, [auth.currentUser.uid]); // Dependency array to run effect when uid changes


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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, marginBottom: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>My Profile</Text>
                <View style={{ backgroundColor: '#fff',  padding: 8 }} />
            </View>
            <ScrollView showVerticalScrollIndicator={false}>
            {editProfile && <Text style={{ color: '#dc3545', textAlign: 'center', marginBottom: 10 }}>You are in edit mode</Text>}
            {editProfile ? (
                <>
                <TouchableOpacity activeOpacity={0.9} style={{ justifyContent: 'center', alignItems: 'center', padding: 20}} onPress={editProfile ? handlePickImage : null}>
                    <Image source={profilePicture ? {uri: profilePicture} : require('../../../assets/bg-img.jpg')} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#003366'}} />
                    {editProfile && <Ionicons name="pencil" size={15} style={{position: 'absolute', bottom: 25, right: 130, color: '#fff', padding: 5, backgroundColor: '#003366', borderRadius: 50}} />}
                </TouchableOpacity>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Name</Text>
                        <TextInput style={[styles.formInputField, editProfile ? null : {borderColor: '#000', color: '#000'}]} value={name} onChangeText={text => setName(text)} />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Email</Text>
                        <TextInput style={[styles.formInputField, editProfile ? null : {borderColor: '#000', color: '#000'}]}value={email} onChangeText={text => setEmail(text)} />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Phone Number</Text>
                        <TextInput style={[styles.formInputField, editProfile ? null : {borderColor: '#000', color: '#000'}]} value={phone} onChangeText={text => setPhone(text)} />
                    </View>
                    
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>About Me</Text>
                        <TextInput style={[styles.formInputField, editProfile ? null : {borderColor: '#000', color: '#000'}]} value={about} onChangeText={text => setAbout(text)} multiline numberOfLines={5} textAlignVertical='top' />
                    </View>
                    <View style={styles.formInput}>
                        {editProfile ? (
                            <View>
                                <TouchableOpacity style={styles.formInputButton} onPress={handleUpdateProfile}>
                                    {loading ? <ActivityIndicator color="#fff" style={{marginRight: 10}} /> :
                                    <Text style={styles.formInputButtonText}>Save Changes</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.formInputButton} onPress={() => setEditProfile(false)}>
                                    <Text style={styles.formInputButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.formInputButton} onPress={() => setEditProfile(true)}>
                                <Text style={styles.formInputButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                </>
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
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>About Me</Text>
                    <View style={styles.infoRow}>
                        <Text style={[styles.info, {textAlign: 'justify'}]}>{about}</Text>
                    </View>
                </View>
            
                <TouchableOpacity style={styles.button} onPress={() => setEditProfile(true)}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            </>
            )}
            </ScrollView>
            
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Modal visible={showModal} transparent={true} animationType="slide">
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                            <Ionicons name="checkmark-circle" size={100} color="#003366" />
                            <Text style={{fontSize: 20, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>Profile Saved</Text>
                            <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => [setShowModal(false), setEditProfile(false)]}>
                                <Text style={{color: '#fff', fontSize: 16}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
  
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
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
        fontSize: 20,
        fontWeight: '500',
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
        fontSize: 15,
        color: '#495057',
    },
  
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
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
    
    formInputContainer: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 10,
        marginTop: -20
    },
    
    formInput: {
        marginBottom: 20,
    },

    formInputText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    
    formInputSubText: {
        fontSize: 14,
        color: '#666',
    },
    
    formInputField: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
    
    formInputButton: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10
    },
    
    formInputButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
