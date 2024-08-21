import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { collection, query, where, orderBy, limit, getDocs, onSnapshotsInSync, onSnapshot } from 'firebase/firestore';

async function fetchAgentChats() {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where("clientId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const chatsWithLastMessage = [];
    for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        const messagesRef = collection(db, 'chats', doc.id, 'messages');
        const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.empty ? {} : lastMessageSnapshot.docs[0].data();
        chatsWithLastMessage.push({
            ...chatData,
            lastMessage: lastMessage.text || '',
            timestamp: lastMessage.timestamp ? lastMessage.timestamp.toDate().toLocaleTimeString().slice(0, 5) : '',
            hasUnseenMessages: lastMessage.seen,
        });

    }
    return chatsWithLastMessage;
}

async function fetchCommunityChats() {
    const chatsRef = collection(db, 'community-chats');
    const q = query(chatsRef, where("members", "array-contains", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const chatsWithLastMessage = [];
    for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        const messagesRef = collection(db, 'community-chats', doc.id, 'messages');
        const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.empty ? {} : lastMessageSnapshot.docs[0].data();
        chatsWithLastMessage.push({
            ...chatData,
            lastMessage: lastMessage.text || '',
            timestamp: lastMessage.timestamp ? lastMessage.timestamp.toDate().toLocaleTimeString().slice(0, 5) : '',
            hasUnseenMessages: lastMessage.seen,
        }); 
    }
    const b = query(collection(db, 'community-chats'), where("members", "array-contains", auth.currentUser.uid))
    onSnapshot(b, (snap) => {
        const dbd = []
        snap.forEach((doc) => {
            dbd.push(doc.data())
        })

        console.log("dbds: ", dbd)
    }, (error) => {
        console.log("Error fetching community chats: ", error);
    })
    return chatsWithLastMessage;
}





export default function ClientChatScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('AgentChat'); // Set initial active tab

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            let chatsData = [];
            if (activeTab === 'AgentChat') {
                chatsData = await fetchAgentChats();
            } else if (activeTab === 'Community') {
                chatsData = await fetchCommunityChats();
            }
            setChats(chatsData);
            setLoading(false);
        };

        getChats();
    }, [activeTab]); // Fetch chats when activeTab changes

    const handlePress = useCallback(async (chat) => {
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
                    <Text style={styles.avatarText}>{'item.agentName.charAt(0)'}</Text>
                </View>
            )}
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.agentName}</Text>
                <Text style={styles.chatMessage}>{item.lastMessage.substr(0, 30)}</Text>
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
            <ActivityIndicator size="large" color="#003366" style={{ flex: 1 }} />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366', marginBottom: 0 }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Chats</Text>
            </View>

            {/* Tab Selector */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Text 
                    style={activeTab === 'AgentChat' ? styles.activeTabStyle : styles.inactiveTabStyle} 
                    onPress={() => setActiveTab('AgentChat')}
                >
                    Agent Chat
                </Text>
                <Text 
                    style={activeTab === 'Community' ? styles.activeTabStyle : styles.inactiveTabStyle} 
                    onPress={() => setActiveTab('Community')}
                >
                    Community
                </Text>
            </View>

            {/* Chat List */}
            <FlatList
                data={chats}
                keyExtractor={item => item.id}
                renderItem={renderChatItem}
                onRefresh={async () => {
                    setLoading(true);
                    let chatsData = [];
                    if (activeTab === 'AgentChat') {
                        chatsData = await fetchAgentChats();
                    } else if (activeTab === 'Community') {
                        chatsData = await fetchCommunityChats();
                    }
                    setChats(chatsData);
                    setLoading(false);
                }}
                refreshing={loading}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No chats available.</Text>}
            />
        </SafeAreaView>
    );
}

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
    
    activeTabStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#003366',
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#003366',
        borderRadius: 25,
        backgroundColor: 'rgba(0, 51, 102, 0.1)',
    },
    
    inactiveTabStyle: {
        fontSize: 14,
        color: '#888',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
