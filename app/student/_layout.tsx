import { Stack } from 'expo-router';

export default function StudentLayout() {
    return (
        <Stack screenOptions={{}}>
            <Stack.Screen name="Screens" options={{ headerShown: false }} />
            <Stack.Screen name="AllCourse" options={{
                headerShown: true, headerTitle: 'All Courses', headerShadowVisible: false,
            }} />
        </Stack>
    );
}