import { useAuth } from '@/auth/AuthContext';
import CourseCard from '@/components/CourseCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Course } from '@/interfaces/Interfaces';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    BackHandler,
    FlatList,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

const announcements = [
    { id: '1', title: 'New Course Available: Flutter Fundamentals', date: '3/20/2025' },
    { id: '2', title: 'System Maintenance: March 25th', date: '3/19/2025' },
];

const HomeScreen = () => {
    const { user, url } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [greeting, setGreeting] = useState('');

    const handleAllCourses = () => {
        router.push('/student/AllCourse');
    };

    const handleSearch = () => {
        router.push({ pathname: '/student/AllCourse', params: { autoFocusSearch: 'true' } });

    };

    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning';
            if (hour < 18) return 'Good Afternoon';
            return 'Good Evening';
        };
        setGreeting(getGreeting());
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${url}/api/courses/published`);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data.data.content);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [url]);

    useFocusEffect(
        useCallback(() => {
            const handleBackPress = () => {
                Alert.alert('Confirm Exit', 'Are you sure you want to exit the application?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }, [])
    );

    return (
        <ThemedView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <ThemedView style={styles.header}>
                        <ThemedView>
                            <ThemedText type="default" style={styles.greeting}>
                                {greeting},
                            </ThemedText>
                            <ThemedText type="title" style={styles.username}>
                                {user?.firstName} {user?.lastName}
                            </ThemedText>
                        </ThemedView>
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <IconSymbol name="magnifyingglass" size={28} color="#000" />
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Courses Section */}
                    <ThemedView>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText type="subtitle">New Courses</ThemedText>
                            <TouchableOpacity onPress={handleAllCourses}>
                                <ThemedText type="link">View All <IconSymbol name="chevron.right" size={14} color="#003096" /></ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <FlatList
                            data={courses}
                            horizontal
                            keyExtractor={(item) => item.code}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => <CourseCard course={item} />}
                        />
                    </ThemedView>

                    {/* Announcements Section */}
                    <ThemedView>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText type="subtitle">Announcements</ThemedText>
                            <TouchableOpacity>
                                <ThemedText type="link">View All <IconSymbol name="chevron.right" size={14} color="#003096" /></ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        {announcements.map((item) => (
                            <ThemedView key={item.id} style={styles.announcementCard}>
                                <ThemedText type="defaultSemiBold" style={styles.announcementText}>
                                    {item.title}
                                </ThemedText>
                                <ThemedText type="default" style={styles.announcementDate}>
                                    {item.date}
                                </ThemedText>
                            </ThemedView>
                        ))}
                    </ThemedView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 8,
        flexDirection: 'column',
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    greeting: {
        fontSize: 18,
    },
    username: {
        fontWeight: '500',
    },
    searchButton: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    announcementCard: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    announcementText: {
        color: '#333',
    },
    announcementDate: {
        color: '#666',
    },
});

export default HomeScreen;