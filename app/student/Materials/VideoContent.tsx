import AnimationStatus from '@/components/AnimationStatus'; // Adjust path as needed
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const VideoContent = ({ content }: { content: string }) => {
    const { width } = useWindowDimensions();
    const theme = useColorScheme() ?? 'light';
    const [animationStatus, setAnimationStatus] = useState<'loading' | 'error' | null>('loading');
    const videoId = getYouTubeVideoId(content);

    if (!videoId) {
        return null;
    }

    const handleAnimationDone = () => {
        setAnimationStatus(null); // Clear error animation
    };

    return (
        <ThemedView style={styles.container}>
            {animationStatus ? (
                <View style={styles.animationContainer}>
                    <AnimationStatus
                        status={animationStatus}
                        text={
                            animationStatus === 'loading'
                                ? 'Đang tải video...'
                                : 'Không tải được video'
                        }
                        onDone={handleAnimationDone}
                        show={!!animationStatus}
                    />
                </View>
            ) : null}
            <YoutubePlayer
                height={(width - 32) * 9 / 16}
                width={width - 32}
                videoId={videoId}
                play={false}
                onReady={() => setAnimationStatus(null)}
                onError={() => setAnimationStatus('error')}
                webViewStyle={{ backgroundColor: Colors[theme].background, opacity: animationStatus ? 0 : 1 }}
                webViewProps={Platform.OS === 'web' ? { forceIframe: true } : {}}
            />
        </ThemedView>
    );
};

export default VideoContent;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    animationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure animation is above YouTube player
    },
});
