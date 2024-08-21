import { ActivityIndicator, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../../../firebase'

export default function AgentProperties({navigation, route}) {
    const { agentId, agentName } = route.params
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchProperties = async() => {
            try {
                const q = query(collection(db, 'hostels'), where('agent_id', '==', agentId))
                onSnapshot(q, (snapshot) => {
                    const agentHostels = []
                    snapshot.forEach((doc) => {
                        agentHostels.push(doc.data())
                    })
                    setProperties(agentHostels)
                })
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        fetchProperties()
    }, [agentId])

    if (loading) {
        return (
            <ActivityIndicator size={'large'} style={{flex: 1}} color='#003366' />
        )
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'whitesmoke'}}>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back' size={24} color='#003366' />
                </TouchableOpacity>
                <Text style={{color: '#003366', fontSize: 18, fontWeight: '600', paddingHorizontal: 20}}>View Agent Properties</Text>
                <View />
            </View>

            <View style={{padding: 5,marginTop: 20, marginHorizontal: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AgentView', {agentId})} style={{flexDirection: 'row', alignItems: 'center', padding: 5,}}>
                    <Image source={require('../../../../assets/bg-img.jpg')} style={{width: 40, height: 40, borderRadius: 50}} />
                    <View style={{marginLeft: 10}}>
                        <Text style={{color: '#003366', fontSize: 18, fontWeight: 'bold'}}>{agentName}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>Agent</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginTop: 20, backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                <View style={{ paddingHorizontal: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
                    <View style={{}}>
                        <Text style={{fontWeight: '500', marginBottom: 3}}>{properties.length} hostels</Text>
                        <Text style={{backgroundColor: 'lightgray', textAlign: 'center', color: '#000', borderRadius: 5}}>{properties.length} new</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.9} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 5, borderColor: 'purple', paddingHorizontal: 10, paddingVertical: 5}}>
                        <Ionicons name="swap-vertical" color='purple' size={20} />
                        <Text style={{marginLeft: 5, color: 'purple', fontWeight: '500'}}>Featured</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {properties.map((item) => (
                        <View key={item.id}> 
                            <TouchableOpacity
                                onPress={() => navigation.navigate('HostelDetails', { id: item.hostel_id, item })}
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'lightgray',
                                    marginHorizontal: 0,
                                    marginVertical: 10,
                                    borderRadius: 10,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.22,
                                    shadowRadius: 2.22,
                                    elevation: 2
                                }}>
                                <ImageBackground source={require('../../../../assets/bg-img.jpg')} imageStyle={{borderTopRightRadius: 10, borderTopLeftRadius: 10}} style={{ width: '100%', height: 200 }}>
                                    <View style={{marginVertical: 5, marginHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View style={{}}>
                                            <View style={{backgroundColor: 'green', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 80, height: 18, borderRadius: 3}}>
                                                <Ionicons name='shield-checkmark' size={15} color='#fff' />
                                                <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>Verified</Text>
                                            </View>
                                            <View style={{marginTop: 5, backgroundColor: 'purple', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 100, height: 18, borderRadius: 3}}>
                                                <Ionicons name='star' size={15} color='#fff' />
                                                <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>superagent</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.9} style={{marginTop: 5, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 30, height: 30, borderRadius: 50}}>
                                            <Ionicons name='heart-outline' size={20} color='#fff' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{marginTop: 0, marginLeft: 8, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 40, height: 18, borderRadius: 3}}>
                                        <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>new</Text>
                                    </View>
                                    <View style={{bottom: 10, position: 'absolute', left: 10,  width: 40, height: 40, borderWidth: 2, padding: 1, borderColor: 'green', borderRadius: 50}}>
                                        <Image source={require('../../../../assets/bg-img.jpg')} style={{width: '100%', height: '100%', borderRadius: 50}} />
                                        <Ionicons name='star' size={10} color='#fff' style={{backgroundColor: 'purple', position: 'absolute', right: -3, padding: 1, borderRadius: 50}} />
                                    </View>
                                </ImageBackground>
                            
                                <View style={{ justifyContent: 'space-evenly', marginHorizontal: 10, marginVertical: 10 }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -5}}>
                                        <Text style={{fontWeight: '500', fontSize: 12}}>Hostel</Text>
                                        <Text style={{fontWeight: '500', fontSize: 12}}>Listed 1 day ago</Text>
                                    </View>
                                    <Text style={{ color: '#003366', fontSize: 25, fontWeight: 'bold' }}>{item.hostelName}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Ionicons name="location" size={15} color='' />
                                        <Text style={{fontWeight: '500', fontSize: 12}}>{item.address}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5 }}>
                                        <Ionicons name='star' size={20} color='orange' />
                                        <Text style={{ color: 'gray', fontSize: 12, marginLeft: 5 }}>7.9 (Very good) (1558)</Text>
                                    </View>
                                    <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginRight: 10 }}>N{item.price}/year</Text>
                                </View>
                            </TouchableOpacity>
                        </View> 
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}