import { collection, onSnapshot, doc, query, where, getDoc, updateDoc} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, Image, Modal, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { auth, db } from '../../../firebase';
import RequestTour from './components/RequestTour'

export default function Bookings({ navigation }) {
    const [activeTab, setActiveTab] = useState('reserved');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newStudentName, setNewStudentName] = useState('');

    function getBookings() {
        const q = query(collection(db, 'bookings'), where("clientId", "==", auth.currentUser.uid))
        onSnapshot(q, (querySnapshot) => {
            const requests = []
            querySnapshot.forEach((doc) => {
                requests.push(doc.data())
            })
            setBookings(requests)
        })
    }

    useEffect(() => {
        // Replace with your data fetching logic
        getBookings()
    }, []);


    const modifyBooking = (id) => {
        setSelectedBooking(id)
        setModalVisible(true);
    };

    const cancelBooking = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        const updatedBookings = bookings.map(booking =>
                            booking.id === selectedBooking.id
                                ? { ...selectedBooking, status: 'cancelled' }
                            : booking
                        )
                        setBookings(updatedBookings);
                    }
                },
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }
            ]
        );
    };

    async function handlePay(id) {
        const unsub = doc(db, "bookings", id)
        const docSnap = await getDoc(unsub);
        if (!docSnap.exists()) {
            Alert.alert('Error', 'Bookings not found.');
            return;
        }
        
        await updateDoc(unsub, { paymentStatus: 'paid' });
        setModalVisible(false)
    }

    const renderBookingItem = ({ item }) => (
        <>
            {activeTab === "reserved" ? (
                <View key={item.id} style={{ margin: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 5 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', {booking: item})}>
                        <Image source={require('../../../assets/bg-img.jpg')} style={{ width: '100%', height: 200, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.hostelName}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize'}}>{item.roomType}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <Text style={{ fontSize: 16 }}>{`Price: ${item.price}`}</Text>
                        <Text style={{fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize'}}>Status: <Text style={item.paymentStatus === "pending" ? {fontSize: 16, color: 'red'} : {fontSize: 16, color:'green'}}>{item.paymentStatus==='paid' ? 'processing' : item.paymentStatus}</Text></Text>
                    </View>

                    {item.status === 'active' && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                            <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5, width: 130 }} onPress={() => modifyBooking(item.id)}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Make Payment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, width: 130 }} onPress={() => cancelBooking(item)}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {item.status === 'cancelled' && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                            <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancelled</Text>
                        </View>
                    )}
                </View>
            ): activeTab === 'Tour_request' ? (
                <RequestTour navigation={navigation} />
            ): null}
            <Modal animationType="slide" transparent={true} visible={isModalVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#003366' }}>Payment Information</Text>
                        <View style={styles.section}>
                            <Text style={styles.detail}>Payment Method: <Text style={styles.subDetail}>{'Bank Transfer'/*bookingDetails.paymentMethod*/}</Text></Text>
                            <Text style={styles.detail}>Payment Status: <Text style={[styles.subDetail, {color: 'cyan', textTransform: 'capitalize'}]}>{item.paymentStatus}</Text></Text>
                            <Text style={styles.detail}>Account Name: <Text style={styles.subDetail}>Mujeeb Adejobi</Text></Text>
                            <Text style={styles.detail}>Account Number: <Text style={styles.subDetail}>2116051857</Text></Text>
                            <Text style={styles.detail}>Bank Name: <Text style={styles.subDetail}>UBA</Text></Text>                   
                        </View>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 10, alignItems: 'center', marginVertical: 10}} onPress={() => handlePay(item.id)}>
                            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Paid</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#003366'} />
            <View style={{ padding: 20, backgroundColor: '#003366' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Bookings</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Text style={activeTab === 'reserved' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('reserved')}>Reserved</Text>
                <Text style={activeTab === 'Tour_request' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('Tour_request')}>Tour Requests</Text>
            </View>
            {bookings.length === 0 ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'gray' }}>No booking found</Text>
                </View>
            ):(
            <FlatList
                keyExtractor={(item) => item.id}
                data={bookings}
                renderItem={renderBookingItem}
                onRefresh={() => setBookings(bookings)}
                refreshing={false}
            />)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    activeTabStyle: {
        color: '#003366',
        padding: 10,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#003366',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 'semibold',
        backgroundColor: 'rgba(0, 51, 102, 0.1)'
    },

    inactiveTabStyle: {
        color: '#000',
        padding: 10,
        paddingHorizontal: 25,
        fontSize: 14,
        fontWeight: 'semibold'
    },

    detail: {
        fontSize: 15,
        marginBottom: 8,
    },

    subDetail: {
        fontSize: 16,
        fontWeight: 'bold',
    },

});
    