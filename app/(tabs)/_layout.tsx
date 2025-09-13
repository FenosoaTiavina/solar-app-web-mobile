import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme, Platform } from 'react-native';

import { COLORS, SHADOWS, SIZES } from '@/constants/Theme';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const isWeb = Platform.OS === 'web';

    const shadowStyle = SHADOWS[theme];

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS[theme].primary,
                tabBarInactiveTintColor: COLORS[theme].subText,
                tabBarLabelStyle: {
                    fontFamily: 'SpaceMono',
                    fontSize: 12,
                },
                tabBarPosition: isWeb ? 'top' : 'bottom',
                tabBarStyle: [
                    isWeb ? styles.tabBarWeb : styles.tabBarMobile,
                    {
                        backgroundColor: COLORS[theme].card,
                        ...shadowStyle,
                    },
                ],
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tableau de bord',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="manage/index"
                options={{
                    title: 'Consommation',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="power-off" color={color} />,
                }}
            />

            <Tabs.Screen
                name="products/index"
                options={{
                    title: 'Production',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
                }}
            />

            <Tabs.Screen
                name="products/compteur_setup"
                options={{
                    title: 'configuration',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="gears" color={color} />,
                }}
            />

        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarMobile: {
        position: 'absolute',
        bottom: SIZES.padding,
        left: SIZES.padding,
        right: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        height: 60,
    },
    tabBarWeb: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
