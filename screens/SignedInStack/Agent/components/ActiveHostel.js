import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';

export default function ConfirmedBookings() {
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchConfirmedBookings = async () => {
            try {
                const q = query(
                    collection(db, 'bookings'),
                    where('agentId', '==', auth.currentUser.uid),
                    where('paymentStatus', '==', 'paid')
                );

                onSnapshot(q, (querySnapshot) => {
                    const bookings = [];
                    querySnapshot.forEach((doc) => {
                        const booking = { id: doc.id, ...doc.data() };
                        bookings.push(booking);
                    });
                    setConfirmedBookings(bookings);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Error fetching confirmed bookings:', error);
            }
        };

        fetchConfirmedBookings();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = confirmedBookings.filter(booking => 
                booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.hostelName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(confirmedBookings);
        }
    }, [searchQuery, confirmedBookings]);

    const openBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const renderBookingItem = ({ item }) => (
        <TouchableOpacity style={styles.bookingCard} onPress={() => openBookingDetails(item)}>
            <View style={styles.bookingInfo}>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.hostelName}>{item.hostelName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#555" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Confirmed Reservations</Text>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search reservations..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003366" />
                </View>
            ) : filteredBookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMessage}>No confirmed reservations found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBookingItem}
                    contentContainerStyle={styles.bookingList}
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Booking Details</Text>
                        {selectedBooking && (
                            <>
                                <Text style={styles.detail}>Client Name: <Text style={styles.subDetail}>{selectedBooking.clientName}</Text></Text>
                                <Text style={styles.detail}>Hostel Name: <Text style={styles.subDetail}>{selectedBooking.hostelName}</Text></Text>
                                <Text style={styles.detail}>Room Type: <Text style={styles.subDetail}>Selfcon</Text></Text>
                                <Text style={styles.detail}>Check-in Date: <Text style={styles.subDetail}>Aug 24th, 2024</Text></Text>
                                <Text style={styles.detail}>Validity: <Text style={styles.subDetail}>1 year</Text></Text>
                                <Text style={styles.detail}>Duration: <Text style={styles.subDetail}>Aug 24th, 2025</Text></Text>
                                <Text style={styles.detail}>Total Price: <Text style={styles.subDetail}>${selectedBooking.price}</Text></Text>
                                <Text style={styles.detail}>Status: <Text style={[styles.subDetail, {color: 'green', textTransform: 'capitalize'}]}>{selectedBooking.status}</Text></Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
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
        backgroundColor: '#f4f6f9',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        marginHorizontal: 20,
        marginVertical: 10
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    bookingList: {
        paddingHorizontal: 20,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    bookingInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
    hostelName: {
        fontSize: 16,
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        fontSize: 18,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
    subDetail: {
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        backgroundColor: '#003366',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
