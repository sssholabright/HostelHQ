import { SafeAreaView, StatusBar, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Terms({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 0, paddingBottom: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Terms and conditions</Text>
                <View style={{width: 24}}/>
            </View>
            <ScrollView>
                <View style={{}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10}}>1. Other Application Terms</Text>
                    <Text style={{fontSize: 16, marginRight: 20, fontWeight: '500', color: 'gray'}}>These terms of use refers to the following additional terms, which also apply to your use of our sites.</Text>
                </View>
            </ScrollView>
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