import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function StudentHomeLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="HomeScreen"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="CoursesScreen"
                options={{
                    title: 'Courses',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="menu-book" color={color} />,
                }}
            />
            <Tabs.Screen
                name="MessageScreen"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="message" color={color} />,
                }}
            />
            <Tabs.Screen
                name="NotionScreen"
                options={{
                    title: 'Notion',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="description" color={color} />,
                }}
            />
            <Tabs.Screen
                name="SettingScreen"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
                }}
            />
        </Tabs>
    );
}