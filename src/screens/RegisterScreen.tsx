import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { colors, shadows } from '../styles/colors';
import { typography } from '../styles/typography';
import { validateEmail, validatePassword } from '../utils/validation';
import { GradientButton } from '../components/GradientButton';
import { fadeIn, slideInUp, durations } from '../styles/animations';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            fadeIn(fadeAnim, durations.slow),
            slideInUp(slideAnim, durations.slow),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Gabim', 'Ju lutem shkruani një email të vlefshëm.');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert('Gabim', 'Fjalëkalimi duhet të jetë të paktën 6 karaktere.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Gabim', 'Fjalëkalimet nuk përputhen.');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password);
        setLoading(false);

        if (error) {
            console.error('Register error:', error);
            Alert.alert('Gabim në Regjistrim', error.message || 'Ndodhi një gabim gjatë regjistrimit.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={[colors.secondary, colors.secondaryDark, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo Section */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                    >
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>📝</Text>
                        </View>
                        <Text style={styles.title}>Krijo Llogari</Text>
                        <Text style={styles.subtitle}>Filloni të menaxhoni dokumentet tuaja</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View
                        style={[
                            styles.formCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    placeholderTextColor={colors.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Fjalëkalimi</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Të paktën 6 karaktere"
                                    placeholderTextColor={colors.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Konfirmo Fjalëkalimin</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Shkruani përsëri fjalëkalimin"
                                    placeholderTextColor={colors.textLight}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            <GradientButton
                                title="Regjistrohu"
                                onPress={handleRegister}
                                loading={loading}
                                gradientColors={[colors.secondary, colors.secondaryDark]}
                                style={styles.registerButton}
                            />

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OSE</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => navigation.navigate('Login')}
                                disabled={loading}
                            >
                                <Text style={styles.loginText}>
                                    Keni llogari? <Text style={styles.loginTextBold}>Hyni</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...shadows.large,
    },
    logoIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: typography['4xl'],
        fontWeight: typography.bold,
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.base,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        ...shadows.large,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: typography.sm,
        fontWeight: typography.semibold,
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        fontSize: typography.base,
        color: colors.text,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    registerButton: {
        marginTop: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: typography.sm,
        color: colors.textSecondary,
        fontWeight: typography.semibold,
    },
    loginButton: {
        padding: 16,
        alignItems: 'center',
    },
    loginText: {
        fontSize: typography.base,
        color: colors.textSecondary,
    },
    loginTextBold: {
        color: colors.secondary,
        fontWeight: typography.bold,
    },
});
