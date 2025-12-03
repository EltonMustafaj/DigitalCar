import { supabase } from '../config/supabase';
import { UserDocument, DocumentUploadData, DocumentType } from '../types/document';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const documentService = {
    /**
     * Upload a document image to Supabase Storage
     */
    uploadDocument: async (
        userId: string,
        fileUri: string,
        documentType: DocumentType
    ): Promise<string | null> => {
        try {
            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(fileUri, {
                encoding: 'base64',
            });

            // Determine file extension
            const fileExt = fileUri.split('.').pop() || 'jpg';
            const fileName = `${documentType}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            // Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('documents')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: true, // Replace if exists
                });

            if (error) {
                console.error('Upload error:', error);
                return null;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading document:', error);
            return null;
        }
    },

    /**
     * Save document metadata to database
     */
    saveDocumentData: async (
        userId: string,
        data: DocumentUploadData
    ): Promise<{ success: boolean; error?: any }> => {
        try {
            const { error } = await supabase
                .from('user_documents')
                .upsert({
                    user_id: userId,
                    full_name: data.full_name,
                    license_plate: data.license_plate,
                    id_card_url: data.id_card_url,
                    car_registration_url: data.car_registration_url,
                    insurance_url: data.insurance_url,
                    avatar_url: data.avatar_url,
                    parent_name: data.parent_name,
                    phone_number: data.phone_number,
                    personal_id: data.personal_id,
                    address: data.address,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' });

            if (error) {
                console.error('Save error:', error);
                return { success: false, error };
            }

            return { success: true };
        } catch (error) {
            console.error('Error saving document data:', error);
            return { success: false, error };
        }
    },

    /**
     * Get user documents from database
     */
    getDocuments: async (userId: string): Promise<UserDocument | null> => {
        try {
            const { data, error } = await supabase
                .from('user_documents')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) {
                console.error('Get documents error:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error getting documents:', error);
            return null;
        }
    },

    /**
     * Update a specific document
     */
    updateDocument: async (
        userId: string,
        documentType: DocumentType,
        fileUri: string
    ): Promise<{ success: boolean; error?: any }> => {
        try {
            // Upload new image
            const url = await documentService.uploadDocument(userId, fileUri, documentType);

            if (!url) {
                return { success: false, error: 'Failed to upload image' };
            }

            // Update database
            const fieldName = `${documentType}_url`;
            const { error } = await supabase
                .from('user_documents')
                .update({ [fieldName]: url, updated_at: new Date().toISOString() })
                .eq('user_id', userId);

            if (error) {
                console.error('Update error:', error);
                return { success: false, error };
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating document:', error);
            return { success: false, error };
        }
    },
};
