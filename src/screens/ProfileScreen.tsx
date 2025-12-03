import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { documentService } from '../services/documentService';
import { useAuth } from '../contexts/AuthContext';
import { colors, shadows, gradients } from '../styles/colors';
import { typography } from '../styles/typography';
import { AnimatedCard } from '../components/AnimatedCard';
import { fadeIn, pulse, durations } from '../styles/animations';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const [userData, setUserData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const avatarScale = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user) loadUserData();
        });
        return unsubscribe;
    }, [navigation, user]);

    useEffect(() => {
        if (userData) {
            fadeIn(fadeAnim, durations.normal).start();
            pulse(avatarScale).start();
        }
    }, [userData]);

    const loadUserData = async () => {
        if (!user) return;
        setLoading(true);
        const data = await documentService.getDocuments(user.id);
        setUserData(data);
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Dil nga Llogaria',
            'Jeni të sigurt që dëshironi të dilni?',
            [
                { text: 'Anulo', style: 'cancel' },
                {
                    text: 'Dil',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={[gradients.ocean.colors[0], gradients.ocean.colors[1]]}
                start={gradients.ocean.start}
                end={gradients.ocean.end}
                style={styles.headerGradient}
            >
                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <Animated.View
                        style={[
                            styles.avatarContainer,
                            { transform: [{ scale: avatarScale }] },
                        ]}
                    >
                        {userData?.avatar_url ? (
                            <Image
                                source={{ uri: userData.avatar_url }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <LinearGradient
                                colors={[colors.primaryLight, colors.primary]}
                                style={styles.avatarPlaceholder}
                            >
                                <Text style={styles.avatarText}>
                                    {userData?.full_name?.charAt(0)?.toUpperCase() || '?'}
                                </Text>
                            </LinearGradient>
                        )}
                    </Animated.View>
                    <Text style={styles.name}>{userData?.full_name || 'Përdorues'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    {userData?.license_plate && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{userData.license_plate}</Text>
                        </View>
                    )}
                </Animated.View>
            </LinearGradient>

            <View style={styles.content}>
                {/* Personal Information Section */}
                {(userData?.parent_name || userData?.phone_number || userData?.personal_id || userData?.address) && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.sectionTitle}>Të Dhënat Personale</Text>
                        <AnimatedCard delay={100} style={styles.infoCard}>
                            {userData?.parent_name && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconContainer}>
                                        <Text style={styles.infoIcon}>👤</Text>
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Emri i Prindit</Text>
                                        <Text style={styles.infoValue}>{userData.parent_name}</Text>
                                    </View>
                                </View>
                            )}
                            {userData?.phone_number && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconContainer}>
                                        <Text style={styles.infoIcon}>📱</Text>
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Telefoni</Text>
                                        <Text style={styles.infoValue}>{userData.phone_number}</Text>
                                    </View>
                                </View>
                            )}
                            {userData?.personal_id && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconContainer}>
                                        <Text style={styles.infoIcon}>🆔</Text>
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Numri Personal</Text>
                                        <Text style={styles.infoValue}>{userData.personal_id}</Text>
                                    </View>
                                </View>
                            )}
                            {userData?.address && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconContainer}>
                                        <Text style={styles.infoIcon}>📍</Text>
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Adresa</Text>
                                        <Text style={styles.infoValue}>{userData.address}</Text>
                                    </View>
                                </View>
                            )}
                        </AnimatedCard>
                    </Animated.View>
                )}

                {/* Document Management Section */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.sectionTitle}>Menaxhimi i Dokumenteve</Text>

                    <AnimatedCard
                        delay={200}
                        onPress={() => navigation.navigate('EditDocuments')}
                        style={styles.menuItem}
                    >
                        <View style={styles.menuIconContainer}>
                            <Text style={styles.menuIcon}>📝</Text>
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Ndrysho Të Dhënat</Text>
                            <Text style={styles.menuSubtitle}>Përditëso dokumentet dhe informacionet</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </AnimatedCard>
                </Animated.View>

                {/* Settings Section */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.sectionTitle}>Cilësimet</Text>

                    <AnimatedCard delay={300} onPress={handleLogout} style={styles.menuItem}>
                        <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
                            <Text style={styles.menuIcon}>🚪</Text>
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={[styles.menuTitle, styles.logoutText]}>Dil nga Llogaria</Text>
                            <Text style={styles.menuSubtitle}>Mbyll sesionin aktual</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </AnimatedCard>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Digital Car Docs v1.0</Text>
                    <Text style={styles.footerSubtext}>Dokumentet tuaja, gjithmonë me ju</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 16,
        ...shadows.large,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: typography.bold,
        color: '#FFFFFF',
    },
    name: {
        fontSize: typography['2xl'],
        fontWeight: typography.bold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    email: {
        fontSize: typography.base,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: typography.base,
        fontWeight: typography.bold,
        letterSpacing: 2,
    },
    content: {
        padding: 20,
        marginTop: -20,
    },
    sectionTitle: {
        fontSize: typography.lg,
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 12,
        marginTop: 8,
        marginLeft: 4,
    },
    infoCard: {
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoIcon: {
        fontSize: 20,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: typography.base,
        color: colors.text,
        fontWeight: typography.semibold,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoutIconContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    menuIcon: {
        fontSize: 24,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: typography.base,
        fontWeight: typography.semibold,
        color: colors.text,
        marginBottom: 2,
    },
    logoutText: {
        color: colors.error,
    },
    menuSubtitle: {
        fontSize: typography.sm,
        color: colors.textSecondary,
    },
    menuArrow: {
        fontSize: 28,
        color: colors.textLight,
        fontWeight: '300',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    footerText: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: typography.xs,
        color: colors.textLight,
    },
});
