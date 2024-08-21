import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

export default function BookingConfirmationScreen({navigation, route}) {
    const [user, setUser] = useState([])
    const [agent, setAgent] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const { data } = route.params; 
    const bookingDetails = data

    function getUser() {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        onSnapshot(q, (querySnapshot) => {
            const requests = []
            querySnapshot.forEach((doc) => {
                requests.push(doc.data())
            })
            setUser(requests)
        })
    }

    function getAgent() {
        const q = query(collection(db, "users"), where("uid", "==", bookingDetails.agent_id))
        onSnapshot(q, (querySnapshot) => {
            const requests = []
            querySnapshot.forEach((doc) => {
                requests.push(doc.data())
            })
            setAgent(requests)
        })
    }

    useEffect(() => {
        getUser()
        getAgent()
    }, [])

    const handleConfirmBooking = async() => {
        // Handle booking confirmation logic here
        // e.g., send confirmation to backend, navigate to a confirmation screen, etc.
        setLoading(true)

        const unsub = doc(db, "bookings", `${auth.currentUser.uid}-${bookingDetails.agent_id}`)
        await setDoc(unsub, {
            agentId: agent[0].uid,
            agentName: agent[0].name,
            agentEmail: agent[0].email,
            agentPhone: agent[0].phone,
            hostelName: bookingDetails.hostelName,
            price: bookingDetails.price, 
            bookingId: `${auth.currentUser.uid}-${bookingDetails.agent_id}`,
            status: "active",
            paymentStatus: 'pending',
            clientId: auth.currentUser.uid,
            clientName: user[0].name,
            modifiedAt: new Date(),
        }, {merge: true})
        setLoading(false)
        setShow(true) // Navigate to a success screen or another relevant screen
    };

    return (
        <SafeAreaView style={styles.container}><StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={1}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Confirm Booking</Text>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name='share-outline' size={24} color='#003366' />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Summary</Text>
                    <Text style={styles.detail}>Hostel: <Text style={styles.subDetail}>{bookingDetails.hostelName}</Text></Text>
                    <Text style={styles.detail}>Address: <Text style={styles.subDetail}>{bookingDetails.address}</Text></Text>
                    <Text style={styles.detail}>Number of Rooms: <Text style={styles.subDetail}>{bookingDetails.capacity}</Text></Text>
                    <Text style={styles.detail}>Price: <Text style={[styles.subDetail, {fontSize: 17, color: 'blue'}]}>N{bookingDetails.price}</Text></Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Renter Information</Text>
                    {user.map((user) => (
                        <View key={user.uid}>
                            <Text style={styles.detail}>Name: <Text style={styles.subDetail}>{user.name}</Text></Text>
                            <Text style={styles.detail}>Email: <Text style={styles.subDetail}>{user.email}</Text></Text>
                            <Text style={styles.detail}>Phone: <Text style={styles.subDetail}>{user.phone}</Text></Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Information</Text>
                    <Text style={styles.detail}>Payment Method: <Text style={styles.subDetail}>{'Bank Transfer'/*bookingDetails.paymentMethod*/}</Text></Text>
                    <Text style={styles.detail}>Payment Status: <Text style={[styles.subDetail, {color: 'yellow'}]}>{'Pending' /*bookingDetails.paymentMethod*/}</Text></Text>          
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    <Text style={styles.detail}>Cancellation Rules: <Text style={styles.subDetail}>{bookingDetails.paymentMethod}</Text></Text>
                    <Text style={styles.detail}>Refund Rules: <Text style={styles.subDetail}>{bookingDetails.paymentMethod}</Text></Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Terms and Conditions</Text>
                    <Text style={styles.detail}>Hostel Rules: <Text style={styles.subDetail}>{bookingDetails.paymentMethod}</Text></Text>
                    <Text style={styles.detail}>Guest Responsibilities: <Text style={styles.subDetail}>{bookingDetails.paymentMethod}</Text></Text>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                    {loading ? <ActivityIndicator size="small" color='#fff' /> :
                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>}
                </TouchableOpacity>
            </ScrollView>
            
            <Modal visible={show} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                        <Ionicons name="checkmark-circle" size={80} color="#003366" />
                        <Text style={{fontSize: 20, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>Booking Confirmed!</Text>
                        <Text style={styles.message}>Your booking has been successfully confirmed. You will receive a confirmation email with all the details shortly.</Text>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => navigation.navigate('Bookings')}>
                            <Text style={{color: '#fff', fontSize: 16}}>Go to Booking Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },

    scrollViewContent: {
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#003366',
    },

    section: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#003366',
    },

    detail: {
        fontSize: 15,
        marginBottom: 8,
    },

    subDetail: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    confirmButton: {
        backgroundColor: '#003366',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    content: {
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#003366',
    },
    
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    
    button: {
        backgroundColor: '#003366',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
    },
    
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

