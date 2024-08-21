import { ActivityIndicator, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function Home({navigation}) {
    const [hostels, setHostels] = useState([])
    const [apartments, setApartments] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [loading, setLoading] = useState(true)

    const getHostels = async() => {
        try {
            const q = query(collection(db, "hostels"))
            onSnapshot(q, (snapshot) => {
                const hosts = []
                snapshot.forEach((doc) => {
                    hosts.push(doc.data())
                })
                setHostels(hosts)
                setApartments(hosts)
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getHostels()
    }, [])

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#003366" style={{flex: 1}} />
        )
    }


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
                    <Text style={{fontWeight: '500', fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>Popular Hostels</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                        {hostels.map((data) => (
                            <TouchableOpacity key={data.id} style={{width: 250, height: 150, marginRight: 10, marginTop: 10, borderRadius: 10}} onPress={() => navigation.navigate("HostelDetails", {item: data})}>
                                <ImageBackground style={{width: '100%', height: '100%', borderRadius: 10}}  source={require("../../../assets/bg-img.jpg")} imageStyle={{borderRadius: 15}}>
                                    <View style={{backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', position: 'absolute', right: 15, top: 10}}>
                                        <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>{data.hostelName}</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                        <View style={{width: 30}}/>
                    </ScrollView>
                </View>

                <View style={{marginTop: 20, paddingBottom: 20}}>
                    <Text style={{fontWeight: '500', fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>Offers for you</Text>
                    {apartments.map((apartment) => (
                        <View key={apartment.id} style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3}}>
                            <View style={{width: 150, height: 100, borderRadius: 10}}>
                                <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={require("../../../assets/bg-img.jpg")} />
                                {favorite ? (
                                    <TouchableOpacity style={{backgroundColor: 'white', padding: 3, borderRadius: 50, alignItems: 'center', position: 'absolute', right: 15, top: 10}} onPress={() => setFavorite(false)}>
                                        <Ionicons name="heart" size={14} color="red" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={{backgroundColor: 'white', padding: 3, borderRadius: 50, alignItems: 'center', position: 'absolute', right: 15, top: 10}} onPress={() => setFavorite(true)}>
                                        <Ionicons name="heart" size={14} color="#000" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity key={apartment.id} style={{justifyContent: 'space-evenly', marginLeft: 20}} onPress={() => navigation.navigate("HostelDetails", {item: apartment})}>
                                <Text style={{color: '#003366', fontSize: 18, fontWeight: '600', width: 100,  wrap:'wrap'}}>{apartment.hostelName}</Text>
                                <Text style={{color: 'lightgray', fontSize: 12, width: 100}}>{apartment.address}</Text> 
                                <Text style={{color: '#003366', fontSize: 18, fontWeight: '600'}}>N{apartment.price}.00</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
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




















