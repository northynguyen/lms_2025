import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus';
import { DynamicTopTabs } from '@/components/DynamicTopTabs';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Course, Material, Section } from '@/interfaces/Interfaces';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Lessons from './Lesson';
import Overview from './Overview';
import Reviews from './Review';

export default function CourseDetailsLayout() {
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [animationStatus, setAnimationStatus] = useState<'loading' | 'success' | 'error' | null>('loading');
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    const { url, token } = useAuth();
    const navigation = useNavigation();
    const router = useRouter();
    const buttonBackground = useThemeColor({}, 'primary');

    useEffect(() => {
        const fetchCourseAndMaterials = async () => {
            try {
                setAnimationStatus('loading');

                // Fetch course details
                const courseRes = await fetch(`${url}/api/courses/${courseId}`, {
                    headers: {
                        token: `${token}`,
                    },
                });
                if (!courseRes.ok) throw new Error('Failed to fetch course');
                const courseData = await courseRes.json();
                const course: Course = courseData.data;

                // Fetch materials for the course
                const materialsRes = await fetch(`${url}/api/materials/course/${courseId}`, {
                    headers: {
                        token: `${token}`,
                    },
                });
                if (!materialsRes.ok) throw new Error('Failed to fetch materials');
                const materialsData = await materialsRes.json();
                const apiSections = materialsData.data || [];

                // Check enrollment status
                const isEnrolledRes = await fetch(`${url}/api/enrollments/isEnrolled/${courseId}`, {
                    headers: {
                        token: `${token}`,
                    },
                });
                if (!isEnrolledRes.ok) throw new Error('Failed to check enrollment');
                const isEnrolledData = await isEnrolledRes.json();
                setIsEnrolled(isEnrolledData.data || false);

                // Integrate course with sections and materials
                const combinedCourse: Course = integrateCourseWithSections(course, apiSections);
                setCourse(combinedCourse);
                setAnimationStatus(null);
            } catch (err) {
                console.error('Error fetching course or materials:', err);
                setAnimationStatus('error');
            }
        };

        if (courseId && token) {
            fetchCourseAndMaterials();
        }
    }, [courseId, token]);

    useLayoutEffect(() => {
        if (course) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: course.name,
            });
        }
    }, [course, navigation]);

    const handleAnimationDone = () => {
        setAnimationStatus(null);
    };

    const handleEnroll = async () => {
        router.push('/student/payment');
    };
    const handleStudyNow = () => {
        if (
            course &&
            course.sections &&
            course.sections.length > 0 &&
            course.sections[0].courseMaterials &&
            course.sections[0].courseMaterials.length > 0
        ) {
            router.push({
                pathname: '/student/Materials/MaterialDetails',
                params: {
                    materialData: JSON.stringify(course.sections[0].courseMaterials[0]),
                    courseSections: JSON.stringify(course.sections),
                },
            });
        } else {
            Alert.alert('Error', 'No materials found for this course.');
        }
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
        return null;
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
                // onPress={isEnrolled ? handleStudyNow : handleEnroll}
                onPress={handleStudyNow}
                style={[styles.enrollButton, { backgroundColor: buttonBackground }]}
            >
                <Text style={[styles.enrollButtonText, { color: 'white' }]}>
                    {/* {isEnrolled ? 'STUDY NOW' : 'ENROLL NOW'} */}
                    STUDY NOW
                </Text>
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
        courseMaterials: apiSection.courseMaterials?.map(mapApiMaterialToMaterial) || [],
    };
}

function calculateSectionDuration(materials: any[]): number {
    return materials?.reduce((total, mat) => total + (mat.expectedDuration || 0), 0) || 0;
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