
import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus'; // Adjust path as needed
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
    content: string;
}

const DocumentContent = ({ content }: Props) => {
    const { url } = useAuth();
    const [animationStatus, setAnimationStatus] = useState<'loading' | 'error' | null>('loading');
    const documentUrl = `${url}${content.startsWith('/') ? content : `/${content}`}`;

    const handleAnimationDone = () => {
        setAnimationStatus(null); // Clear error animation
    };

    return (
        <View style={styles.container}>
            {animationStatus ? (
                <View style={styles.animationContainer}>
                    <AnimationStatus
                        status={animationStatus}
                        text={
                            animationStatus === 'loading'
                                ? 'Loading...'
                                : 'Document not found.'
                        }
                        onDone={handleAnimationDone}
                        show={!!animationStatus}
                    />
                </View>
            ) : null}
            <WebView
                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${documentUrl}` }}
                style={[styles.pdf, animationStatus ? { opacity: 0 } : { opacity: 1 }]}
                onLoadStart={() => setAnimationStatus('loading')}
                onLoadEnd={() => setAnimationStatus(null)} // Success or error will override if needed
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('WebView error: ', nativeEvent);
                    setAnimationStatus('error');
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('WebView HTTP error: ', nativeEvent);
                    setAnimationStatus('error');
                }}
            />
        </View>
    );
};

export default DocumentContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width, // Full width
        height: Dimensions.get('window').height * 0.9, // Adjust height
    },
    animationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure animation is above WebView
    },
});
