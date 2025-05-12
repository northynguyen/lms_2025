import { useAuth } from '@/auth/AuthContext';
import AnimationStatus from '@/components/AnimationStatus';
import CourseCard from '@/components/CourseCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Course } from '@/interfaces/Interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const filters = ["All", "Beginner", "Intermediate", "Advance"];

export default function AllCourse() {
    const { url, token, user } = useAuth();
    const colorScheme = useColorScheme();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');
    const searchInputRef = useRef<TextInput>(null);
    const { autoFocusSearch } = useLocalSearchParams();
    useFocusEffect(
        useCallback(() => {
            setStatus('loading');
            setStatusText('Loading...');
            const fetchCourses = async () => {
                try {
                    const response = await fetch(`${url}/api/courses/published`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': `${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch courses');
                    }

                    const data = await response.json();
                    setCourses(data.data.content);
                    setStatus(null);
                } catch (error) {
                    console.error('Error fetching courses:', error);
                    setStatus('error');
                    setStatusText('Failed to load courses');
                }
            };

            fetchCourses();
        }, [url, token])
    );
    useEffect(() => {
        if (autoFocusSearch === 'true' && searchInputRef.current) {
            const timeout = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 300); // delay 300ms
            return () => clearTimeout(timeout);
        }
    }, [autoFocusSearch]);
    const filteredCourses = courses.filter((course) => {
        const matchQuery = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLevel = selectedFilter === "All" || course.level === selectedFilter;
        return matchQuery && matchLevel;
    });


    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <IconSymbol name="magnifyingglass" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    <TextInput
                        ref={searchInputRef}
                        style={styles.searchInput}
                        placeholder="Search courses"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <FlatList
                    data={filters}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterButton, selectedFilter === item && styles.selectedFilter]}
                            onPress={() => setSelectedFilter(item)}
                        >
                            <ThemedText
                                style={[styles.filterText, selectedFilter === item && styles.selectedFilterText]}
                            >
                                {item}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.cardCourses}>
                <AnimationStatus
                    status={status}
                    text={statusText}
                    onDone={() => setStatus(null)}
                    show={!!status}
                />
                {courses.length === 0 ? (
                    <ThemedText style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
                        You have not enrolled in any courses.
                    </ThemedText>
                ) : filteredCourses.length === 0 ? (
                    <ThemedText style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
                        No matching courses found.
                    </ThemedText>
                ) : (
                    <FlatList
                        data={filteredCourses}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity >
                                <CourseCard
                                    course={item}
                                    customStyle={{ marginBottom: 10, width: "100%" }}
                                />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', gap: 20 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    selectedFilter: {
        backgroundColor: "#FFEDE3",
    },
    filterText: {
        fontSize: 14,
        color: "#666",
    },
    selectedFilterText: {
        color: "#FF6600",
        fontWeight: "bold",
    },
    cardCourses: { flex: 1, padding: 16 },
    header: { flexDirection: 'column', gap: 10, alignItems: 'center' },
});

