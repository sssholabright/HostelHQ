import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        if (initializing) setInitializing(false);   
        return unsubscribe;
    }
    , [user]);

    if (initializing) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => React.useContext(UserContext);