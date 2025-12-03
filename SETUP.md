# Digital Car Docs - Quick Setup Guide

## Step 1: Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project dashboard at https://app.supabase.com

## Step 2: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and run the SQL from `supabase/schema.sql`

This will create:
- `user_documents` table
- Row Level Security (RLS) policies
- Automatic timestamp triggers

## Step 3: Set Up Supabase Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `documents`
4. Check **Public bucket**
5. Click **Create bucket**

Then set up storage policies by following the instructions in `supabase/storage-setup.md`

## Step 4: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## Step 5: Run the App

```bash
npx expo start
```

Then:
- Scan the QR code with **Expo Go** app on your phone (iOS/Android)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator (Mac only)

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created the `.env` file with correct values
- Restart the Expo server after creating/updating `.env`

### "Upload failed" or "Save error"
- Check that the Supabase Storage bucket `documents` exists
- Verify storage policies are configured correctly
- Check that RLS policies are enabled on `user_documents` table

### TypeScript errors
- Run `npm install --save-dev @types/react @types/react-native` (already done)
- Restart your IDE/editor

## Testing the App

1. **Register**: Create a new account with email/password
2. **Upload Documents**: Add your ID card, car registration, and insurance
3. **View Documents**: See them on the home screen
4. **Full Screen**: Click any document to view full screen
5. **Update**: Go to Profile → "Ndrysho Dokumentet" to update documents
6. **Logout**: Test logout and auto-login

## Security Notes

- The `.env` file is gitignored for security
- Never commit your Supabase credentials to version control
- RLS policies ensure users can only access their own documents
- Files are organized by user ID in Supabase Storage

## Next Steps

- Test the app thoroughly
- Customize colors in `src/styles/colors.ts`
- Add more document types if needed
- Deploy to app stores when ready
