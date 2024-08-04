import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, Image, Modal, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';

const sampleBookings = [
    {
        id: '1',
        hostelName: 'Hostel A',
        roomType: 'Single Room',
        roomNumber: '101',
        studentName: 'John Doe',
        imageUrl: 'https://example.com/hostel-a.jpg',
        status: 'active',
    },
    {
        id: '2',
        hostelName: 'Hostel B',
        roomType: 'Double Room',
        roomNumber: '202',
        studentName: 'Jane Smith',
        imageUrl: 'https://example.com/hostel-b.jpg',
        status: 'cancelled',
    },
];

export default function Bookings({ navigation }) {
    const [activeTab, setActiveTab] = useState('active');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [tourModalVisible, setTourModalVisible] = useState(false);
    const [tourDate, setTourDate] = useState('');
    const [tourTime, setTourTime] = useState('');

    useEffect(() => {
        // Replace with your data fetching logic
        setBookings(sampleBookings);
    }, []);

    const modifyBooking = (booking) => {
        setSelectedBooking(booking);
        setNewRoomNumber(booking.roomNumber);
        setNewStudentName(booking.studentName);
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

    const handleSaveChanges = () => {
        const updatedBookings = bookings.map(booking =>
            booking.id === selectedBooking.id
                ? { ...selectedBooking, roomNumber: newRoomNumber, studentName: newStudentName }
            : booking
        )
        setBookings(updatedBookings);
        setModalVisible(false);
    }

    const renderBookingItem = ({ item }) => (
        <>
            {item.status === activeTab && (
                <View key={item.id} style={{ margin: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 5 }}>
                    <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.hostelName}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.roomType}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <Text style={{ fontSize: 16 }}>{`Room Number: ${item.roomNumber}`}</Text>
                        <Text style={{ fontSize: 16 }}>{`Student: ${item.studentName}`}</Text>
                    </View>

                    {item.status === 'active' && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                            <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5, width: 130 }} onPress={() => modifyBooking(item)}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Modify</Text>
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
            )}
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#003366'} />
            <View style={{ padding: 20, backgroundColor: '#003366' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Bookings</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Text style={activeTab === 'active' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('active')}>Active</Text>
                <Text style={activeTab === 'past' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('past')}>Past</Text>
                <Text style={activeTab === 'cancelled' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('cancelled')}>Cancelled</Text>
            </View>
            {bookings.length !== 0 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 100, color: 'gray' }}>No bookings found</Text>
                </View>
            )}  
            <FlatList
                keyExtractor={(item) => item.id}
                data={bookings}
                renderItem={renderBookingItem}
                onRefresh={() => setBookings(sampleBookings)}
                refreshing={false}
            />

            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => {setModalVisible(!isModalVisible)}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Modify Booking</Text>
                        {selectedBooking && (
                            <>
                                <Text style={{ fontSize: 16, marginBottom: 10 }}>{selectedBooking.hostelName}</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#003366', padding: 10, marginBottom: 10 }}
                                    value={newRoomNumber}
                                    placeholder="Room Number"
                                    onChangeText={setNewRoomNumber}
                                />
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#003366', padding: 10, marginBottom: 10 }}
                                    value={newStudentName}
                                    placeholder="Student Name"
                                    onChangeText={setNewStudentName}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                    <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5, width: 100 }} onPress={handleSaveChanges}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, width: 100 }} onPress={() => setModalVisible(false)}>
                                        <Text style={{ color: '#fff', textAlign: 'center'  }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
});
    