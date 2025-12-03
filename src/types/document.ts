export interface UserDocument {
    id: string;
    user_id: string;
    full_name: string;
    license_plate: string;
    id_card_url: string | null;
    car_registration_url: string | null;
    insurance_url: string | null;
    avatar_url?: string | null;
    parent_name?: string | null;
    phone_number?: string | null;
    personal_id?: string | null;
    address?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DocumentUploadData {
    full_name: string;
    license_plate: string;
    id_card_url: string;
    car_registration_url: string;
    insurance_url: string;
    avatar_url?: string;
    parent_name?: string;
    phone_number?: string;
    personal_id?: string;
    address?: string;
}

export type DocumentType = 'id_card' | 'car_registration' | 'insurance' | 'avatar';
