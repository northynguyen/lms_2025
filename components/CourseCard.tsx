import { useAuth } from '@/auth/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Course } from '@/interfaces/Interfaces';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, ViewStyle, useColorScheme } from 'react-native';

const CourseCard: React.FC<{ course: Course; customStyle?: ViewStyle }> = ({ course, customStyle }) => {
    const { url } = useAuth();
    const discountedPrice = course.price * (1 - course.discount / 100);
    const colorScheme = useColorScheme();
    const isDarkTheme = colorScheme === 'dark';
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/student/Courses/Index',
            params: { courseId: course.id },
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.courseCard, customStyle]}>
            <ThemedView style={[styles.cardContainer, isDarkTheme && styles.darkBorder]}>
                <Image source={{ uri: `${url}/${course.imageUrl}` }} style={styles.courseImage} />
                <ThemedView style={styles.courseInfo}>
                    <ThemedText
                        type="default"
                        style={[
                            styles.level,
                            course.level === 'Beginner'
                                ? styles.beginnerLevel
                                : course.level === 'Intermediate'
                                    ? styles.mediumLevel
                                    : styles.hardLevel,
                        ]}
                    >
                        {course.level}
                    </ThemedText>
                    <ThemedText
                        type="defaultSemiBold"
                        style={styles.courseName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {course.name} ({course.code})
                    </ThemedText>
                    <ThemedText type="default" style={styles.courseInstructor}>
                        {course.creator.name}
                    </ThemedText>
                    <ThemedText type="default" style={styles.courseDuration}>
                        {course.durationWeeks} weeks
                    </ThemedText>
                </ThemedView>
                {course.discount > 0 ? (
                    <ThemedView style={styles.priceContainer}>
                        <ThemedText type="defaultSemiBold" style={styles.discountedPrice}>
                            ${discountedPrice.toFixed(2)}
                        </ThemedText>
                        <ThemedView style={styles.discountInfo}>
                            <ThemedText type="default" style={styles.oldPrice}>
                                ${course.price}
                            </ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.discountPercent}>
                                -{course.discount}%
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                ) : (
                    <ThemedText type="defaultSemiBold" style={styles.coursePrice}>
                        {course.price > 0 ? `$${course.price} ` : 'Free'}
                    </ThemedText>
                )}
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    courseCard: {
        borderRadius: 20,
        marginRight: 10,
        width: 280,
        marginVertical: 10,
    },
    cardContainer: {
        flexDirection: 'column',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    darkBorder: {
        borderWidth: 1,
        borderColor: '#fff',
    },
    courseImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    courseInfo: {
        flexDirection: 'column',
        gap: 6,
        padding: 10,
    },
    courseName: {
        fontSize: 16,
    },
    courseInstructor: {
        fontSize: 14,
        color: '#666',
    },
    courseDuration: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    discountedPrice: {
        fontSize: 18,
    },
    discountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oldPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        marginRight: 6,
        color: '#666',
    },
    discountPercent: {
        fontSize: 14,
        color: '#d32f2f',
    },
    coursePrice: {
        fontSize: 16,
        padding: 10,
        textAlign: 'right',
    },
    level: {
        fontSize: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
    },
    beginnerLevel: {
        borderWidth: 1,
        borderColor: '#4caf50',
        color: '#4caf50',
    },
    mediumLevel: {
        borderWidth: 1,
        borderColor: '#ff9800',
        color: '#ff9800',
    },
    hardLevel: {
        borderWidth: 1,
        borderColor: '#d32f2f',
        color: '#d32f2f',
    },
});

export default CourseCard;