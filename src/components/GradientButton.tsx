import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { colors, shadows } from '../styles/colors';
import { typography } from '../styles/typography';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    gradientColors?: LinearGradientProps['colors'];
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    gradientColors = [colors.primary, colors.primaryDark] as const,
    style,
    textStyle,
    icon,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            activeOpacity={0.9}
        >
            <Animated.View style={[styles.container, animatedStyle, style]}>
                <LinearGradient
                    colors={disabled ? [colors.textLight, colors.textSecondary] as const : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            {icon && <>{icon}</>}
                            <Text style={[styles.text, textStyle]}>{title}</Text>
                        </>
                    )}
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        ...shadows.medium,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        color: '#FFFFFF',
        fontSize: typography.lg,
        fontWeight: typography.bold,
        marginLeft: 8,
    },
});
