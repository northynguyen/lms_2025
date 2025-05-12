import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Course } from '@/interfaces/Interfaces';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface OverviewProps {
    course?: Course;
}

export default function Overview({ course }: OverviewProps) {
    const [expanded, setExpanded] = useState(false);
    const colors = {
        background: useThemeColor({}, 'background'),
        backgroundSecondary: useThemeColor({}, 'backgroundSecondary'),
        textPrimary: useThemeColor({}, 'textPrimary'),
        textSecondary: useThemeColor({}, 'textSecondary'),
        primary: useThemeColor({}, 'primary'),
    };
    if (!course) {
        return (
            <ThemedView style={{ padding: 16 }}>
                <ThemedText>No course data available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedView style={styles.headerCourse}>
                        <ThemedText type="subtitle" style={styles.title}>
                            {course.name}
                        </ThemedText>
                        <ThemedText style={styles.instructor}>
                            {course.instructor?.name || 'Không rõ'}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.priceView}>
                        <ThemedText style={styles.price}>
                            {course?.discountedPrice ? `${course.discountedPrice} $` : 'Free'}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedView>
                    <ThemedText
                        style={styles.description}
                        numberOfLines={expanded ? undefined : 3}
                    >
                        {course.description || 'No description'}
                    </ThemedText>
                    {course.description && course.description.length > 100 && (
                        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                            <ThemedText type="link" style={styles.readMore}>
                                {expanded ? 'Read Less' : 'Read More'}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                </ThemedView>

                <ThemedView style={styles.benefitsBox}>
                    <ThemedView style={styles.benefitItem}>
                        <IconSymbol name="book" size={18} color={colors.primary} />
                        <ThemedText style={styles.benefitText}>80+ Lectures</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.benefitItem}>
                        <IconSymbol name="tag" size={18} color={colors.primary} />
                        <ThemedText style={styles.benefitText}>
                            {course?.discount ? `${course.discount}% Off` : 'No Discount'}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.benefitItem}>
                        <IconSymbol name="hourglass" size={18} color={colors.primary} />
                        <ThemedText style={styles.benefitText}>
                            {course?.durationWeeks || 'Unknown'} Weeks
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.benefitItem}>
                        <IconSymbol name="checkmark.seal" size={18} color={colors.primary} />
                        <ThemedText style={styles.benefitText}>Certificate</ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedText type="subtitle" style={styles.title}>
                    Skills
                </ThemedText>
                <ThemedView style={styles.tagContainer}>
                    {course.tags?.map((tag, index) => (
                        <ThemedView key={index} style={styles.tag}>
                            <ThemedText style={styles.tagText}>{tag.name}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        flexDirection: 'column',
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerCourse: {
        flexDirection: 'column',
        flex: 2,
        alignItems: 'flex-start',
    },
    title: {
        fontWeight: 'bold',
        color: '#343a40',
    },
    instructor: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    priceView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    benefitsBox: {
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
    },
    benefitItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    readMore: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        rowGap: 10,
    },
    tag: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        fontSize: 14,
    },
});