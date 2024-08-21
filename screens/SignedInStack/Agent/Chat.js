import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { collection, query, where, orderBy, limit, getDocs, doc } from 'firebase/firestore';

// Fetch chats and their last messages
async function fetchChats() {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("agentId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const chatsWithLastMessage = [];
    for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        const messagesRef = collection(db, "chats", doc.id, "messages");
        const lastMessageQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.empty ? {} : lastMessageSnapshot.docs[0].data();
        chatsWithLastMessage.push({
            ...chatData,
            lastMessage: lastMessage.text || '',
            timestamp: lastMessage.timestamp ? lastMessage.timestamp.toDate().toLocaleTimeString().slice(0, 5) : '', // Format timestamp
            hasUnseenMessages: lastMessage.seen, // Assume lastMessage.seen if it's present
        });
    }
    return chatsWithLastMessage;
}

export default function AgentChatScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getChats = async () => {
            const chatsData = await fetchChats();
            setChats(chatsData);
            setLoading(false)
        };

        getChats();
    }, []);

    const handlePress = useCallback(async (chat) => {
        // Navigate to chat screen
        navigation.navigate('ChatScreen', { 
            chatId: chat.chatId, 
            image: chat.image, 
            agentId: chat.agentId, 
            clientId: chat.clientId, 
            agentName: chat.agentName,
            clientName: chat.clientName
        });
    }, [navigation]);

    const renderChatItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.chatContainer}
            onPress={() => handlePress(item)}
        >
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{item.clientName.charAt(0)}</Text>
                </View>
            )}
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.clientName}</Text>
                <Text style={styles.chatMessage}>{item.lastMessage.substr(0, 30)}...</Text>
            </View>
            <View style={styles.chatMeta}>
                <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
                {!item.hasUnseenMessages ? (
                    <View style={styles.unseenIndicator}>
                        <Ionicons name="ellipse" size={12} color="#007bff" />
                    </View>
                ) : null}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
    ), [handlePress]);


    if (loading) {
        return (
            <ActivityIndicator size="large" color="#003366" style={{flex: 1}} />
        )
    }

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
                onRefresh={async () => {
                    const chatsData = await fetchChats();
                    setChats(chatsData);
                }}
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
