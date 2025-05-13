import { useAuth } from '@/auth/AuthContext';
import { DynamicTopTabs } from '@/components/DynamicTopTabs'; // Giả sử bạn lưu file đó ở components
import { Course, Material, Section } from '@/interfaces/Interfaces';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import Lessons from './Lesson';
import Overview from './Overview';
import Reviews from './Review';

export default function CourseDetailsLayout() {
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { url } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCourseAndMaterials = async () => {
            try {
                const res = await fetch(`${url}/api/courses/${courseId}`);
                const data = await res.json();
                const courseData: Course = data.data;

                const matRes = await fetch(`${url}/api/materials/course/${courseId}`);
                const matData = await matRes.json();
                const apiSections = matData.data;

                const combinedCourse: Course = integrateCourseWithSections(courseData, apiSections);
                setCourse(combinedCourse);
            } catch (err) {
                console.error('Error fetching course or materials', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndMaterials();
    }, [courseId]);

    useEffect(() => {
        if (course) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: course.name,
            });
        }
    }, [course, navigation]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.loader}>
                <Text>Course not found</Text>
            </View>
        );
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
});
