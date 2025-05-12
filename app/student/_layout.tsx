import { Stack } from 'expo-router';

export default function StudentLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Screens" />
            <Stack.Screen name="Courses" />
            <Stack.Screen name="AllCourse" options={{
                headerShown: true, headerTitle: 'All Courses', headerShadowVisible: false,
            }} />
        </Stack>
    );
}