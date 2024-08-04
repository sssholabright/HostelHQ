import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import SignUp from './SignUp'
import AgentSignUp from './AgentSignUp'

export default function RegisterTab({navigation}) {
    const [activeTab, setActiveTab] = useState('login')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Register',
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#003366',
            },
            headerLeft: () => (
                <View />
            )
        })
    }, [navigation])

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, activeTab === 'login' ? styles.activeTab : null]} onPress={() => setActiveTab('login')}>
                    <Text style={[styles.tabText, activeTab === 'login' ? styles.activeTab : null]}>Client</Text>
                </TouchableOpacity>
                <View style={{width: 1, backgroundColor: '#ccc'}} />
                <TouchableOpacity style={[styles.tab, activeTab === 'signup' ? styles.activeTab : null]} onPress={() => setActiveTab('signup')}>
                    <Text style={[styles.tabText, activeTab === 'signup' ? styles.activeTab : null]}>Agent</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'login' ? <SignUp navigation={navigation} /> : <AgentSignUp navigation={navigation} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    tabContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
    },

    tab: {
        padding: 10,
        flex: 1,
        alignItems: 'center',
    },

    activeTab: {
        color: '#003366',
    },

    tabText: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
    },
})