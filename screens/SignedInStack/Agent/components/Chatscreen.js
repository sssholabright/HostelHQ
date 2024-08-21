import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, onSnapshot, orderBy, Timestamp, writeBatch, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../firebase'; // Adjust the import path as necessary

export default function ChatScreen({ route, navigation }) {
    const { chatId, agentId, agentName, clientId, clientName, image } = route.params;
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [receiverId, setReceiverId] = useState('');

    useEffect(() => {
        // Determine the receiver's ID
        const currentUserId = auth.currentUser.uid;
        const isReceiver = clientId === currentUserId ? clientId : agentId;
        setReceiverId(isReceiver);

        // Mark messages as seen when chat screen is opened and if the current user is the receiver
        const markMessagesAsSeen = async () => {
            if (clientId === currentUserId || agentId === currentUserId) {
                const messagesRef = collection(db, 'chats', chatId, 'messages');
                const q = query(messagesRef, where("seen", "==", false), where("sender", "!=", currentUserId));
                const querySnapshot = await getDocs(q);
                const batch = writeBatch(db);
                querySnapshot.forEach((doc) => {
                    batch.update(doc.ref, { seen: true });
                });
                await batch.commit();
            }
        };

        markMessagesAsSeen();

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = [];
            querySnapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages: ", error);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async () => {
        if (messageText.trim().length > 0) {
            try {
                const newMessage = {
                    sender: auth.currentUser.uid,
                    text: messageText.trim(),
                    seen: false,
                    timestamp: Timestamp.now(),
                };

                await addDoc(collection(db, 'chats', chatId, 'messages'), newMessage);
                setMessageText('');
            } catch (error) {
                console.error('Error sending message: ', error);
            }
        }
    };

    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === auth.currentUser.uid ? styles.ownerMessageContainer : styles.studentMessageContainer]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <View style={styles.messageMeta}>
                <Text style={styles.messageTime}>{item.timestamp.toDate().toLocaleTimeString().slice(0, 5)}</Text>
                {item.sender === auth.currentUser.uid && (
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

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#003366" style={styles.loader} />
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? 'padding' : undefined}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.headerLeft}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{agentId === auth.currentUser.uid ? clientName.charAt(0) : agentName.charAt(0)}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{agentId === auth.currentUser.uid ? clientName : 'Chat with ' + agentName}</Text>
            </View> 
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessageItem}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 18,
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
        backgroundColor: 'lightblue',
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
