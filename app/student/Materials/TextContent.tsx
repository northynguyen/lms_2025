import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';

const TextContent = ({ content }: { content: string }) => {
    const { width } = useWindowDimensions();
    const theme = useColorScheme() ?? 'light';

    return (
        <ThemedView style={styles.container}>
            <HTML
                source={{ html: content || '<p>Không có nội dung.</p>' }}
                contentWidth={width}
                baseStyle={{ color: Colors[theme].textSecondary, fontSize: 16 }}
                systemFonts={['System']}
                tagsStyles={{
                    p: { marginBottom: 10 },
                    h1: { fontSize: 24, fontWeight: 'bold' },
                    h2: { fontSize: 20, fontWeight: 'bold' },
                }}
            />
        </ThemedView>
    );
};

export default TextContent;
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});