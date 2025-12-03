# 🚨 HAPAT E NEVOJSHËM PARA SE TË STARTOSH APLIKACIONIN

## Problem: Environment Variables janë placeholder

Aktualisht në `.env` file ke:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## ✅ ZGJIDHJA: Merr kredencialet e vërteta nga Supabase

### Hapi 1: Shko te Supabase Dashboard
1. Hap: https://app.supabase.com
2. Kliko në projektin tënd (ose krijo një të ri nëse nuk ke)

### Hapi 2: Merr URL dhe Anon Key
1. Në sidebar, kliko **Settings** (⚙️)
2. Kliko **API**
3. Do të shohësh:
   - **Project URL** - kopjo këtë
   - **anon/public key** - kopjo këtë (jo service_role key!)

### Hapi 3: Përditëso `.env` file
Hap `.env` file dhe zëvendëso me vlerat e vërteta:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...
```

### Hapi 4: Krijo Database dhe Storage (SHUMË E RËNDËSISHME!)

#### A. Krijo Tabelën
1. Në Supabase dashboard, shko te **SQL Editor**
2. Kopjo të gjithë kodin nga `supabase/schema.sql`
3. Paste dhe kliko **Run**

#### B. Krijo Storage Bucket
1. Shko te **Storage**
2. Kliko **New bucket**
3. Emri: `documents`
4. ✅ Check **Public bucket**
5. Kliko **Create**

#### C. Vendos Storage Policies
Shiko udhëzimet e plota në `supabase/storage-setup.md`

### Hapi 5: Restart Expo Server
Pasi të kesh bërë të gjitha këto:

```bash
# Nëse serveri ende po punon, shtyp Ctrl+C për ta ndalur
# Pastaj:
npx expo start
```

---

## 📱 Testimi

Pasi të startojë serveri:
1. Skano QR code me **Expo Go** app
2. Regjistrohu me email/password
3. Ngarko dokumentet

---

## ⚠️ Nëse hasen probleme:

**"Missing Supabase environment variables"**
- Sigurohu që `.env` ka vlera të vërteta (jo placeholder)
- Restart Expo server

**"Upload failed" ose "Save error"**
- Kontrollo që ke krijuar `documents` bucket në Storage
- Kontrollo që ke ekzekutuar SQL schema

**"Row Level Security policy violation"**
- Sigurohu që RLS policies janë krijuar nga `schema.sql`
