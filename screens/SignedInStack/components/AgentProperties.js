import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function AgentProperties({navigation, route}) {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='chevron-back' size={24} color='#003366' />
                    </TouchableOpacity>
                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600', paddingHorizontal: 20}}>View Agent Properties</Text>
                    <View />
                </View>
                <View style={{padding: 5, borderWidth: 1, borderColor: 'lightgray', marginHorizontal: 20, borderRadius: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 5,}}>
                        <Image source={require('../../../assets/bg-img.jpg')} style={{width: 40, height: 40, borderRadius: 50}} />
                        <View style={{marginLeft: 10}}>
                            <Text style={{color: '#003366', fontSize: 18, fontWeight: 'bold'}}>{route.params.name}</Text>
                            <Text style={{color: 'gray', fontSize: 12}}>Agent</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20}}>
                    <View>
                        <Text style={{}}>13 properties</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, borderWidth: 1, width: 80, borderColor: 'lightgray', borderRadius: 10}}>
                        <Ionicons name='arrow-down' size={20} color='#003366' />
                        <Text style={{color: '#003366', fontSize: 15}}>Sort</Text>
                    </View>
                </View>
                <View>
                    <Text style={{color: '#003366', fontSize: 18, fontWeight: '600', paddingHorizontal: 20, paddingTop: 20}}>Available Apartments</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('HostelDetails')} style={{borderWidth: 1, borderColor: 'lightgray', marginHorizontal: 20, marginVertical: 10, borderRadius: 15, width: '90%', padding: 5, backgroundColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 2}}>
                        <Image source={require('../../../assets/bg-img.jpg')} style={{width: '100%', height: 200, borderRadius: 15}} />
                        <View style={{justifyContent: 'space-evenly', marginLeft: 10, marginVertical: 10}}>
                            <Text style={{color: '#003366', fontSize: 20, fontWeight: 'bold'}}>Kayboss Villa</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <Ionicons name='star' size={20} color='#003366' />
                                    <Text style={{color: 'gray', fontSize: 12, marginLeft: 5}}>7.9 (Very good) (1558)</Text>
                                </View>
                                <View style={{marginRight: 10}}>
                                    <Image source={require('../../../assets/bg-img.jpg')} style={{width: 40, height: 40, borderRadius: 50}} />
                                </View>
                            </View>
                            <Text style={{color: 'gray', fontSize: 12}}>Safari, Malete</Text> 
                            <Text style={{color: '#003366', fontSize: 20, fontWeight: '600', textAlign: 'right', marginRight: 10}}>N150,000.00</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('HostelDetails')} style={{borderWidth: 1, borderColor: 'lightgray', marginHorizontal: 20, marginVertical: 10, borderRadius: 15, width: '90%', padding: 5, backgroundColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 2}}>
                        <Image source={require('../../../assets/bg-img.jpg')} style={{width: '100%', height: 200, borderRadius: 15}} />
                        <View style={{justifyContent: 'space-evenly', marginLeft: 10, marginVertical: 10}}>
                            <Text style={{color: '#003366', fontSize: 20, fontWeight: 'bold'}}>Kayboss Villa</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <Ionicons name='star' size={20} color='#003366' />
                                    <Text style={{color: 'gray', fontSize: 12, marginLeft: 5}}>7.9 (Very good) (1558)</Text>
                                </View>
                                <View style={{marginRight: 10}}>
                                    <Image source={require('../../../assets/bg-img.jpg')} style={{width: 40, height: 40, borderRadius: 50}} />
                                </View>
                            </View>
                            <Text style={{color: 'gray', fontSize: 12}}>Safari, Malete</Text> 
                            <Text style={{color: '#003366', fontSize: 20, fontWeight: '600', textAlign: 'right', marginRight: 10}}>N150,000.00</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
