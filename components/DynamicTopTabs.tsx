import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

const TopTab = createMaterialTopTabNavigator();

type TabItem = {
    name: string;
    render: () => React.ReactNode;
    options?: object;
};

type DynamicTopTabsProps = {
    tabs: TabItem[];
    screenOptions?: object;
};

export function DynamicTopTabs({ tabs, screenOptions }: DynamicTopTabsProps) {
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007aff',
                tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
                tabBarIndicatorStyle: { backgroundColor: '#007aff' },
                tabBarScrollEnabled: false,
                ...screenOptions,
            }}
        >
            {tabs.map((tab, index) => (
                <TopTab.Screen
                    key={index}
                    name={tab.name}
                    children={tab.render}
                    options={tab.options}
                />
            ))}
        </TopTab.Navigator>
    );
}
