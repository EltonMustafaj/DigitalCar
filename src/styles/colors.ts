export const colors = {
    // Primary Colors with Gradients
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    primaryGradient: ['#3B82F6', '#2563EB'] as const,

    // Secondary Colors
    secondary: '#8B5CF6',
    secondaryDark: '#7C3AED',
    secondaryLight: '#A78BFA',
    secondaryGradient: ['#8B5CF6', '#7C3AED'] as const,

    // Accent Colors
    accent: '#10B981',
    accentDark: '#059669',
    accentLight: '#34D399',
    accentGradient: ['#10B981', '#059669'] as const,

    // Background Colors
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    backgroundDark: '#0F172A',

    // Card & Surface
    card: '#FFFFFF',
    cardGradient: ['#FFFFFF', '#F8FAFC'] as const,
    surface: '#FFFFFF',

    // Text Colors
    text: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    textDark: '#0F172A',

    // Status Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // UI Elements
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',

    // Overlay & Shadow
    overlay: 'rgba(15, 23, 42, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowMedium: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',

    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.7)',
    glassDark: 'rgba(15, 23, 42, 0.7)',
    glassBlur: 'rgba(255, 255, 255, 0.1)',
};

// Gradient Presets
export const gradients = {
    primary: {
        colors: ['#3B82F6', '#2563EB'] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    secondary: {
        colors: ['#8B5CF6', '#7C3AED'] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    accent: {
        colors: ['#10B981', '#059669'] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    sunset: {
        colors: ['#F59E0B', '#EF4444'] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    ocean: {
        colors: ['#3B82F6', '#8B5CF6'] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    background: {
        colors: ['#F8FAFC', '#E2E8F0'] as const,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },
};

// Shadow Presets
export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    colored: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
};
