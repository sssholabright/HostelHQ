import React, { useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Dummy data for demonstration purposes
const initialChats = [
    {
        id: '1',
        studentName: 'Emily Davis',
        lastMessage: 'How about next Monday?',
        timestamp: '14:10',
        hasUnseenMessages: true,
        image: null,
    },
    {
        id: '2',
        studentName: 'Michael Brown',
        lastMessage: 'Is the room available?',
        timestamp: '09:00',
        hasUnseenMessages: false,
        image: 'https://example.com/image1.jpg',
    },
    {
        id: '3',
        studentName: 'John Smith',
        lastMessage: 'Can I move in next week?',
        timestamp: '12:30',
        hasUnseenMessages: true,
        image: null,
    },
];

export default function Chat({ navigation }) {
    const [chats, setChats] = useState(initialChats);

    const renderChatItem = useCallback(({ item }) => (
        <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, image: item.image, name: item.studentName })}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{item.studentName.charAt(0)}</Text>
                </View>
            )}
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.studentName}</Text>
                <Text style={styles.chatMessage}>{item.lastMessage}</Text>
            </View>
            <View style={styles.chatMeta}>
                <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
                {item.hasUnseenMessages && (
                    <View style={styles.unseenIndicator}>
                        <Ionicons name="ellipse" size={12} color="#007bff" />
                    </View>
                )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
    ), [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366', marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Chats</Text>
            </View>
            <FlatList
                data={chats}
                keyExtractor={item => item.id}
                renderItem={renderChatItem}
                onRefresh={() => setChats(initialChats)}
                refreshing={false}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No chats available.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
  
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
  
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#003366',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
  
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
  
    chatInfo: {
        flex: 1,
    },
  
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
  
    chatMessage: {
        fontSize: 14,
        color: '#555',
    },

    chatMeta: {
        alignItems: 'flex-end',
    },

    chatTimestamp: {
        fontSize: 12,
        color: '#888',
    },
      
    unseenIndicator: {
        marginTop: 4,
    },

    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});

