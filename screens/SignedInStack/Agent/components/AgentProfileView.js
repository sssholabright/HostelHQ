import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../../../firebase'

const Message = [
    {
        "text": "This mobile application for Home Rentals. It helps users to visits and rent houses suitable for them. The goal is to bring real estates companies, landlords, and tenants together. That's why I created an easy-to-use application design ",
        "name": "Miami Bay Villa",
        "location": "Westend (Lambo area), Malete",
        "rate": "4.0",
        "time": '1 month ago',
        "reviews": [
            {
                "user": "Mujeeb",
                "review": "Good hostel",
                "time": '1 month ago',
            },
            {
                "user": "Adesola",
                "review": "Great",
                "time": '1 month ago',
            },
            {
                "user": "Bright",
                "review": "Nice rooms",
                "time": '1 month ago',
            }
        ]
    }
]
export default function AgentProfileView({navigation, route}) {
    const { agentId } = route.params
    const [agentProfile, setAgentProfile] = useState([])
    const [loading, setLoading] = useState(true)

    const getAgentProfile = () => {
        const q = query(collection(db, 'users'), where('uid', '==', agentId))
        onSnapshot(q, (snapshot) => {
            const agents = []
            snapshot.docs.forEach((doc) => {
                agents.push({...doc.data(), id: doc.id})
            })
            setAgentProfile(agents)
            setLoading(false)
        })
    }

    useEffect(() => {
        getAgentProfile()
    }, [agentId])


    if (loading) {
        return (
            <ActivityIndicator size='large' color='#003366' style={{flex: 1}} />
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back' size={24} color='#003366' />
                </TouchableOpacity>
                <Text style={{color: '#003366', fontSize: 18, fontWeight: '600', paddingHorizontal: 20}}>Agent Profile</Text>
                <View />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {agentProfile.map((agent) => (
                    <View key={agent.id}>
                        <View style={{padding: 20, flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../../../assets/bg-img.jpg')} style={{width: 60, height: 60, borderRadius: 10}} />
                            <View style={{marginLeft: 20, justifyContent: 'space-evenly', height: 60}}>
                                <Text style={{fontWeight: 'bold', fontSize: 25}}>{agent.name}</Text>   
                                <Text style={{color: 'gray', fontWeight: '500', fontSize: 15}}>Address</Text> 
                                <View style={{marginTop: 5, backgroundColor: 'purple', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 100, height: 18, borderRadius: 3}}>
                                    <Ionicons name='star' size={13} color='#fff' />
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>superagent</Text>
                                </View>
                            </View>    
                        </View>      
                    
                        <View style={{paddingHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Information</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', margin: 10, alignItems: 'center'}}>
                                <Ionicons name='call' size={18} color='#003366' style={{backgroundColor: 'pink', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 10, fontSize: 15, fontWeight: '500', color: '#003366'}}>{agent.phone}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', margin: 10, alignItems: 'center'}}>
                                <Ionicons name='home' size={18} color='#003366' style={{backgroundColor: 'pink', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 10, fontSize: 15, fontWeight: '500', color: '#003366'}}>+123456789</Text>
                            </View>
                        </View> 
                        <View style={{paddingHorizontal: 20, marginTop: 10}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>About Me</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10, alignItems: 'center'}}>
                                <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray', textAlign: 'justify'}}>{agent.about}</Text>
                            </View>
                        </View> 

                        <Text style={{fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 10}}>Ratings & Reviews</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5}}>
                            <Text style={{marginRight: 10}}>4.8</Text>
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='staro' size={20} color='orange' />
                            <Text style={{marginLeft: 10}}>20 reviews</Text>
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response time: 1 hour</Text>
                            <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response rate: 100%</Text>
                            <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Languages: English, Yoruba</Text>
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <TouchableOpacity activeOpacity={0.7} style={{borderWidth: 1, borderColor: '#003366', backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 10}}>
                                <Text style={{color: '#003366', textAlign: 'center', fontWeight: '500'}}>Chat with Agent</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                            {Message[0].reviews.map((review, index) => (
                                <View style={{marginVertical: 10, marginRight: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f2f2f2', width: 300}} key={index}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{color: 'gray', fontSize: 20, fontWeight: '500', backgroundColor: 'rgba(0, 51, 102, 0.1)', borderRadius: 50, marginRight: 5, width: 50, height: 50, textAlign: 'center', lineHeight: 55}}>{review.user[0]}</Text>
                                            <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>{review.user}</Text>    
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{color: 'gray', marginLeft: 5, fontSize: 13, fontWeight: 'bold'}}>{review.time}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="star" size={15} color="#003366" />
                                    <Text style={{fontSize: 14, fontWeight: 'semibold', marginTop: 10}}>{review.review} it we want to over the castle on the hill. Castle on the hill.</Text>
                                </View>
                                
                            ))}
                                <View style={{width: 30}}/>

                        </ScrollView> 
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}