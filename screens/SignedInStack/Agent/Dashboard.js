import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebase';


const dummyTourRequests = [
    { id: '1', studentName: 'John Doe', tourDate: '2024-08-01', status: 'Pending' },
    { id: '2', studentName: 'Jane Smith', tourDate: '2024-08-03', status: 'Approved' },
    { id: '3', studentName: 'Sam Wilson', tourDate: '2024-08-05', status: 'Declined' },
];
  
const dummyChats = [
    { id: '1', studentName: 'Emily Davis', lastMessage: 'Looking forward to the tour!', timestamp: '2024-07-20 14:00' },
    { id: '2', studentName: 'Michael Brown', lastMessage: 'Is the room available?', timestamp: '2024-07-21 09:00' },
];
  
const dummyUpcomingEvents = [
    { id: '1', event: 'Room Inspection', date: '2024-07-25' },
    { id: '2', event: 'Maintenance Check', date: '2024-08-01' },
];

export default function Dashboard({navigation}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const renderTourRequestItem = useCallback(({ item }) => {
        return (
            <>
            {/* List of Tour Requests: Shows pending tour requests. Each item has a button to view details. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 2 }}>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}>{item.studentName}</Text>
                <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginRight: 50}}>{item.tourDate}</Text>
                <Text style={{ fontSize: 14, color: item.status === 'Pending' ? 'orange' : item.status === 'Approved' ? 'green' : 'red', backgroundColor: item.status === 'Pending' ? 'rgba(255, 165, 0, 0.1)' : item.status === 'Approved' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>{item.status}</Text>
            </View>
        </>
        );
    }, []);
     
    const renderChatItem = useCallback(({ item }) => {
        return (
            <>
                {/* Active Chats: Shows active chats with a button to open the chat screen. */}
                <View style={{margin: 5, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 2}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}>{item.studentName}</Text>
                        <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginRight: 50 }}>{item.timestamp}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Chat', { studentName: item.studentName })} style={{ backgroundColor: '#003366', padding: 5, borderRadius: 2 }}>
                            <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>Open Chat</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 14, color: 'gray' }}>{item.lastMessage}</Text>
                </View>
            </>
        )
    }, [])

    const renderEventItem = useCallback(({ item }) => {
        <>
            {/* Upcoming Events: Lists upcoming events or deadlines. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 2 }}>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}>{item.event}</Text>
                <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginRight: 50 }}>{item.date}</Text>
            </View>
        </>
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20, backgroundColor: '#003366' }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Dashboard: {auth.currentUser.email}</Text>
                </View>

                {/* Summary Cards: Display quick stats with navigation buttons to view more details. */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20}}>
                    <View style={{ padding: 16, borderRadius: 10, flex: 1, margin: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 3, backgroundColor: '#fff' }} onPress={() => navigation.navigate('TourRequests')}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003366' }}>Tour Requests</Text>
                        <Text style={{ fontSize: 13, color: 'gray', fontWeight: 'bold', marginVertical: 5 }}>{dummyTourRequests.length} Pending</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TourRequests')} style={{ backgroundColor: '#003366', padding: 5, borderRadius: 2 }}>
                            <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ padding: 16, borderRadius: 10, flex: 1, margin: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 3, backgroundColor: '#fff' }} onPress={() => navigation.navigate('Chats')}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003366' }}>Unread Chats</Text>
                        <Text style={{ fontSize: 13, color: 'gray', fontWeight: 'bold', marginVertical: 5 }}>{dummyChats.length} Unread</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Chats')} style={{ backgroundColor: '#003366', padding: 5, borderRadius: 2 }}>
                            <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>View All</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 16, borderRadius: 10, flex: 1, margin: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 3, backgroundColor: '#fff' }} onPress={() => navigation.navigate('UpcomingEvents')}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003366' }}>Upcoming Events</Text>
                        <Text style={{ fontSize: 13, color: 'gray', fontWeight: 'bold', marginVertical: 5 }}>{dummyUpcomingEvents.length} Events</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('UpcomingEvents')} style={{ backgroundColor: '#003366', padding: 5, borderRadius: 2 }}>
                            <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>View All</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                { /* List of Tour Requests: Shows pending tour requests. Each item has a button to view details. */}
                <View style={{ margin: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5, marginBottom: 10 }}>Tour Requests</Text>
                    <FlatList
                        data={dummyTourRequests}
                        keyExtractor={item => item.id}
                        renderItem={renderTourRequestItem}
                    />
                </View>
                    
                {/* Active Chats: Shows active chats with a button to open the chat screen. */}
                <View style={{ margin: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5, marginBottom: 10 }}>Active Chats</Text>
                    <FlatList
                        data={dummyChats}
                        keyExtractor={item => item.id}
                        renderItem={renderChatItem}
                    />
                </View>
                    
                    {/* Upcoming Events: Shows upcoming events. */}
                <View style={{ margin: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5, marginBottom: 10 }}>Upcoming Events</Text>
                    <FlatList
                        data={dummyUpcomingEvents}
                        keyExtractor={item => item.id}
                        renderItem={( {item} ) => (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 2 }}>
                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}>{item.event}</Text>
                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginRight: 50 }}>{item.date}</Text>
                                </View>
                            </>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
