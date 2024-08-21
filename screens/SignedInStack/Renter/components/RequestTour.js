import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../../firebase'
import { collection, query, where, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function RequestTour({navigation}) {
    const [tourRequests, setTourRequests] = useState([]);
    const [loading, setLoading] = useState(true)
    const userUId = auth.currentUser.uid

    const getTourRequests = async() => {
        const q = query(collection(db, "tour-requests"), where("client_id", "==", userUId))
        onSnapshot(q, (querySnapshot) => {
            const requests = []
            querySnapshot.forEach((doc) => {
                requests.push(doc.data())
            })
            setTourRequests(requests)
            setLoading(false)
        })
    }

    useEffect(() => {
        getTourRequests()
    }, [])


     
    const renderTourRequestItem = useCallback(({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.hostel}</Text>
            <Text style={styles.itemSubtitle}>Date: {item.requested_date}</Text>
            <View style={styles.statusContainer}>
                <Text style={[styles.status, item.status === 'approved' && styles.approvedStatus, item.status === 'denied' && styles.deniedStatus]}>{item.status}</Text>
                <TouchableOpacity style={[styles.approveButton, { backgroundColor: '#003366'}]} onPress={() => navigation.navigate('TourRequestDetails', {requestId: item.id, sta: item.status})}>
                    <Text style={styles.actionText}>View Details</Text>
                    <Ionicons name="chevron-forward-circle-outline" size={24} style={{marginLeft: 3}} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    ));

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#003366" style={{flex: 1}} />
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 16 }}>
                {tourRequests.length > 0 ? (
                    <FlatList
                        data={tourRequests}
                        renderItem={renderTourRequestItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => setTourRequests(initialTourRequests)}
                        refreshing={false}
                    />
                ) : (
                    <Text style={styles.emptyMessage}>No tour requests found.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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