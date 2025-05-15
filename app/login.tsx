import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus';
import { ThemedInput } from '@/components/ThemedInput'; // Import ThemedInput
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, url } = useAuth();
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');
    const router = useRouter();

    const dismissKeyboard = () => Keyboard.dismiss();

    useFocusEffect(
        useCallback(() => {
            setErrors({});
            const handleBackPress = () => {
                Alert.alert('Confirm Exit', 'Are you sure you want to exit the application?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }, [])
    );

    const validateUsername = (value: string) => {
        if (!value || value.length < 4) {
            setErrors((prev) => ({ ...prev, username: 'Username must have at least 4 characters.' }));
        } else {
            setErrors((prev) => ({ ...prev, username: undefined }));
        }
    };

    const validatePassword = (value: string) => {
        if (!value || value.length < 6 || !/\d/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                password: 'Password must be at least 6 characters and contain at least one number.',
            }));
        } else {
            setErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    const isValid = () => !errors.username && !errors.password;

    const handleLogin = async () => {
        dismissKeyboard();
        validateUsername(username);
        validatePassword(password);
        if (!username || !password || !isValid()) return;

        try {
            setStatus('loading');
            setStatusText('Sign in...');

            const response = await fetch(`${url}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rememberMe: true }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            const token = data.data.token;
            await setAuth(token);
            setStatus('success');
            setStatusText('Sign in successful!');
        } catch (error) {
            setStatus('error');
            setStatusText(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <ThemedText type="title" style={styles.title}>
                            Sign In
                        </ThemedText>

                        <ThemedInput
                            placeholder="User name"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                validateUsername(text);
                            }}
                            autoCapitalize="none"
                            type="rounded" // Tùy chỉnh kiểu theo yêu cầu
                        />
                        {errors.username ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.username}
                            </ThemedText>
                        ) : null}

                        <ThemedView style={styles.passwordContainer}>
                            <ThemedInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    validatePassword(text);
                                }}
                                secureTextEntry={!showPassword}
                                type="rounded"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                                <IconSymbol
                                    name={showPassword ? 'eye.fill' : 'eye.slash.fill'}
                                    size={24}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </ThemedView>
                        {errors.password ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.password}
                            </ThemedText>
                        ) : null}

                        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                            <ThemedText type="link" style={styles.forgotPassword}>
                                Forgot password?
                            </ThemedText>
                        </TouchableOpacity>

                        <ThemedView style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
                                    SIGN IN
                                </ThemedText>
                            </TouchableOpacity>
                            <ThemedView style={styles.registerContainer}>
                                <ThemedText>Don't have an account? </ThemedText>
                                <TouchableOpacity onPress={() => router.push('/register')}>
                                    <ThemedText type="link">Sign up here</ThemedText>
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    </ScrollView>
                </TouchableWithoutFeedback>

                <AnimationStatus
                    status={status}
                    text={statusText}
                    onDone={() => setStatus(null)}
                    show={!!status}
                />
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        marginBottom: 40,
        textAlign: 'center',
    },
    error: {
        marginBottom: 15,
        marginTop: 0,
        color: 'red',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        right: 12,
        top: '30%',
    },
    forgotPassword: {
        textAlign: 'right',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 30,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#003096', // Hoặc để màu động tùy theme
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
});
