import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy data for demonstration purposes
const initialChats = {
    '1': [
        { id: '1', sender: 'student', text: 'Hello! I would like to request a room tour.', seen: true, timestamp: '14:00' },
        { id: '2', sender: 'owner', text: 'Sure! When would you like to schedule it?', seen: true, timestamp: '14:05' },
        { id: '3', sender: 'student', text: 'How about next Monday?', seen: false, timestamp: '14:10' },
    ],

    '2': [
        { id: '1', sender: 'student', text: 'Is the room available?', seen: true, timestamp: '09:00' },
        { id: '2', sender: 'owner', text: 'Yes, it is. Would you like to schedule a tour?', seen: false, timestamp: '09:05' },
    ],

    '3': [
        { id: '1', sender: 'student', text: 'Can I move in next week?', seen: true, timestamp: '12:30' },
        { id: '2', sender: 'owner', text: 'Sure, let’s finalize the details.', seen: false, timestamp: '12:35' },
    ],
};


export default function ChatScreen({ route, navigation }) {
    const { chatId, name, image } = route.params;
    const [messages, setMessages] = useState(initialChats[chatId] || []);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        const updatedMessages = messages.map(message => 
            message.sender === 'student' ? { ...message, seen: true } : message
        );
        setMessages(updatedMessages);
    }, []);

    const handleSendMessage = () => {
        if (messageText.trim().length > 0) {
            const newMessage = {
                id: (messages.length + 1).toString(),
                sender: 'owner',
                text: messageText.trim(),
                seen: false,
                timestamp: new Date().toLocaleTimeString().slice(0, 5), // Format the time as HH:MM
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessageText('');
        }
    };

    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === 'owner' ? styles.ownerMessageContainer : styles.studentMessageContainer]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <View style={styles.messageMeta}>
                <Text style={styles.messageTime}>{item.timestamp}</Text>
                {item.sender === 'owner' && (
                    <Ionicons 
                        name={item.seen ? "checkmark-done" : "checkmark"} 
                        size={16} 
                        color={item.seen ? "#4caf50" : "#888"} 
                        style={styles.messageStatus} 
                    />
                )}
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Chat with {name}</Text>
            </View> 
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessageItem}
                onRefresh={() => {}}
                refreshing={false}
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={messageText}
                    onChangeText={setMessageText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },

    avatarPlaceholder: {
        width: 40,
        height: 40,
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
    
    messageList: {
        padding: 16,
    },
    
    messageContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        maxWidth: '75%',
    },
    
    ownerMessageContainer: {
        backgroundColor: '#003366',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    
    studentMessageContainer: {
        backgroundColor: '#ddd',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    
    messageText: {
        color: '#fff',
    },
    
    messageMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
      
    messageTime: {
        fontSize: 12,
        color: '#888',
        marginRight: 8,
    },
      
    messageStatus: {
        marginLeft: 4,
    },

    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    
    input: {
        flex: 1,
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        marginRight: 10,
    },

    sendButton: {
        width: 40,
        height: 40,
        backgroundColor: '#003366',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
