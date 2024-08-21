import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, Linking, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

// black : #3c323b

export default function CustomerService({navigation}) {
    function handleWhatsApp() {
        Linking.openURL('https://wa.me/2349137982296')
    }
    
    function handleMail() {
        Linking.openURL('mailto:brighttechhub0@gmail.com')
    }

    function handleLiveChat() {
        Linking.openURL('https://brighttechhub.com/')
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 0, paddingBottom: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Customer Service</Text>
                <View style={{width: 24}}/>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 15, color: '#3c323b'}}>If you have any Queries, feel free to contact us:</Text>
            <View style={{marginTop: 30}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                    <TouchableOpacity activeOpacity={0.7} onPress={handleLiveChat} style={{borderWidth: 2, borderColor: '#FF005A', borderRadius: 5, width: 150, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="globe-outline" size={30} color='#FF005A'/>
                        <Text style={{fontWeight: '500', fontSize: 15, color: '#3c323b'}}>Live Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={handleWhatsApp} style={{borderWidth: 2, borderColor: '#25D366', borderRadius: 5, width: 150, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="logo-whatsapp" size={30} color='#25D366'/>
                        <Text style={{fontWeight: '500', fontSize: 15, color: '#3c323b'}}>Chat us on WhatsApp</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                    <TouchableOpacity activeOpacity={0.9} onPress={handleMail} style={{borderWidth: 2, borderColor: '#eebb2d', borderRadius: 5, width: 150, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="mail-outline" size={30} color='#eebb2d'/>
                        <Text style={{fontWeight: '500', fontSize: 15, color: '#3c323b'}}>Email us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} style={{borderWidth: 1, borderRadius: 5, paddingHorizontal: 50, paddingVertical: 20, alignItems: 'center', display: 'none' }}>
                        <Ionicons name="star" size={30} color='orange'/>
                        <Text style={{}}>Live Chat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    }
})