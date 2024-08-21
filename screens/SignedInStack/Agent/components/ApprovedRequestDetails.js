import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';

const TourRequestDetails = ({ route, navigation }) => {
    const { requestId } = route.params;
    const [loading, setLoading] = useState(true);
    const [tourDetails, setTourDetails] = useState(null);

    useEffect(() => {
        // Mock data fetch function (replace with real data fetch)
        const fetchTourDetails = async () => {
            try {
                // Simulate an API call
                const q = query(collection(db, "tour-requests"), where("id", "==", requestId));
                onSnapshot(q, (snap) => {
                    const tours = []
                    snap.forEach((doc) => {
                        tours.push(doc.data())
                    })
                    setTourDetails(tours)
                })
            } catch (error) {
                console.error('Failed to fetch tour details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTourDetails();
    }, [requestId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#003366" />
            </SafeAreaView>
        );
    }

    if (!tourDetails) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorMessage}>Failed to load tour details.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {tourDetails.map((tour) => (
            <ScrollView key={tour.id} contentContainerStyle={styles.scrollView}>
                <Text style={styles.headerText}>Tour Request Details</Text>
                
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Hostel:</Text>
                    <Text style={styles.value}>{tour.hostel}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Requested Date:</Text>
                    <Text style={styles.value}>{tour.requested_date} {tour.requested_time}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={[styles.value, tour.status === 'approved' && styles.approvedStatus, {textTransform: 'capitalize'}]}>{tour.status}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Client Name:</Text>
                    <Text style={styles.value}>{tour.client_name}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Client Contact:</Text>
                    <Text style={styles.value}>{tour.client_phone}</Text>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="#003366" />
                    <Text style={styles.backButtonText}>Back to Requests</Text>
                </TouchableOpacity>
            </ScrollView>
            ))}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
    },
    scrollView: {
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
    },
    detailContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#003366',
    },
    value: {
        fontSize: 15,
        color: '#000',
        marginTop: 5,
    },
    approvedStatus: {
        color: 'green',
    },
    deniedStatus: {
        color: 'red',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#003366',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 30,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: '#003366',
        fontSize: 18,
        marginLeft: 10,
    },
    errorMessage: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TourRequestDetails;
