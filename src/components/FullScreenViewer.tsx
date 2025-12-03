import React from 'react';
import {
    Modal,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

interface FullScreenViewerProps {
    imageUrl: string;
    onClose: () => void;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({
    imageUrl,
    onClose,
}) => {
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>✕ Mbyll</Text>
                </TouchableOpacity>

                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: typography.base,
        fontWeight: typography.semibold,
        color: colors.text,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
