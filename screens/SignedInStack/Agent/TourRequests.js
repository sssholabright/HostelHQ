import React, { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { View, FlatList, StyleSheet, Text, Button, Image, Modal, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert, ImageBackground } from 'react-native';
import { auth, db } from '../../../firebase';
import ActiveHostel from './components/ActiveHostel';
import Reservation from './components/Reservation';

export default function Bookings({ navigation }) {
    const [activeTab, setActiveTab] = useState('active');
  
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#003366'} />
            <View style={{ padding: 20, backgroundColor: '#003366' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Management</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Text style={activeTab === 'active' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('active')}>Reserved</Text>
                <Text style={activeTab === 'rent' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('rent')}>Active</Text>
                <Text style={activeTab === 'Tour Request' ? styles.activeTabStyle : styles.inactiveTabStyle} onPress={() => setActiveTab('Tour Request')}>Tour Requests</Text>
            </View>

            {activeTab === 'active' ? (
                <Reservation navigation={navigation} />
            ) : activeTab === 'Tour Request' ? (
                <TourRequests navigation={navigation} />
            ) : (
                <ActiveHostel navigation={navigation} />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9'
    },

    activeTabStyle: {
        color: '#003366',
        width: 110,
        height: 30,
        borderWidth: 1,
        borderColor: '#003366',
        borderRadius: 20,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 'semibold',
        paddingTop: 5,
        backgroundColor: '#fff'
    },

    inactiveTabStyle: {
        color: '#000',
        width: 110,
        height: 30,
        fontSize: 14,
        paddingTop: 5,
        fontWeight: 'semibold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
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
    

export function TourRequests({navigation}) {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f4f6f9',
        },
    
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 16,
        },
    
        itemContainer: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 15,
            marginHorizontal: 5,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
    
        itemTitle: {
            fontSize: 18,
            fontWeight: 'bold',
        },
    
        itemSubtitle: {
            fontSize: 14,
            color: '#555',
            marginBottom: 8,
        },
    
        statusContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    
        status: {
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4,
            borderRadius: 4,
            textTransform: 'capitalize'
        },
    
        approvedStatus: {
            color: '#28a745',
        },
    
        deniedStatus: {
            color: '#dc3545',
        },
    
        actionButtons: {
            flexDirection: 'row',
        },
    
        approveButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#28a745',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 4,
            marginRight: 8,
        },
    
        denyButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#dc3545',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 4,
        },
    
        actionText: {
            color: '#fff',
            fontWeight: 'bold',
            marginLeft: 4,
        },
    
        emptyMessage: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: 16,
            color: '#555',
        },
    });
    const [tourRequests, setTourRequests] = useState([]);
    const userId = auth.currentUser.uid

    const getTourRequests = async() => {
        const q = query(collection(db, "tour-requests"), where("agent_id", "==", userId))
        onSnapshot(q, (querySnapshot) => {
            const requests = []
            querySnapshot.forEach((doc) => {
                requests.push(doc.data())
            })
            setTourRequests(requests)
        })
    }

    useEffect(() => {
        getTourRequests()
    }, [])


    const handleApprove = useCallback(async (id) => {
        if (!id) {
            Alert.alert('Error', 'Invalid request ID.');
            return;
        }
    
        Alert.alert('Approve Tour Request', 'Are you sure you want to approve this tour request?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', style: 'default', onPress: async () => {
                try {
        
                    // Update the request status in Firestore
                    const docRef = doc(db, "tour-requests", id);
                    
                    // Ensure the document exists before updating
                    const docSnap = await getDoc(docRef);
                    if (!docSnap.exists()) {
                        Alert.alert('Error', 'Tour request not found.');
                        return;
                    }
                    
                    await updateDoc(docRef, { status: 'approved' });
    
                    // Optionally: Notify user or perform other actions
                    Alert.alert('Success', 'Tour request approved successfully!');
                } catch (error) {
                    console.error('Error approving tour request:', error);
                    Alert.alert('Error', `Failed to approve tour request: ${error.message}`);
                }
            }},
        ]);
    }, [setTourRequests]);
    
    const handleDeny = useCallback(async (id) => {
        if (!id) {
            Alert.alert('Error', 'Invalid request ID.');
            return;
        }
    
        Alert.alert('Deny Tour Request', 'Are you sure you want to deny this tour request?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Deny', style: 'destructive', onPress: async () => {
                try {
                    // Update the request status in Firestore
                    const docRef = doc(db, "tour-requests", id);
                    
                    // Ensure the document exists before updating
                    const docSnap = await getDoc(docRef);
                    if (!docSnap.exists()) {
                        Alert.alert('Error', 'Tour request not found.');
                        return;
                    }
                    
                    await updateDoc(docRef, { status: 'denied' });
    
                    // Optionally: Notify user or perform other actions
                    Alert.alert('Success', 'Tour request denied successfully!');
                } catch (error) {
                    console.error('Error denying tour request:', error);
                    Alert.alert('Error', `Failed to deny tour request: ${error.message}`);
                }
            }},
        ]);
    }, [setTourRequests]);
    

    const renderTourRequestItem = useCallback(({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.hostel}</Text>
            <Text style={styles.itemSubtitle}>Date: {item.requested_date}</Text>
            <View style={styles.statusContainer}>
                <Text style={[styles.status, item.status === 'approved' && styles.approvedStatus, item.status === 'denied' && styles.deniedStatus]}>{item.status}</Text>
                {item.status === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                            <Text style={styles.actionText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.denyButton} onPress={() => handleDeny(item.id)}>
                            <Ionicons name="close-circle-outline" size={24} color="#fff" />
                            <Text style={styles.actionText}>Deny</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {item.status === 'approved' && (
                    <TouchableOpacity style={[styles.approveButton, { backgroundColor: '#003366'}]} onPress={() => navigation.navigate('ApprovedRequestDetails', {requestId: item.id})}>
                        <Text style={styles.actionText}>View Details</Text>
                        <Ionicons name="chevron-forward-circle-outline" size={24} style={{marginLeft: 3}} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    ), [handleApprove, handleDeny]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginHorizontal: 20, marginVertical: 10, fontSize: 24, color: '#003366', fontWeight: 'bold'}}>Tour Requests</Text>
            <View style={{ padding: 15, backgroundColor: '#f4f6f9' }}>
                {tourRequests.length > 0 ? (
                    <FlatList
                        data={tourRequests}
                        renderItem={renderTourRequestItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => setTourRequests(tourRequests)}
                        refreshing={false}
                    />
                ) : (
                    <Text style={styles.emptyMessage}>No tour requests found.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};
