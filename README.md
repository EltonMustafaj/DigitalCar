# Digital Car Docs

A React Native mobile application that digitizes car documents (ID card, car registration, insurance) for quick and secure access during police stops.

## Features

- 🔐 **Secure Authentication** - Email/password login with auto-login
- 📸 **Document Upload** - Camera or gallery support for uploading documents
- 🏠 **Quick Access** - Clean home screen displaying all documents
- 🔍 **Full-Screen Viewer** - View documents in full screen with zoom
- 👤 **Profile Management** - Update documents and manage account
- ☁️ **Cloud Storage** - Secure storage with Supabase
- 🔒 **Row Level Security** - Users can only access their own documents

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **Supabase** (Authentication + Storage + Database)
- **React Navigation** (Stack + Bottom Tabs)
- **Expo Image Picker** (Camera/Gallery access)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

### 1. Clone and Install

```bash
cd c:\Projekte\DigitalCar
npm install
```

### 2. Configure Supabase

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### B. Set Up Database
1. Go to SQL Editor in Supabase dashboard
2. Run the SQL script from `supabase/schema.sql`

#### C. Set Up Storage
1. Follow instructions in `supabase/storage-setup.md`
2. Create `documents` bucket
3. Configure storage policies

### 3. Environment Variables

Update `.env` file with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the App

```bash
# Start Expo development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'a' for Android emulator
# Or press 'i' for iOS simulator
```

## Project Structure

```
DigitalCar/
├── src/
│   ├── components/         # Reusable components
│   │   └── FullScreenViewer.tsx
│   ├── config/            # Configuration files
│   │   └── supabase.ts
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/          # API services
│   │   └── documentService.ts
│   ├── styles/            # Styling constants
│   │   ├── colors.ts
│   │   └── typography.ts
│   ├── types/             # TypeScript types
│   │   ├── document.ts
│   │   └── env.d.ts
│   └── utils/             # Utility functions
│       └── validation.ts
├── supabase/              # Supabase configuration
│   ├── schema.sql
│   └── storage-setup.md
├── App.tsx                # Root component
├── .env                   # Environment variables
└── package.json
```

## User Flow

1. **First Time User**:
   - Register with email/password
   - Upload documents (ID, car registration, insurance)
   - Documents saved to Supabase

2. **Returning User**:
   - Auto-login (session persisted)
   - View documents on home screen
   - Click document to view full screen

3. **Update Documents**:
   - Go to Profile
   - Click "Ndrysho Dokumentet"
   - Upload new documents (e.g., renewed insurance)

## Security

- **Authentication**: Supabase Auth with email/password
- **Row Level Security (RLS)**: Database policies ensure users only access their own data
- **Storage Policies**: Files organized by user ID with access restrictions
- **Session Management**: Secure session storage with auto-refresh

## Offline Support

- Images are cached after first load
- Initial viewing requires internet connection
- Full offline support would require additional implementation

## License

MIT

## Support

For issues or questions, please contact the development team.
