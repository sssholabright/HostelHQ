import { SafeAreaView, StatusBar, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, ImageBackground, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function HelpCenter({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Help Center</Text>
                <View style={{width: 24}}/>
            </View>
            <ScrollView>
                <ImageBackground source={require('../../../../assets/bg-img.jpg')} style={{width: '100%', height: 200, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold', paddingHorizontal: 20, textAlign: 'center'}}>Advice and answers from the team</Text>
                </ImageBackground>
                <View style={styles.box}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10}}>What you should know about us</Text>
                    <Text style={{fontSize: 16, marginRight: 20, fontWeight: '500', color: 'gray'}}>New here? Found out more about HostelHQ</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    box: {
        margin: 20,
        padding: 10,
        elevation: 3,
    }
})