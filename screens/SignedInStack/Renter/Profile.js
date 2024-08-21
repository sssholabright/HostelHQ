import { Image, Alert, SafeAreaView, ScrollView, StatusBar, Text, Button, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function Profile({navigation}) {
    const [visible, setVisible] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0]; // Assuming uid is unique, get the first document
                setName(doc.data().name);
                //setProfilePicture(doc.data().profilePicture);
            } else {
                // Handle the case where no documents are found, if necessary
                // For example, you might want to reset state or show a message
                console.log(name)
            }
        });

        return () => unsubscribe();
    }, [auth.currentUser.uid]); 

    function handleLogout() {
        // Handle logout logic
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.navigate('SignIn')
        })
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Profile</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Notifications')}>
                    <Ionicons name='notifications' size={20} color='#fff' />
                    <View style={{width: 8, height: 8, backgroundColor: '#dc3545', position: 'absolute', top: 0, right: 2, borderRadius: 50}} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                    <Image source={require('../../../assets/bg-img.jpg')} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff'}} />
                    <Text style={{color: '#003366', fontSize: 18, marginTop: 10, fontWeight: 'bold', paddingHorizontal: 20}}>{name}</Text>
                </View>

                <View style={{marginHorizontal: 20, marginVertical: 10}}>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Personal")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="person-circle-outline" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("RateApp")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="star-outline" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Rate Our App</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Terms")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Terms & Condition</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Personal")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("HelpCenter")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="help-circle-outline" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Help Center</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("CustomerService")}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AntDesign name="customerservice" size={24} color="gray" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Customer Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => setVisible(true)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="exit-outline" size={24} color="red" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'red'}}>Log out</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    <Text style={{color: '#666', textAlign: 'center'}}>Version 1.0.0</Text>
                </View>
            </ScrollView>
            <Modal animationIn="slideInUp" animationOut="slideOutDown" animationOutTiming={700} transparent={true} isVisible={visible} style={{margin: 0}}>
                <View style={{ bottom: 0, position: 'absolute', padding: 20, width: '100%', backgroundColor:'#fff'}}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#003366', fontSize: 16}}>Logout</Text>
                    <View style={{borderBottomWidth: 0.5, marginTop: -10, marginBottom: 20, borderColor: 'gray', height: 20}}/>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'gray', fontSize: 14}}>Are you sure you want to log out?</Text>
                    <View style={{marginTop: 20, marginHorizontal: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setVisible(false)} style={{backgroundColor: 'transparent', borderWidth: 1, borderColor: '#003366', borderRadius: 25, width: 100, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: '500', color: '#003366'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={{backgroundColor: '#003366', borderWidth: 1, borderColor: '#003366', borderRadius: 25, width: 100, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: '500', color: '#fff'}}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}