import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentScreen() {
    const navigation = useNavigation();
    useEffect(
        () => {
            navigation.setOptions({
                headerShown: true,
                headerTitle: "Payment Screen",
            });
        },
        [],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.text}>⭐ This is the Payment Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18 },
});
