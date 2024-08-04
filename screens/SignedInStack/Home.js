import { ActivityIndicator, Alert, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';


export default function Home({navigation}) {
    const userId = auth.currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.HostelSearchContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ color: 'white', fontSize: 23, fontWeight: 'bold' }}>Find Your</Text>
                            <Text style={{ color: 'white', fontSize: 23, fontWeight: 'bold' }}>Dream Hostel!</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={styles.ProfileView} onPress={() => navigation.navigate('Account')}>
                            <Ionicons name="person" size={18} color="#003366" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.HostelSearchOption} onPress={() => navigation.navigate('Apartments')}>
                            <Ionicons name="location" size={18} color="#003366" />
                            <Text style={styles.HostelSearchOptionText}>Search Hostels</Text>
                        </TouchableOpacity>
                        <Ionicons name='search' size={25} color='#003366' style={{ marginLeft: 10, backgroundColor: '#fff', padding: 10, borderRadius: 10 }} />
                    </View>
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={{fontWeight: '500', fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>Top picks for you</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                        <TouchableOpacity style={{width: 250, height: 150, marginRight: 10, marginTop: 10, borderRadius: 10}} onPress={() => navigation.navigate("HostelDetails")}>
                            <ImageBackground style={{width: '100%', height: '100%', borderRadius: 10}}  source={require("../../assets/bg-img.jpg")} imageStyle={{borderRadius: 15}}>
                                <View style={{backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: 250, height: 150, marginRight: 10, marginTop: 10, borderRadius: 10}} onPress={() => navigation.navigate("HostelDetails")}>
                            <ImageBackground style={{width: '100%', height: '100%', borderRadius: 10}}  source={require("../../assets/bg-img.jpg")} imageStyle={{borderRadius: 15}}>
                                <View style={{backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <View style={{width: 30}}/>
                    </ScrollView>
                </View>

                <View style={{marginTop: 20, paddingBottom: 20}}>
                    <Text style={{fontWeight: '500', fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>Properties</Text>
                    <TouchableOpacity style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3}} onPress={() => navigation.navigate("HostelDetails")}>
                        <View style={{width: 150, height: 100, borderRadius: 10}}>
                            <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={require("../../assets/bg-img.jpg")} />
                            <View style={{backgroundColor: 'white', padding: 3, borderRadius: 50, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                <Ionicons name="heart" size={14} color="" />
                            </View>
                        </View>
                        <View style={{justifyContent: 'space-evenly', marginLeft: 20}}>
                            <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                            <Text style={{color: 'lightgray', fontSize: 12}}>32-34, Main Street</Text>
                            <Text style={{color: 'lightgray', fontSize: 12}}>Safari, Malete</Text> 
                            <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>N150,000.00</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3}} onPress={() => navigation.navigate("HostelDetails")}>
                        <View style={{width: 150, height: 100, borderRadius: 10}}>
                            <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={require("../../assets/bg-img.jpg")} />
                            <View style={{backgroundColor: 'white', padding: 3, borderRadius: 50, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                <Ionicons name="heart" size={14} color="" />
                            </View>
                        </View>
                        <View style={{justifyContent: 'space-evenly', marginLeft: 20}}>
                            <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>Kayboss Villa</Text>
                            <Text style={{color: 'lightgray', fontSize: 12}}>32-34, Main Street</Text>
                            <Text style={{color: 'lightgray', fontSize: 12}}>Safari, Malete</Text> 
                            <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>N150,000.00</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    HostelSearchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#003366',
    },

    ProfileView: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
    },

    HostelSearchOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        height: 50,
        flex: 1,
    },

    HostelSearchOptionText: {
        fontSize: 15,
        marginLeft: 10,
    },
})




















