import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileSettingsPage({navigation}) {
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Agent Profile',
            headerTitleStyle: {
                color: 'white',
            },
            headerStyle: {
                backgroundColor: '#003366',
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
            ),
        })
    }, [navigation])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileOptionsContainer}>
                    <Text style={styles.profileTopText}>Agent Profile</Text>
                    <Text style={styles.profileSubText}>Create your Agent Profile once and reuse it for all your applications</Text>
                </View>
                <View style={styles.profilePersonalSection}>
                    <Text style={styles.profilePersonalText}>Personal Information</Text>
                    <Text style={styles.profilePersonalSubText}>Please provide your personal information</Text>

                    <TouchableOpacity activeOpacity={0.8} style={styles.profileOption} onPress={() => navigation.navigate('Personal')}>
                        <Text style={styles.profileOptionText}>Personal Details</Text>
                        <Ionicons name="chevron-forward" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.profileOption} onPress={() => navigation.navigate('AboutMe')}>
                        <Text style={styles.profileOptionText}>About Me</Text>
                        <Ionicons name="chevron-forward" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.profileOption}>
                        <Text style={styles.profileOptionText}>Professional Information</Text>
                        <Ionicons name="chevron-forward" size={24} color="#000" />
                    </TouchableOpacity>
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
    
    profileOptionsContainer: {
        padding: 20,
    },
    
    profileTopText: {
        fontSize: 24,
        fontWeight: 'condensedBold',
        color: '#000',
    },
    
    profileSubText: {
        fontSize: 12,
        color: '#000',
    },
    
    profilePersonalSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2',
        marginBottom: 40,
    },
    
    profilePersonalText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    
    profilePersonalSubText: {
        fontSize: 12,
        color: '#000',
    },
    
    profileOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 10
    },
    
    profileOptionText: {
        fontSize: 14,
        color: '#000',
    },
})