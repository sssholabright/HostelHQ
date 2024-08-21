import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IntroScreen from './SignedOutStack/IntroScreen'
import SignIn from './SignedOutStack/SignIn'
import SignUp from './SignedOutStack/SignUp'
import ForgotPassword from './SignedOutStack/ForgotPassword'
import AgentSignUp from './SignedOutStack/AgentSignUp'
import RegisterTab from './SignedOutStack/RegisterTab'

const Stack = createNativeStackNavigator()

export default function SignedOutStack({navigation}) {
    return (
        <Stack.Navigator initialRouteName='Intro'>
            <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterTab" component={RegisterTab} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="AgentSignUp" component={AgentSignUp} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
        