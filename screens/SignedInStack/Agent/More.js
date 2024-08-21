import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import Modal from 'react-native-modal'

export default function More({navigation}) {
    const [name, setName] = useState('') 
    const [verified, setVerified] = useState(false)  
    const [visible, setVisible] = useState(false) 

    function handleLogout() {
        // Handle logout logic
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.navigate('SignIn')
        })
    };

    useEffect(() => {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0]; // Assuming uid is unique, get the first document
                setName(doc.data().name);
                //setProfilePicture(doc.data().profilePicture);
                setVerified(doc.data().verified);
                //setApprovedAgent(doc.data().approvedAgent);
            } else {
                // Handle the case where no documents are found, if necessary
                // For example, you might want to reset state or show a message
            }
        });

        return () => unsubscribe();
    }, [auth.currentUser.uid]); 

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366', marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>More</Text>
            </View>
            <View style={{marginHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: 'lightgray', borderRadius: 8, marginBottom: 10, padding: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../assets/pic.jpg')} style={{width: 70, height: 70, borderRadius: 50}} />
                    <View style={{marginLeft: 10, alignItems: 'flex-start'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', marginRight: 5 }}>{name}</Text>
                        {verified && <MaterialIcons name='verified' color='#0f52b9' size={20} />}
                        </View>
                        {verified ? (
                            <View style={{alignItems: 'center', marginTop: 2}}>
                                <Text style={{color: '#008000', fontWeight: 'bold', fontSize: 15, textAlign: 'center'}}>Verified</Text>
                            </View>
                        ) : ( 
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: 'whitesmoke', padding: 3, paddingHorizontal: 8, borderRadius: 50, color: 'orange'}}>
                                <ActivityIndicator color="orange" />
                                <Text style={{color: 'orange', fontWeight: '500', marginLeft: 5}}>Pending Verification</Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{backgroundColor: '#003366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10, paddingVertical: 8, borderRadius: 8}}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                    <Text style={{color: '#fff', fontSize: 15, fontWeight: '500', marginLeft: 5}}>Edit</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView>
            <View style={{marginHorizontal: 20, marginVertical: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'lightgray', borderRadius: 8}}>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Listings")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="document-text" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>My Documents</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Terms")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="pricetag" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Premium</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Personal")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="star" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>My Ratings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 20, marginVertical: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'lightgray', borderRadius: 8}}>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("RateApp")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="star-outline" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Rate Our App</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Terms")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Terms & Condition</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("Personal")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Privacy Policy</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("HelpCenter")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="help-circle-outline" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Help Center</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => navigation.navigate("CustomerService")}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AntDesign name="customerservice" size={24} color="gray" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'gray'}}>Customer Service</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderRadius: 5, borderColor: 'whitesmoke'}} onPress={() => setVisible(true)}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="exit-outline" size={24} color="red" />
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, color: 'red'}}>Log out</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#003366" />
                </TouchableOpacity>
            </View>
            <Text style={{color: '#666', textAlign: 'center'}}>Version 1.0.0</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 8,
        marginHorizontal: 20,
    },

    icon: {
        marginRight: 12,
    },

    itemText: {
        fontSize: 18,
        color: '#333',
    },
});