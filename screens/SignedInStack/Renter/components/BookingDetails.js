import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../../firebase'
import { doc, setDoc } from 'firebase/firestore';

export default function BookingDetails({ navigation, route }) {
    const { booking } = route.params; // Extract booking data from route params

    const addChat = async() => {
        const q = doc(db, "chats", booking.bookingId)
        await setDoc(q, {
            agentId: booking.agentId,
            agentName: booking.agentName,
            chatId: booking.bookingId,
            image: null, 
            clientId: booking.clientId,
            clientName: booking.clientName
        })
    }

    const handleChatWithAgent = () => {
        addChat()
        // Navigate to the chat screen or open chat functionality
        navigation.navigate('ChatScreen', {  chatId: booking.bookingId, agentId: booking.agentId, agentName: booking.agentName, clientId: booking.clientId, clientName: booking.clientName  });
    };

    const images = [
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
    ]

    useEffect(() => {
    })

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 0, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Booking Details</Text>
                <View style={{width: 24}}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((img) => (
                        <View style={{width: 250, height: 200, marginHorizontal: 5}}>
                            <Image source={require('../../../../assets/bg-img.jpg')} style={{width: '100%', height: 200, borderRadius: 5}} />
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{booking.hostelName}</Text>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: 'gray'}}>{booking.address}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#003366'}}>N{booking.price}</Text>
                            <Text style={[{paddingHorizontal: 15, marginLeft: 10,  paddingVertical: 3, textTransform: 'capitalize', color: '#fff', fontWeight: '500', borderRadius: 5}, booking.paymentStatus === 'paid' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}>{booking.paymentStatus}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.chatButton} onPress={handleChatWithAgent}>
                        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                        <Text style={styles.chatButtonText}>Chat with Agent</Text>
                    </TouchableOpacity>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Booking Details</Text>
                        <Text style={styles.detail}>RoomType: <Text style={{color: '#003366'}}>{booking.roomType}</Text></Text>
                        <Text style={styles.detail}>Booking id: <Text style={{color: '#003366'}}>{booking.bookingId}</Text></Text>
                        <Text style={styles.detail}>Duration: <Text style={{color: '#003366'}}>{"1 Year (December 20th, 2024)"}</Text></Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Agent Information</Text>
                        <Text style={styles.detail}>Name: <Text style={{color: '#003366'}}>{booking.agentName}</Text></Text>
                        <Text style={styles.detail}>Email: <Text style={{color: '#003366'}}>{booking.agentEmail}</Text></Text>
                        <Text style={styles.detail}>Phone: <Text style={{color: '#003366'}}>{booking.agentPhone}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Information</Text>
                        <Text style={styles.detail}>Payment Method: <Text style={{color: '#003366'}}>Bank Transfer</Text></Text>
                        <Text style={styles.detail}>Account Name: <Text style={{color: '#003366'}}>{booking.agentName}</Text></Text>
                        <Text style={{color: 'red'}}>Contact the agent for the account information</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                        <Text style={[styles.detail, {color: '#003366'}]}>{'booking.cancellationPolicy'}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Booking Terms and Conditions</Text>
                        <Text style={[styles.detail, {color: '#003366'}]}>{'booking.termsAndConditions'}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },

    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    
    content: {
        marginTop: 10,
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#003366',
    },

    section: {
        marginBottom: 10,
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#003366',
    },

    detail: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        color: 'gray',
    },

    chatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#003366',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginBottom: 10,
        alignSelf: 'center',
    },
    
    chatButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});
