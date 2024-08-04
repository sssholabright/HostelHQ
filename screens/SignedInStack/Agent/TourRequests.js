import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialTourRequests = [
    { id: '1', studentName: 'John Doe', tourDate: '2024-08-01', status: 'Pending' },
    { id: '2', studentName: 'Jane Smith', tourDate: '2024-08-03', status: 'Pending' },
    { id: '3', studentName: 'Sam Wilson', tourDate: '2024-08-05', status: 'Pending' },
];

export default function TourRequests() {
    const [tourRequests, setTourRequests] = useState(initialTourRequests);

    const handleApprove = useCallback((id) => {
        Alert.alert('Approve Tour Request', 'Are you sure you want to approve this tour request?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', style: 'default', onPress: () => {
                setTourRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === id ? { ...request, status: 'Approved' } : request
                    )
                );
            }},
        ]);
    }, []);

    const handleDeny = useCallback((id) => {
        Alert.alert('Deny Tour Request', 'Are you sure you want to deny this tour request?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Deny', style: 'destructive', onPress: () => {
                setTourRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === id ? { ...request, status: 'Denied' } : request
                    )
                );
            }},
        ]);
    }, []);

    const renderTourRequestItem = useCallback(({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.studentName}</Text>
            <Text style={styles.itemSubtitle}>Date: {item.tourDate}</Text>
            <View style={styles.statusContainer}>
                <Text style={[styles.status, item.status === 'Approved' && styles.approvedStatus, item.status === 'Denied' && styles.deniedStatus]}>{item.status}</Text>
                {item.status === 'Pending' && (
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
            </View>
        </View>
    ), [handleApprove, handleDeny]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366' }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Tour Requests</Text>
            </View>
            <View style={{ padding: 15 }}>
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
        backgroundColor: '#f5f5f5',
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
