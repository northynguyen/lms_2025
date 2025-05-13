import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Course, Material, Section } from '@/interfaces/Interfaces';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface LessonScreenProps {
    course?: Course;
}

const LessonScreen = ({ course }: LessonScreenProps) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const colors = {
        background: useThemeColor({}, 'background'),
        backgroundSecondary: useThemeColor({}, 'backgroundSecondary'),
        textPrimary: useThemeColor({}, 'textPrimary'),
        textSecondary: useThemeColor({}, 'textSecondary'),
        primary: useThemeColor({}, 'primary'),
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleMaterialPress = (material: Material) => {
        // navigation.navigate('MaterialDetails', { materialData: material, courseSections: course?.sections || [] });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };


    const getMaterialIcon = (type: string) => {
        switch (type) {
            case 'ASSIGNMENT':
                return 'list.bullet.clipboard';
            case 'LAB':
                return 'flask.fill';
            case 'LECTURE':
                return 'rectangle.and.pencil.and.ellipsis';
            case 'REFERENCE':
                return 'book';
            case 'ASSESSMENT':
                return 'doc.text';
            default:
                return 'doc';
        }
    };


    const renderSectionItem = ({ item }: { item: Section }) => {
        const isExpanded = expandedSections.includes(item.sectionId);
        const materials = item.courseMaterials || [];

        return (
            <Collapsible title={`Chapter ${item.orderNumber}: ${truncateText(item.sectionName, 28)}`}>
                <FlatList
                    data={materials.sort((a, b) => a.orderNum - b.orderNum)}
                    keyExtractor={(material) => material.id}
                    renderItem={({ item: material }) => (
                        <TouchableOpacity style={styles.materialItem} onPress={() => handleMaterialPress(material)}>
                            <IconSymbol
                                name={getMaterialIcon(material.category)}
                                size={20}
                                color={colors.primary}
                            />
                            <ThemedText>{material.name}</ThemedText>
                        </TouchableOpacity>
                    )}
                />
            </Collapsible>
        );
    };

    if (!course) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={styles.emptyText}>No course data available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {course.sections.length === 0 && (
                <ThemedText style={styles.emptyText}>Can not find lectures</ThemedText>
            )}
            <FlatList
                data={course.sections.sort((a, b) => a.orderNumber - b.orderNumber)}
                keyExtractor={(item) => item.sectionId}
                renderItem={renderSectionItem}
                showsVerticalScrollIndicator={false}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    materialItem: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LessonScreen;

