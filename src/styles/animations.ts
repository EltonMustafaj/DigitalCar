import { Animated, Easing } from 'react-native';

// Animation Durations
export const durations = {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
};

// Easing Functions
export const easings = {
    easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
    easeOut: Easing.bezier(0, 0, 0.2, 1),
    easeIn: Easing.bezier(0.4, 0, 1, 1),
    spring: Easing.elastic(1),
};

// Fade Animation
export const fadeIn = (
    animatedValue: Animated.Value,
    duration: number = durations.normal,
    delay: number = 0
) => {
    return Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        easing: easings.easeOut,
        useNativeDriver: true,
    });
};

export const fadeOut = (
    animatedValue: Animated.Value,
    duration: number = durations.normal,
    delay: number = 0
) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: easings.easeIn,
        useNativeDriver: true,
    });
};

// Scale Animation
export const scaleIn = (
    animatedValue: Animated.Value,
    duration: number = durations.normal,
    delay: number = 0
) => {
    return Animated.spring(animatedValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
    });
};

export const scaleOut = (
    animatedValue: Animated.Value,
    duration: number = durations.fast,
    delay: number = 0
) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: easings.easeIn,
        useNativeDriver: true,
    });
};

// Slide Animation
export const slideInUp = (
    animatedValue: Animated.Value,
    duration: number = durations.normal,
    delay: number = 0
) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: easings.easeOut,
        useNativeDriver: true,
    });
};

export const slideInDown = (
    animatedValue: Animated.Value,
    duration: number = durations.normal,
    delay: number = 0
) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: easings.easeOut,
        useNativeDriver: true,
    });
};

// Press Animation
export const pressIn = (animatedValue: Animated.Value) => {
    return Animated.spring(animatedValue, {
        toValue: 0.95,
        friction: 3,
        useNativeDriver: true,
    });
};

export const pressOut = (animatedValue: Animated.Value) => {
    return Animated.spring(animatedValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
    });
};

// Stagger Animation
export const staggerAnimation = (
    animations: Animated.CompositeAnimation[],
    staggerDelay: number = 100
) => {
    return Animated.stagger(staggerDelay, animations);
};

// Sequence Animation
export const sequenceAnimation = (animations: Animated.CompositeAnimation[]) => {
    return Animated.sequence(animations);
};

// Parallel Animation
export const parallelAnimation = (animations: Animated.CompositeAnimation[]) => {
    return Animated.parallel(animations);
};

// Loop Animation
export const loopAnimation = (animation: Animated.CompositeAnimation) => {
    return Animated.loop(animation);
};

// Pulse Animation
export const pulse = (animatedValue: Animated.Value) => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 1000,
                easing: easings.easeInOut,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: easings.easeInOut,
                useNativeDriver: true,
            }),
        ])
    );
};

// Shake Animation
export const shake = (animatedValue: Animated.Value) => {
    return Animated.sequence([
        Animated.timing(animatedValue, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
        }),
    ]);
};
