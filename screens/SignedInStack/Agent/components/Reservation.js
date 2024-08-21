import { ActivityIndicator, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebase';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Reservation({ navigation }) {
    const [bookings, setBookings] = useState([]);
    const [bookings2, setBookings2] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading, setLoading] = useState(true);

    const getBookings = async () => {
        try {
            const q = query(
                collection(db, 'bookings'),
                where("agentId", "==", auth.currentUser.uid),
                where('paymentStatus', '==', 'pending')
            );
            onSnapshot(q, (querySnapshot) => {
                const requests = [];
                querySnapshot.forEach((doc) => {
                    const booking = { id: doc.id, ...doc.data() };
                    requests.push(booking);
                });
                setBookings(requests);
            });
        } catch (error) {
            console.log('Error fetching bookings:', error);
        }
    };

    const getBookings2 = async () => {
        try {
            const q = query(
                collection(db, 'bookings'),
                where("agentId", "==", auth.currentUser.uid),
                where('paymentStatus', '==', 'processing')
            );
            onSnapshot(q, (querySnapshot) => {
                const requestss = [];
                querySnapshot.forEach((doc) => {
                    const booking = { id: doc.id, ...doc.data() };
                    requestss.push(booking);
                });
                setBookings2(requestss);
            });
        } catch (error) {
            console.log('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        getBookings();
        getBookings2();
    }, []);

    const modifyBooking = (id) => {
        setSelectedBookingId(id);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedBookingId(null);
        setIsModalVisible(false);
    };

    const cancelBooking = (id) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const bookingDoc = doc(db, "bookings", id);
                            const docSnap = await getDoc(bookingDoc);
                            if (!docSnap.exists()) {
                                Alert.alert('Error', 'Booking not found.');
                                return;
                            }
                            await updateDoc(bookingDoc, { paymentStatus: 'canceled' });
                            setIsModalVisible(false);
                        } catch (error) {
                            console.error('Error updating payment status:', error);
                            Alert.alert('Error', 'Failed to update payment status.');
                        }
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

    const handlePay = async (id) => {
        try {
            const bookingDoc = doc(db, "bookings", id);
            const docSnap = await getDoc(bookingDoc);
            if (!docSnap.exists()) {
                Alert.alert('Error', 'Booking not found.');
                return;
            }
            await updateDoc(bookingDoc, { paymentStatus: 'paid' });
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error updating payment status:', error);
            Alert.alert('Error', 'Failed to update payment status.');
        }
    };

    const renderBookingItem = ({ item }) => (
        <View key={item.id}>
            {show && (
                <View>
                    <View style={styles.bookingDetails}>
                        <View style={styles.bookingInfo}>
                            <Text style={styles.detail}>Reserved by: <Text style={styles.subDetail}>{item.clientName}</Text></Text>                            
                            <Text style={styles.detail}>Hostel: <Text style={styles.subDetail}>{item.hostelName}</Text></Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );

    const renderBookingItem2 = ({ item }) => (
        <View key={item.id}>
        {show2 && (
            <View>
                <View style={styles.bookingDetails}>
                    <View style={styles.bookingInfo}>
                        <Text style={styles.detail}>
                            Reserved by: <Text style={styles.subDetail}>{item.clientName}</Text>
                        </Text>
                        <Text style={styles.detail}>
                            Hostel: <Text style={styles.subDetail}>{item.hostelName}</Text>
                        </Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.approveButton} onPress={() => modifyBooking(item.bookingId)}>
                            <Text style={styles.actionText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.denyButton} onPress={() => cancelBooking(item.bookingId)}>
                            <Text style={styles.actionText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )}
        {selectedBookingId === item.bookingId && (
            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={handleCloseModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Approve Reservation</Text>
                        <View style={styles.section}>
                            <Text style={styles.detail}>
                                Payment Status: <Text style={[styles.subDetail, { color: 'orange', textTransform: 'capitalize' }]}>{item.paymentStatus}</Text>
                            </Text>
                            <Text style={styles.detail}>
                                Payer's Name: <Text style={styles.subDetail}>{item.clientName}</Text>
                            </Text>
                            <Text style={styles.detail}>
                                Are you sure you want to approve this reservation?
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item.bookingId)}>
                            <Text style={styles.payButtonText}>Paid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )}
    </View>
    );

    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 24, color: '#003366', marginLeft: 20, marginVertical: 10}}>Reservations</Text>
            {bookings.length === 0 && bookings2.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMessage}>No reservations found</Text>
                </View>
            ) : (
                <>
                    <View style={styles.bookingItem}>
                        <View style={styles.header}>
                            <Text style={[styles.hostelName, {color: '#28a745'}]}>Paid</Text>
                            <TouchableOpacity activeOpacity={0.8} style={styles.headerButton} onPress={() => setShow2(!show2)}>
                                <Text style={styles.bookingCount}>{bookings2.length}</Text>
                                <Ionicons name={show2 ? 'chevron-up' : 'chevron-down'} size={20} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={bookings2}
                            renderItem={renderBookingItem2}
                            onRefresh={getBookings2}
                            refreshing={false}
                        />
                    </View>
                    <View style={styles.bookingItem}>
                        <View style={styles.header}>
                            <Text style={styles.hostelName}>Pending</Text>
                            <TouchableOpacity activeOpacity={0.8} style={styles.headerButton} onPress={() => setShow(!show)}>
                                <Text style={styles.bookingCount}>{bookings.length}</Text>
                                <Ionicons name={show ? 'chevron-up' : 'chevron-down'} size={20} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={bookings}
                            renderItem={renderBookingItem}
                            onRefresh={getBookings}
                            refreshing={false}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
    },
    bookingItem: {
        borderColor: 'lightgray',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
        width: '90%',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: 'lightgray',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hostelName: {
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    bookingCount: {
        fontWeight: 'bold',
        color: '#555',
        marginRight: 5,
    },
    bookingDetails: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    },
    bookingInfo: {
        marginBottom: 10,
    },
    detail: {
        fontSize: 15,
        marginBottom: 5,
    },
    subDetail: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    approveButton: {
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 50,
        borderRadius: 5,
    },
    denyButton: {
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 50,
        borderRadius: 5,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
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
    },
    section: {
        marginBottom: 15,
    },
    payButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10
    },
    payButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    closeButtonText: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
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
});