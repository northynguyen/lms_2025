import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContextType, User } from '../interfaces/Interfaces';


const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within a AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [url] = useState('https://lms.fsa.io.vn');

    const setAuth = async (newToken: string) => {
        try {
            await AsyncStorage.setItem('authToken', newToken);
            setToken(newToken);

            const response = await fetch(`${url}/api/users/current`, {
                headers: { JWT_TOKEN: `${newToken}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const userData = await response.json();
            setUser(userData.data);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error setting auth:', error);
        }
    };


    // ✅ Xóa token và user khi logout
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                const storedUser = await AsyncStorage.getItem('userData');

                if (storedToken && storedUser) {
                    const parseUser = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(parseUser.data);
                }
            } catch (error) {
                console.error('Error loading auth:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAuth();
    }, []);
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, setAuth, logout, url }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;