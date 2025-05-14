import { useAuth } from '@/auth/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Material } from '@/interfaces/Interfaces';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AudioContent from './AudioContent';
import DocumentContent from './DocumentContent';
import TextContent from './TextContent';
import VideoContent from './VideoContent';

interface Props {
    material: Material;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const MaterialContent = ({ material, onNext, onPrev, hasNext, hasPrev }: Props) => {
    const navigation = useNavigation();
    const { url } = useAuth();
    console.log(material);

    useLayoutEffect(() => {
        if (material?.name) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: material.name,
            });
        }
    }, [navigation, material?.name]);

    const renderContent = () => {
        switch (material.contentType) {
            case 'TEXT':
                return <TextContent content={material.content} />;
            case 'VIDEO':
                return <VideoContent content={material.content} />;
            case 'AUDIO':
                return <AudioContent content={material.content} />;
            case 'DOCUMENT':
                return <DocumentContent content={material.content} />;
            default:
                return (
                    <ThemedText style={styles.content}>
                        Type content not supported: {material.contentType}
                    </ThemedText>
                );
        }
    };

    return (
        <ThemedView style={styles.container}>
            {renderContent()}
            <View style={styles.navButtons}>
                {hasPrev && (
                    <TouchableOpacity onPress={onPrev}>
                        <ThemedText type="link" style={styles.navLink}>
                            Previous
                        </ThemedText>
                    </TouchableOpacity>
                )}
                {hasNext && (
                    <TouchableOpacity onPress={onNext}>
                        <ThemedText type="link" style={styles.navLink}>
                            Next
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>
        </ThemedView>
    );
};

export default MaterialContent;

const styles = StyleSheet.create({
    container: { flex: 1, paddingBottom: 20 },
    content: {},
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navLink: { textDecorationLine: 'underline', paddingBottom: 16, paddingHorizontal: 16 },
});