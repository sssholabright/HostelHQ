import { View, Text, StatusBar, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../../../firebase'

export default function Notifications({ navigation }) {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const userId = auth.currentUser.uid

        // Listen for tour request status changes
        const q = query(collection(db, 'tour-requests'), where('client_id', '==', userId))
        onSnapshot(q, (querySnapshot) => {
            let newNotifications = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                let message = null

                if (data.status === 'approved') {
                    message = `Tour request for ${data.name} on ${data.requested_date} has been approved.`
                } else if (data.status === 'declined') {
                    message = `Tour request for ${data.name} on ${data.requested_date} has been declined.`
                }

                if (message) {
                    newNotifications.push({
                        id: doc.id,
                        message
                    })
                }
            })

            // Merge new notifications with the existing ones, avoiding duplicates
            setNotifications((prevNotifications) => {
                const mergedNotifications = [...prevNotifications]
                newNotifications.forEach((notif) => {
                    if (!mergedNotifications.some((existingNotif) => existingNotif.id === notif.id)) {
                        mergedNotifications.push(notif)
                    }
                })
                return mergedNotifications
            })
        })

    }, [])

    const renderItem = ({ item }) => (
        <View key={item.id} style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
            <Text style={{ fontSize: 16 }}>{item.message}</Text>
        </View>
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: '#003366', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.7} style={{ marginRight: 10 }} onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back' size={24} color='#fff' />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>Notifications</Text>
            </View>

            {notifications.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>No notifications</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </SafeAreaView>
    )
}
