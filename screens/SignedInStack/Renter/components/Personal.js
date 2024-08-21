import { ActivityIndicator, Image, Modal, StatusBar, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { auth, db } from '../../../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';

export default function Personal({navigation}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState(auth.currentUser.email)
    const [phone, setPhone] = useState('')
    const [profileImage, setProfileImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editProfile, setEditProfile] = useState(false);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = async() => {
        const user = auth.currentUser
        setLoading(true)
        try {
            const userProfile = {
                name: name,
                phone: phone,
            };

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, userProfile, {merge: true});            
            setShowModal(true)
        } catch (error) {
            console.error('Error registering user:', error);
        } finally {
            setLoading(false);
        }
    };
  
    const getUser = async () => {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || '');
                setPhone(data.phone || '');
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching document:', error.message);
        }
    };
        
    
    
    
    
    useEffect(() => {
        if (auth.currentUser) {
            getUser();
        }
    }, [auth.currentUser]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Edit Profile</Text>
                <View style={{width: 24}}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 10}}>
                {editProfile && <Text style={{textAlign: 'center', color: 'red'}}>You are in edit mode!</Text>}
                <TouchableOpacity activeOpacity={0.9} style={{justifyContent: 'center', alignItems: 'center', padding: 20}} onPress={editProfile ? handlePickImage : null}>
                    <Image source={profileImage ? {uri: profileImage} : require('../../../../assets/bg-img.jpg')} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#003366'}} />
                    {editProfile && <Ionicons name="pencil" size={15} style={{position: 'absolute', bottom: 25, right: 110, color: '#fff', padding: 5, backgroundColor: '#003366', borderRadius: 50}} />}
                </TouchableOpacity>

                <View style={styles.formInputContainer}>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Name</Text>
                        <TextInput
                            style={[
                                styles.formInputField,
                                editProfile ? {borderColor: '#000'} : {backgroundColor: '#f0f0f0', color: '#000'},
                                loading && {backgroundColor: '#f0f0f0'}
                            ]}
                            value={name}
                            onChangeText={text => setName(text)}
                            editable={editProfile && !loading}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Email</Text>
                        <TextInput
                            style={[
                                styles.formInputField,
                                {backgroundColor: '#f0f0f0', color: '#000'}
                            ]}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            editable={false}
                        />
                        <Text style={{fontSize: 12, color: 'gray'}}>Contact us to change your email</Text>
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInputText}>Phone Number</Text>
                        <TextInput
                            style={[
                                styles.formInputField,
                                editProfile ? {borderColor: '#000'} : {backgroundColor: '#f0f0f0', color: '#000'},
                                loading && {backgroundColor: '#f0f0f0'}
                            ]}
                            value={phone}
                            onChangeText={text => setPhone(text)}
                            editable={editProfile && !loading}
                        />
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    
    formInputContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
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
})