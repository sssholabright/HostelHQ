import { NavigationContainer } from '@react-navigation/native';
import SignedInStack from './screens/SignedInStack';
import SignedOutStack from './screens/SignedOutStack';
import { StatusBar } from 'react-native';
import { UserProvider, useUser } from './UserContext';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const AppNavigation = () => {
  const { user } = useUser()
  return (
    <NavigationContainer>
      {user ? <SignedInStack /> : <SignedOutStack />}
      <StatusBar barStyle="light-content" backgroundColor={'#003366'} />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  )
}