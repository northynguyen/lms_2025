import { useAuth } from '@/auth/AuthContext';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const SettingScreen: React.FC = () => {
    const { logout, user } = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User Profile</Text>
            <Button title="Đăng xuất" onPress={logout} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 24, fontWeight: 'bold' },
});

export default SettingScreen;
