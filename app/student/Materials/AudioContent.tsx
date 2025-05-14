import { useAuth } from '@/auth/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'; // Optional: For gradient background
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const getAudioUrl = (baseUrl: string, content: string): string =>
    content.startsWith('/') ? `${baseUrl}${content}` : `${baseUrl}/${content}`;

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioContent = ({ content }: { content: string }) => {
    const theme = useColorScheme() ?? 'light';
    const { url } = useAuth();
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    const audioUrl = Platform.OS === 'web' ? `${url}${content}` : getAudioUrl(url, content);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: false });
                soundRef.current = sound;
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
                }
                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
                        setIsPlaying(status.isPlaying);
                    }
                });
                setIsLoading(false);
            } catch (e) {
                console.error('Failed to load audio', e);
                setIsLoading(false);
            }
        };

        loadAudio();

        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [audioUrl]);

    const togglePlay = async () => {
        if (!soundRef.current) return;
        isPlaying ? await soundRef.current.pauseAsync() : await soundRef.current.playAsync();
    };

    const seek = async (seconds: number) => {
        if (!soundRef.current) return;
        const newPos = Math.max(0, Math.min(duration, position + seconds));
        await soundRef.current.setPositionAsync(newPos * 1000);
        setPosition(newPos);
    };

    const onSliderChange = async (value: number) => {
        if (!soundRef.current) return;
        setPosition(value);
        await soundRef.current.setPositionAsync(value * 1000);
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors[theme].backgroundCard }]}>
            {isLoading ? (
                <ActivityIndicator size="large" color={Colors[theme].primary} />
            ) : (
                <LinearGradient
                    colors={[Colors[theme].background, Colors[theme].backgroundSecondary]}
                    style={styles.gradientContainer}
                >
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={[styles.controlButton, { backgroundColor: Colors[theme].buttonBackground }]}
                            onPress={() => seek(-10)}
                            activeOpacity={0.7}
                        >
                            <IconSymbol name="backward.fill" size={28} color={Colors[theme].icon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.playButton, { backgroundColor: Colors[theme].primary }]}
                            onPress={togglePlay}
                            activeOpacity={0.7}
                        >
                            <IconSymbol
                                name={isPlaying ? 'pause.fill' : 'play.fill'}
                                size={36}
                                color={Colors[theme].background}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.controlButton, { backgroundColor: Colors[theme].buttonBackground }]}
                            onPress={() => seek(10)}
                            activeOpacity={0.7}
                        >
                            <IconSymbol name="forward.fill" size={28} color={Colors[theme].icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sliderContainer}>
                        <ThemedText style={styles.timeText}>{formatTime(position)}</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onValueChange={onSliderChange}
                            minimumTrackTintColor={Colors[theme].primary}
                            maximumTrackTintColor={Colors[theme].trackBackground}
                            thumbTintColor={Colors[theme].primary}
                        />
                        <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
                    </View>
                </LinearGradient>
            )}
        </View>
    );
};

export default AudioContent;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    gradientContainer: {
        padding: 20,
        borderRadius: 16,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },
    slider: {
        flex: 1,
        height: 40,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.textSecondary,
    },
    thumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    track: {
        height: 6,
        borderRadius: 3,
    },
});