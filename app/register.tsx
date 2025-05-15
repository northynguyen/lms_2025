import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus';
import { ThemedInput } from '@/components/ThemedInput';
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

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setAuth, url } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');
    const router = useRouter();

    const [errors, setErrors] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
    });

    useFocusEffect(
        useCallback(() => {
            setErrors({
                username: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                email: '',
            });
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

    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'username':
                if (!value || value.length < 4) {
                    error = 'Username must have at least 4 characters.';
                }
                break;
            case 'password':
                if (!value || value.length < 6 || !/\d/.test(value)) {
                    error = 'Password must be at least 6 characters and contain at least one number.';
                }
                break;
            case 'confirmPassword':
                if (value !== password) {
                    error = 'Passwords do not match.';
                }
                break;
            case 'firstName':
                if (!value) {
                    error = 'Please enter your First Name.';
                }
                break;
            case 'lastName':
                if (!value) {
                    error = 'Please enter your Last Name.';
                }
                break;
            case 'email':
                if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                    error = 'Please enter a valid email.';
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
        return error;
    };

    const validateAllFields = () => {
        const newErrors = {
            username: validateField('username', username),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
            firstName: validateField('firstName', firstName),
            lastName: validateField('lastName', lastName),
            email: validateField('email', email),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleRegister = async () => {
        if (!validateAllFields()) return;
        try {
            setStatus('loading');
            setStatusText('Signing up...');
            const response = await fetch(`${url}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, firstName, lastName, email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Sign up failed');
            const { token } = data.data;
            await setAuth(token);
            setStatus('success');
            setStatusText('Sign up successful!');
        } catch (error) {
            setStatus('error');
            const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
            setStatusText(errorMessage);
            Alert.alert('Error', errorMessage);
        }
    };

    const dismissKeyboard = () => Keyboard.dismiss();

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <ThemedText type="title" style={styles.title}>
                            Sign Up
                        </ThemedText>

                        <ThemedInput
                            placeholder="Username"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                validateField('username', text);
                            }}
                            autoCapitalize="none"
                            type="rounded"
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
                                    validateField('password', text);
                                    validateField('confirmPassword', confirmPassword);
                                }}
                                secureTextEntry={!showPassword}
                                type="rounded"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.icon}
                            >
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

                        <ThemedView style={styles.passwordContainer}>
                            <ThemedInput
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    validateField('confirmPassword', text);
                                }}
                                secureTextEntry={!showConfirmPassword}
                                type="rounded"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.icon}
                            >
                                <IconSymbol
                                    name={showConfirmPassword ? 'eye.fill' : 'eye.slash.fill'}
                                    size={24}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </ThemedView>
                        {errors.confirmPassword ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.confirmPassword}
                            </ThemedText>
                        ) : null}

                        <ThemedInput
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                validateField('firstName', text);
                            }}
                            type="rounded"
                        />
                        {errors.firstName ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.firstName}
                            </ThemedText>
                        ) : null}

                        <ThemedInput
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                validateField('lastName', text);
                            }}
                            type="rounded"
                        />
                        {errors.lastName ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.lastName}
                            </ThemedText>
                        ) : null}

                        <ThemedInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                validateField('email', text);
                            }}
                            keyboardType="email-address"
                            type="rounded"
                        />
                        {errors.email ? (
                            <ThemedText type="default" style={styles.error}>
                                {errors.email}
                            </ThemedText>
                        ) : null}

                        <ThemedView style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
                                    SIGN UP
                                </ThemedText>
                            </TouchableOpacity>
                            <ThemedView style={styles.signInContainer}>
                                <ThemedText>Already have an account? </ThemedText>
                                <TouchableOpacity onPress={() => router.push('/login')}>
                                    <ThemedText type="link">Sign In</ThemedText>
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
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 16,
        marginLeft: 8,
    },
    buttonContainer: {
        marginTop: 30,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#003096',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
});