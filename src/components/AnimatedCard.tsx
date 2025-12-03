import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { fadeIn, scaleIn, durations } from '../styles/animations';
import { shadows } from '../styles/colors';

interface AnimatedCardProps {
    children: React.ReactNode;
    delay?: number;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    delay = 0,
    style,
    onPress,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            fadeIn(fadeAnim, durations.normal, delay),
            scaleIn(scaleAnim, durations.normal, delay),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.97,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const animatedStyle = {
        opacity: fadeAnim,
        transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) },
        ],
    };

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <Animated.View style={[styles.card, animatedStyle, style]}>
                    {children}
                </Animated.View>
            </TouchableOpacity>
        );
    }

    return (
        <Animated.View style={[styles.card, animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        ...shadows.medium,
    },
});
