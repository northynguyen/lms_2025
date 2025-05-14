import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus'; // Adjust path as needed
import { DynamicTopTabs } from '@/components/DynamicTopTabs';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Course, Material, Section } from '@/interfaces/Interfaces';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Lessons from './Lesson';
import Overview from './Overview';
import Reviews from './Review';

export default function CourseDetailsLayout() {
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [animationStatus, setAnimationStatus] = useState<'loading' | 'success' | 'error' | null>('loading');
    const { url } = useAuth();
    const navigation = useNavigation();
    const buttonBackground = useThemeColor({}, 'primary');

    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches course data and associated materials from the API using the courseId.
     * Integrates the fetched course data with its corresponding sections and updates the course state.
     * Handles loading state and logs any errors encountered during the fetch process.
     */
    /*******  ff01968d-6a7c-4cc8-b68a-652af9f3d5d9  *******/
    useEffect(() => {
        const fetchCourseAndMaterials = async () => {
            try {
                setAnimationStatus('loading');
                const res = await fetch(`${url}/api/courses/${courseId}`);
                const data = await res.json();
                const courseData: Course = data.data;

                const matRes = await fetch(`${url}/api/materials/course/${courseId}`);
                const matData = await matRes.json();
                const apiSections = matData.data;

                const combinedCourse: Course = integrateCourseWithSections(courseData, apiSections);
                setCourse(combinedCourse);
                setAnimationStatus(null); // Hide animation on success to show course content
            } catch (err) {
                console.error('Error fetching course or materials', err);
                setAnimationStatus('error');
            }
        };

        fetchCourseAndMaterials();
    }, [courseId]);

    useLayoutEffect(() => {
        if (course) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: course.name,
            });
        }
    }, [course, navigation]);

    const handleAnimationDone = () => {
        setAnimationStatus(null); // Clear animation after error or success
    };

    if (animationStatus) {
        return (
            <View style={styles.loader}>
                <AnimationStatus
                    status={animationStatus}
                    text={
                        animationStatus === 'loading'
                            ? 'Loading...'
                            : animationStatus === 'error'
                                ? 'Course not found.'
                                : 'Success!'
                    }
                    onDone={handleAnimationDone}
                    show={!!animationStatus}
                />
            </View>
        );
    }

    if (!course) {
        return null; // AnimationStatus handles error case, so this should not be reached
    }

    const tabs = [
        {
            name: 'Overview',
            render: () => <Overview course={course} />,
        },
        {
            name: 'Lessons',
            render: () => <Lessons course={course} />,
        },
        {
            name: 'Reviews',
            render: () => <Reviews />,
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: `${url}/${course.imageUrl}` }} style={styles.image} />
            <DynamicTopTabs tabs={tabs} />
            <TouchableOpacity
                onPress={() => {
                    console.log('Enroll Now pressed');
                }}
                style={[styles.enrollButton, { backgroundColor: buttonBackground }]}
            >
                {/* <Text style={[styles.enrollButtonText, { color: 'white' }]}>ENROLL NOW</Text> */}
                <Text style={[styles.enrollButtonText, { color: 'white' }]}>STUDY NOW</Text>
            </TouchableOpacity>
        </View>
    );
}

function mapApiMaterialToMaterial(apiMaterial: any): Material {
    return {
        id: String(apiMaterial.id),
        materialUid: apiMaterial.materialUid,
        category: apiMaterial.category,
        name: apiMaterial.name,
        orderNum: apiMaterial.orderNum,
        title: apiMaterial.title,
        expectedDuration: apiMaterial.expectedDuration,
        contentType: apiMaterial.contentType,
        content: apiMaterial.url || apiMaterial.content || '',
        published: apiMaterial.published,
    };
}

function mapApiSectionToSection(apiSection: any): Section {
    return {
        sectionId: String(apiSection.sectionId),
        sectionName: apiSection.sectionName,
        orderNumber: apiSection.orderNumber,
        duration: calculateSectionDuration(apiSection.courseMaterials),
        courseMaterials: apiSection.courseMaterials.map(mapApiMaterialToMaterial),
    };
}

function calculateSectionDuration(materials: any[]): number {
    return materials.reduce((total, mat) => total + (mat.expectedDuration || 0), 0);
}

function integrateCourseWithSections(course: Course, apiSections: any[]): Course {
    const sections: Section[] = apiSections.map(mapApiSectionToSection);
    return {
        ...course,
        sections,
    };
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enrollButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        zIndex: 100,
    },
    enrollButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
