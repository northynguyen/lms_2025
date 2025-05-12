// Trong login.tsx
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Login() {
    return (
        <View>
            <Text>day là cc</Text>
            <Button title="Go to login" onPress={() => router.push('/login')} />
        </View>
    );
}