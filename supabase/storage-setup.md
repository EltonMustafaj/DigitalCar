# Supabase Storage Setup Instructions

## Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `documents`
   - **Public bucket**: ✅ Check this (allows authenticated users to access)
   - Click **Create bucket**

## Configure Storage Policies

After creating the bucket, set up Row Level Security policies:

1. Click on the `documents` bucket
2. Go to **Policies** tab
3. Add the following policies:

### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 2: Allow users to view their own documents
```sql
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 3: Allow users to update their own documents
```sql
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 4: Allow users to delete their own documents
```sql
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## File Organization

Files will be organized by user ID:
```
documents/
  └── {user_id}/
      ├── id_card.jpg
      ├── car_registration.jpg
      └── insurance.jpg
```

This structure ensures each user can only access their own documents.
