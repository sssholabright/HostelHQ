import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';

const dummyGuest = {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '123-456-7890',
    bookingHistory: [
        { id: '1', date: '2023-06-15', hostel: 'Hostel A', room: 'Deluxe Room' },
        { id: '2', date: '2023-12-10', hostel: 'Hostel B', room: 'Standard Room' },
    ],
    preferences: 'No smoking, Vegan meals',
    reviews: [
        { id: '1', text: 'Great stay, very comfortable!', rating: 5 },
        { id: '2', text: 'Good location, but room was a bit noisy.', rating: 4 },
    ],
    loyaltyPoints: 150,
};

export default function GuestProfile({ navigation }) {
    const handleContact = () => {
        navigation.navigate('GuestMessage');
    };

    const handleManageReviews = () => {
        navigation.navigate('ManageReviews');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, marginBottom: 20, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>Guest Details</Text>
                <View style={{ backgroundColor: '#fff',  padding: 8 }} />
            </View>
            
            <View style={styles.header}>
                <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                <Text style={styles.guestName}>{dummyGuest.name}</Text>
                <Text style={styles.guestInfo}>{dummyGuest.email}</Text>
                <Text style={styles.guestInfo}>{dummyGuest.phone}</Text>
            </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking History</Text>
            {dummyGuest.bookingHistory.map((booking) => (
                <View key={booking.id} style={styles.bookingItem}>
                    <Text style={styles.bookingText}>Date: <Text style={styles.bookingDetail}>{booking.date}</Text></Text>
                    <Text style={styles.bookingText}>Hostel: <Text style={styles.bookingDetail}>{booking.hostel}</Text></Text>
                    <Text style={styles.bookingText}>Room: <Text style={styles.bookingDetail}>{booking.room}</Text></Text>
                </View>
            ))}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guest Preferences</Text>
            <View style={styles.preferenceCard}>
            <Text style={styles.preferences}>{dummyGuest.preferences}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {dummyGuest.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewRating}>Rating: <Text style={styles.reviewRatingValue}>{review.rating}</Text></Text>
            </View>
            ))}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loyalty Points</Text>
            <View style={styles.loyaltyCard}>
            <Text style={styles.loyaltyPoints}>{`${dummyGuest.loyaltyPoints} points`}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContact}>
            <Text style={styles.buttonText}>Contact Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleManageReviews}>
            <Text style={styles.buttonText}>Manage Reviews</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
    },
  
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 20
    },
  
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#003366',
        marginBottom: 10,
    },
  
    guestName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#343a40',
    },
  
    guestInfo: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 4,
    },
  
    section: {
        marginBottom: 20,
        padding: 16,
        marginHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
  
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
    },
  
    bookingItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingVertical: 8,
    },
 
    bookingText: {
        fontSize: 16,
        color: '#495057',
    },
  
    bookingDetail: {
        fontWeight: 'bold',
    },
   
    preferenceCard: {
        backgroundColor: '#e9ecef',
        padding: 15,
        borderRadius: 8,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderStyle: 'dashed',       
    },
  
    preferences: {
        fontSize: 16,
        color: '#495057',
    },

    reviewCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        borderColor: '#ced4da',
        borderWidth: 1,
    },

    reviewText: {
        fontSize: 16,
        color: '#495057',
    },

    reviewRating: {
        fontSize: 16,
        color: '#003366',
        marginTop: 4,

    },
  
    reviewRatingValue: {
        fontWeight: 'bold',
    },

    loyaltyCard: {
        backgroundColor: '#d4edda',
        padding: 16,
        borderRadius: 8,
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
  
    loyaltyPoints: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#155724',
    },

    button: {
        backgroundColor: '#003366',
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
  
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
