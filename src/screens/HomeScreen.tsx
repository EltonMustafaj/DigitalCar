import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Animated,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { documentService } from '../services/documentService';
import { UserDocument } from '../types/document';
import { colors, shadows, gradients } from '../styles/colors';
import { typography } from '../styles/typography';
import { FullScreenViewer } from '../components/FullScreenViewer';
import { AnimatedCard } from '../components/AnimatedCard';
import { fadeIn, slideInUp, durations } from '../styles/animations';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        loadDocuments();
    }, []);

    useEffect(() => {
        if (!loading && documents) {
            Animated.parallel([
                fadeIn(fadeAnim, durations.normal),
                slideInUp(slideAnim, durations.normal),
            ]).start();
        }
    }, [loading, documents]);

    const loadDocuments = async () => {
        if (!user) return;

        setLoading(true);
        const docs = await documentService.getDocuments(user.id);
        setDocuments(docs);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDocuments();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Duke ngarkuar...</Text>
            </View>
        );
    }

    if (!documents) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📄</Text>
                <Text style={styles.emptyText}>Nuk ka dokumente të ruajtura</Text>
                <Text style={styles.emptySubtext}>Shko te profili për të shtuar dokumentet tuaja</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Gradient Header */}
                <LinearGradient
                    colors={gradients.primary.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
                        <View style={styles.licensePlateContainer}>
                            <Text style={styles.licensePlate}>{documents.license_plate}</Text>
                        </View>
                        <Text style={styles.fullName}>{documents.full_name}</Text>
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>✓ Dokumentet e Verifikuara</Text>
                        </View>
                    </Animated.View>
                </LinearGradient>

                {/* Document Cards */}
                <Animated.View
                    style={[
                        styles.documentsContainer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <Text style={styles.sectionTitle}>Dokumentet e Mia</Text>

                    <AnimatedCard
                        delay={0}
                        onPress={() => documents.id_card_url && setSelectedImage(documents.id_card_url)}
                        style={styles.documentCard}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIconContainer}>
                                <Text style={styles.cardIcon}>🪪</Text>
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Letërnjoftimi</Text>
                                <Text style={styles.cardSubtitle}>Dokument Identifikimi</Text>
                            </View>
                        </View>
                        {documents.id_card_url ? (
                            <Image source={{ uri: documents.id_card_url }} style={styles.cardImage} />
                        ) : (
                            <View style={styles.cardPlaceholder}>
                                <Text style={styles.cardPlaceholderText}>Nuk ka foto</Text>
                            </View>
                        )}
                    </AnimatedCard>

                    <AnimatedCard
                        delay={100}
                        onPress={() => documents.car_registration_url && setSelectedImage(documents.car_registration_url)}
                        style={styles.documentCard}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIconContainer}>
                                <Text style={styles.cardIcon}>🚗</Text>
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Leja e Qarkullimit</Text>
                                <Text style={styles.cardSubtitle}>Regjistrim Automjeti</Text>
                            </View>
                        </View>
                        {documents.car_registration_url ? (
                            <Image source={{ uri: documents.car_registration_url }} style={styles.cardImage} />
                        ) : (
                            <View style={styles.cardPlaceholder}>
                                <Text style={styles.cardPlaceholderText}>Nuk ka foto</Text>
                            </View>
                        )}
                    </AnimatedCard>

                    <AnimatedCard
                        delay={200}
                        onPress={() => documents.insurance_url && setSelectedImage(documents.insurance_url)}
                        style={styles.documentCard}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIconContainer}>
                                <Text style={styles.cardIcon}>🛡️</Text>
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Sigurimi (Polisa)</Text>
                                <Text style={styles.cardSubtitle}>Mbrojtje Automjeti</Text>
                            </View>
                        </View>
                        {documents.insurance_url ? (
                            <Image source={{ uri: documents.insurance_url }} style={styles.cardImage} />
                        ) : (
                            <View style={styles.cardPlaceholder}>
                                <Text style={styles.cardPlaceholderText}>Nuk ka foto</Text>
                            </View>
                        )}
                    </AnimatedCard>
                </Animated.View>
            </ScrollView>

            {/* Full Screen Viewer */}
            {selectedImage && (
                <FullScreenViewer
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: typography.base,
        color: colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 32,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: typography.xl,
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: typography.base,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
    },
    licensePlateContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    licensePlate: {
        fontSize: typography['4xl'],
        fontWeight: typography.bold,
        color: '#FFFFFF',
        letterSpacing: 4,
    },
    fullName: {
        fontSize: typography.xl,
        color: '#FFFFFF',
        opacity: 0.95,
        marginBottom: 12,
    },
    headerBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    headerBadgeText: {
        color: '#FFFFFF',
        fontSize: typography.sm,
        fontWeight: typography.semibold,
    },
    documentsContainer: {
        padding: 20,
        marginTop: -20,
    },
    sectionTitle: {
        fontSize: typography.xl,
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    documentCard: {
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardIcon: {
        fontSize: 24,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: typography.lg,
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: typography.sm,
        color: colors.textSecondary,
    },
    cardImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    cardPlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardPlaceholderText: {
        fontSize: typography.base,
        color: colors.textSecondary,
    },
});
