import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { documentService } from '../services/documentService';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { validateRequired, validateLicensePlate } from '../utils/validation';

interface SetupScreenProps {
    navigation: any;
    onSuccess?: () => void;
    isEditing?: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ navigation, onSuccess, isEditing = false }) => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [idCardUri, setIdCardUri] = useState<string | null>(null);
    const [carRegUri, setCarRegUri] = useState<string | null>(null);
    const [insuranceUri, setInsuranceUri] = useState<string | null>(null);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [parentName, setParentName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [personalId, setPersonalId] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isEditing && user) {
            loadUserData();
        }
    }, [isEditing, user]);

    const loadUserData = async () => {
        if (!user) return;
        setLoading(true);
        const data = await documentService.getDocuments(user.id);
        if (data) {
            setFullName(data.full_name);
            setLicensePlate(data.license_plate);
            setParentName(data.parent_name || '');
            setPhoneNumber(data.phone_number || '');
            setPersonalId(data.personal_id || '');
            setAddress(data.address || '');
        }
        setLoading(false);
    };

    const pickImage = async (
        setter: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        console.log('pickImage called');

        Alert.alert(
            'Zgjidhni Burimin',
            'Si dëshironi të ngarkoni foton?',
            [
                {
                    text: 'Kamera',
                    onPress: async () => {
                        console.log('Camera selected');
                        try {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ['images'],
                                allowsEditing: true,
                                quality: 0.8,
                            });
                            console.log('Camera result:', result.canceled ? 'canceled' : 'success');

                            if (!result.canceled) {
                                setter(result.assets[0].uri);
                            }
                        } catch (e) {
                            console.error('Camera error:', e);
                            Alert.alert('Gabim', 'Nuk mund të hapet kamera.');
                        }
                    },
                },
                {
                    text: 'Galeria',
                    onPress: async () => {
                        console.log('Gallery selected');
                        try {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ['images'],
                                allowsEditing: true,
                                quality: 0.8,
                            });
                            console.log('Gallery result:', result.canceled ? 'canceled' : 'success');

                            if (!result.canceled) {
                                setter(result.assets[0].uri);
                            }
                        } catch (e) {
                            console.error('Gallery error:', e);
                            Alert.alert('Gabim', 'Nuk mund të hapet galeria.');
                        }
                    },
                },
                {
                    text: 'Anulo',
                    style: 'cancel',
                    onPress: () => console.log('Cancel pressed')
                },
            ]
        );
    };

    const handleSave = async () => {
        // Validation
        if (!validateRequired(fullName)) {
            Alert.alert('Gabim', 'Ju lutem shkruani emrin e plotë.');
            return;
        }

        if (!validateLicensePlate(licensePlate)) {
            Alert.alert('Gabim', 'Ju lutem shkruani targën e kerrit.');
            return;
        }

        // If NOT editing, all must be present.
        if (!isEditing && (!idCardUri || !carRegUri || !insuranceUri)) {
            Alert.alert('Gabim', 'Ju lutem ngarkoni të gjitha dokumentet.');
            return;
        }

        if (!user) {
            Alert.alert('Gabim', 'Përdoruesi nuk është i identifikuar.');
            return;
        }

        setLoading(true);

        try {
            // Upload images only if new URI is selected
            let idCardUrl = undefined;
            let carRegUrl = undefined;
            let insuranceUrl = undefined;
            let avatarUrl = undefined;

            if (idCardUri) idCardUrl = await documentService.uploadDocument(user.id, idCardUri, 'id_card');
            if (carRegUri) carRegUrl = await documentService.uploadDocument(user.id, carRegUri, 'car_registration');
            if (insuranceUri) insuranceUrl = await documentService.uploadDocument(user.id, insuranceUri, 'insurance');
            if (avatarUri) avatarUrl = await documentService.uploadDocument(user.id, avatarUri, 'avatar');

            // If editing, preserve existing URLs if not changed
            let finalIdCardUrl = idCardUrl;
            let finalCarRegUrl = carRegUrl;
            let finalInsuranceUrl = insuranceUrl;
            let finalAvatarUrl = avatarUrl;

            if (isEditing) {
                const existingData = await documentService.getDocuments(user.id);
                if (existingData) {
                    finalIdCardUrl = idCardUrl || existingData.id_card_url;
                    finalCarRegUrl = carRegUrl || existingData.car_registration_url;
                    finalInsuranceUrl = insuranceUrl || existingData.insurance_url;
                    finalAvatarUrl = avatarUrl || existingData.avatar_url;
                }
            }

            if (!finalIdCardUrl || !finalCarRegUrl || !finalInsuranceUrl) {
                Alert.alert('Gabim', 'Mungojnë dokumentet kryesore.');
                setLoading(false);
                return;
            }

            // Save metadata
            const { success, error } = await documentService.saveDocumentData(user.id, {
                full_name: fullName,
                license_plate: licensePlate,
                id_card_url: finalIdCardUrl,
                car_registration_url: finalCarRegUrl,
                insurance_url: finalInsuranceUrl,
                avatar_url: finalAvatarUrl,
                parent_name: parentName || undefined,
                phone_number: phoneNumber || undefined,
                personal_id: personalId || undefined,
                address: address || undefined,
            });

            setLoading(false);

            if (!success) {
                console.error('Detailed save error:', error);
                Alert.alert('Gabim', `Dështoi ruajtja e të dhënave: ${error?.message || JSON.stringify(error)}`);
                return;
            }

            Alert.alert(
                'Sukses',
                'Të dhënat u ruajtën me sukses!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (onSuccess) {
                                onSuccess();
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            setLoading(false);
            Alert.alert('Gabim', 'Ndodhi një gabim. Ju lutem provoni përsëri.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{isEditing ? 'Ndrysho Të Dhënat' : 'Regjistroni Dokumentet'}</Text>
                <Text style={styles.subtitle}>{isEditing ? 'Përditësoni informacionet tuaja' : 'Ngarkoni dokumentet tuaja për herë të parë'}</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Emri i Plotë</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ashtu siç është në letërnjoftim"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Targa e Kerrit</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="p.sh. 01-123-AB"
                        value={licensePlate}
                        onChangeText={setLicensePlate}
                        autoCapitalize="characters"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Emri i Prindit</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Emri i prindit (opsionale)"
                        value={parentName}
                        onChangeText={setParentName}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Numri i Telefonit</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="p.sh. 069 123 4567"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Numri Personal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="p.sh. A12345678"
                        value={personalId}
                        onChangeText={setPersonalId}
                        autoCapitalize="characters"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Adresa</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Adresa e banimit (opsionale)"
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        numberOfLines={3}
                        editable={!loading}
                    />

                    <Text style={styles.sectionTitle}>Dokumentet</Text>
                    {isEditing && <Text style={styles.infoText}>Ngarkoni foto vetëm nëse dëshironi t'i ndryshoni</Text>}

                    <DocumentUploadButton
                        title="👤 Foto e Profilit"
                        imageUri={avatarUri}
                        onPress={() => pickImage(setAvatarUri)}
                        disabled={loading}
                    />

                    <DocumentUploadButton
                        title="📷 Letërnjoftimi"
                        imageUri={idCardUri}
                        onPress={() => pickImage(setIdCardUri)}
                        disabled={loading}
                    />

                    <DocumentUploadButton
                        title="📷 Leja e Kerrit"
                        imageUri={carRegUri}
                        onPress={() => pickImage(setCarRegUri)}
                        disabled={loading}
                    />

                    <DocumentUploadButton
                        title="📷 Sigurimi (Polisa)"
                        imageUri={insuranceUri}
                        onPress={() => pickImage(setInsuranceUri)}
                        disabled={loading}
                    />

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>{isEditing ? 'Përditëso' : 'Ruaj Dokumentet'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const DocumentUploadButton: React.FC<{
    title: string;
    imageUri: string | null;
    onPress: () => void;
    disabled: boolean;
}> = ({ title, imageUri, onPress, disabled }) => (
    <TouchableOpacity
        style={styles.uploadButton}
        onPress={onPress}
        disabled={disabled}
    >
        {imageUri ? (
            <View style={styles.uploadedContainer}>
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                <Text style={styles.uploadedText}>✓ {title}</Text>
            </View>
        ) : (
            <Text style={styles.uploadButtonText}>{title}</Text>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: typography['3xl'],
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: typography.base,
        color: colors.textSecondary,
        marginBottom: 32,
    },
    infoText: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: typography.base,
        fontWeight: typography.semibold,
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        fontSize: typography.base,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    sectionTitle: {
        fontSize: typography.xl,
        fontWeight: typography.bold,
        color: colors.text,
        marginBottom: 16,
    },
    uploadButton: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
    },
    uploadButtonText: {
        fontSize: typography.lg,
        color: colors.primary,
        fontWeight: typography.semibold,
    },
    uploadedContainer: {
        alignItems: 'center',
    },
    uploadedImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    uploadedText: {
        fontSize: typography.base,
        color: colors.success,
        fontWeight: typography.semibold,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: typography.lg,
        fontWeight: typography.semibold,
    },
});
