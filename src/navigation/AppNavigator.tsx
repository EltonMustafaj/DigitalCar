import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { documentService } from '../services/documentService';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

const TabIcon: React.FC<{ icon: string; color: string }> = ({ icon }) => (
    <Text style={{ fontSize: 24 }}>{icon}</Text>
);

const MainTabs = () => (
    <Tab.Navigator
        id={undefined}
        screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            headerStyle: {
                backgroundColor: colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                title: 'Dokumentet',
                tabBarLabel: 'Dokumentet',
                tabBarIcon: ({ color }) => <TabIcon icon="📄" color={color} />,
            }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                title: 'Profili',
                tabBarLabel: 'Profili',
                tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
            }}
        />
    </Tab.Navigator>
);

const EditDocumentsWrapper = (props: any) => (
    <SetupScreen {...props} isEditing={true} onSuccess={() => props.navigation.goBack()} />
);

const AppStack = () => {
    const { user } = useAuth();
    const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkDocuments();
    }, [user]);

    const checkDocuments = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        const docs = await documentService.getDocuments(user.id);
        setHasDocuments(docs !== null);
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            {hasDocuments ? (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen
                        name="EditDocuments"
                        options={{ title: 'Ndrysho Të Dhënat', headerShown: true }}
                        component={EditDocumentsWrapper}
                    />
                </>
            ) : (
                <Stack.Screen name="Setup" options={{ headerShown: true, title: 'Regjistrimi' }}>
                    {(props) => <SetupScreen {...props} onSuccess={() => setHasDocuments(true)} />}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
};

export const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
