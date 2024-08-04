import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function RequestTour({navigation, route}) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor={'#003366'} />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                <View style={{}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Request Tour</Text>
                    <TextInput
                        style={{ width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                        placeholder='Enter your name'
                    />
                    <TextInput
                        style={{ width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                        placeholder='Enter your email'
                    />
                    <TextInput
                        style={{ width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                        placeholder='Enter your phone number'
                    />
                    <TextInput
                        style={{ width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                        placeholder='Enter the date you want to tour the property'
                    />
                    <TextInput
                        style={{ width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                        placeholder='Enter the time you want to tour the property'
                    />
                    <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5, width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>Request Tour</Text>
                    </TouchableOpacity>    
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})