import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile({navigation}) {
    const user = true;
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            {user ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#003366', paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
                        <Image source={require('../../assets/bg-img.jpg')} style={{width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: '#fff'}} />
                        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20}}>John Doe</Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center', width: '30%'}} onPress={() => navigation.navigate("Personal")}>
                            <Ionicons name="pencil" size={30} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 10, borderRadius: 50}} />
                            <Text style={{marginLeft: 5}}>Edit Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center', width: '30%'}}>
                            <Ionicons name="card" size={30} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 10, borderRadius: 50}} />
                            <Text style={{marginLeft: 5}}>My Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center', width: '30%'}} onPress={() => navigation.navigate("Settings")}>
                            <Ionicons name="settings" size={30} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 10, borderRadius: 50}} />
                            <Text style={{marginLeft: 5}}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 20, marginTop: 20}}>
                        <Text style={{fontWeight: '500', fontSize: 20, fontWeight: 'bold'}}>My Favorites</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20, marginTop: 10}}>
                            <TouchableOpacity style={{width: 250, height: 150, marginRight: 10, marginTop: 10, borderRadius: 10}} onPress={() => navigation.navigate("HostelDetails")}>
                                <Image style={{width: '100%', height: '100%', borderRadius: 10}}  source={require("../../assets/bg-img.jpg")} />
                                <View style={{backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width: 250, height: 150, marginRight: 10, marginTop: 10, borderRadius: 10}} onPress={() => navigation.navigate("HostelDetails")}>
                                <Image style={{width: '100%', height: '100%', borderRadius: 10}}  source={require("../../assets/bg-img.jpg")} />
                                <View style={{backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: 30}}/>
                        </ScrollView>
                    </View>
                </ScrollView>
            ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20, backgroundColor: '#003366', paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
                    <Text style={{color: 'white', fontSize: 15, fontWeight: 'condesed',}}>Welcome to Hostelify! Explore your hostel options, collect your favorite hostels and get ready to {'\n'}move in!</Text>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', padding: 10, borderRadius: 10, marginTop: 10, width: '50%', alignSelf: 'left'}}>
                        <Text style={{color: '#003366', textAlign: 'center', fontWeight: 'bold'}}>Get Started</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.settingsOptionsContainer}>
                    <View style={styles.settingsOption}>
                        <Text style={styles.settingsOptionText}>Help</Text>
                        <Text style={styles.settingsOptionSubText}>Get help with the app</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#003366" />
                </View>
                <View style={styles.settingsOptionsContainer}>
                    <View style={styles.settingsOption}>
                        <Text style={styles.settingsOptionText}>About</Text>
                        <Text style={styles.settingsOptionSubText}>Learn more about the app</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#003366" />
                </View>
                <View style={styles.VersionAndLogoutContainer}>
                    <Text style={styles.VersionAndLogoutText}>Version 1.0.0</Text>
                </View>
            </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    settingsOptionsContainer: { 
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: 'whitesmoke',
        borderRadius: 10,
        paddingHorizontal: 13,
        marginVertical: 5,
    },

    settingsOption: {
        flexDirection: 'column',
    },

    settingsOptionText: {
        fontSize: 15,
        fontWeight: 'bold',
    },

    settingsOptionSubText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontWeight: 'condensed'
    },

    VersionAndLogoutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    VersionAndLogoutText: {
        color: '#666',
    },
})








