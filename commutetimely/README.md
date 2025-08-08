# CommuteTimely

A native Android app for planning commutes with real-time traffic data using Mapbox and Supabase.

## Features

- 🔐 **Authentication**: Secure user authentication with Supabase
- 🗺️ **Maps & Directions**: Real-time traffic data and route planning with Mapbox
- 📍 **Location Search**: Geocoding and reverse geocoding
- ⏰ **Leave Time Calculation**: Smart leave time recommendations
- 🔔 **Notifications**: Background notifications for commute reminders
- 🎨 **Modern UI**: Material3 design with Jetpack Compose

## Tech Stack

- **Language**: Kotlin
- **UI**: Jetpack Compose + Material3
- **Architecture**: MVVM with Clean Architecture
- **Dependency Injection**: Hilt
- **Networking**: Retrofit + OkHttp
- **Maps**: Mapbox Android SDK
- **Backend**: Supabase
- **Security**: EncryptedSharedPreferences
- **Background Work**: WorkManager

## Setup

### Prerequisites

- Android Studio Arctic Fox or later
- Android SDK 34
- Java 17 or later
- Mapbox account and access token
- Supabase project

### Environment Configuration

1. Copy the environment template:
   ```bash
   cp android/env.example android/local.properties
   ```

2. Update `android/local.properties` with your actual credentials:
   ```properties
   sdk.dir=/path/to/your/android/sdk
   
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Mapbox Configuration
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create the following tables in your Supabase database:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  notification_settings JSONB DEFAULT '{"enabled": true, "reminder_minutes": 15, "sound": true, "vibration": true}'::jsonb,
  PRIMARY KEY (id)
);

-- Commute profiles table
CREATE TABLE commute_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_location JSONB NOT NULL,
  destination_location JSONB NOT NULL,
  commute_mode TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commute_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own commute profiles" ON commute_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own commute profiles" ON commute_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own commute profiles" ON commute_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own commute profiles" ON commute_profiles FOR DELETE USING (auth.uid() = user_id);
```

### Mapbox Setup

1. Create a Mapbox account at [mapbox.com](https://mapbox.com)
2. Generate an access token in your account dashboard
3. Add the token to your `local.properties` file

### Build and Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd commutetimely-android
   ```

2. Open the project in Android Studio

3. Sync the project with Gradle files

4. Build and run the app:
   ```bash
   cd CommuteTimely/android
   ./gradlew assembleDebug
   ```

## Project Structure

```
com.umerp.commutetimely/
├── data/                          # Data layer
│   ├── local/                     # Local data sources
│   │   └── TokenStore.kt          # Secure token storage
│   ├── remote/                    # Remote data sources
│   │   ├── SupabaseClient.kt      # Supabase client
│   │   ├── MapboxClient.kt        # Mapbox client
│   │   ├── SupabaseApi.kt         # Supabase API interface
│   │   └── MapboxApi.kt           # Mapbox API interface
│   └── repository/                # Repositories
│       ├── SupabaseRepository.kt  # Supabase repository
│       └── MapboxRepository.kt    # Mapbox repository
├── domain/                        # Domain layer
│   └── model/                     # Domain models
├── ui/                            # UI layer
│   ├── components/                # Reusable components
│   │   └── MapView.kt            # Mapbox map component
│   ├── screens/                   # App screens
│   ├── viewmodels/                # ViewModels
│   └── theme/                     # Material3 theme
└── di/                           # Dependency injection
    └── NetworkModule.kt          # Network configuration
```

## Architecture

The app follows Clean Architecture principles with MVVM pattern:

- **Presentation Layer**: Compose UI + ViewModels
- **Domain Layer**: Use cases + domain models
- **Data Layer**: Repositories + data sources
- **Infrastructure**: Network + local storage

## Security

- API keys are stored in `local.properties` (not committed to git)
- Tokens are encrypted using EncryptedSharedPreferences
- Row Level Security enabled on Supabase tables
- Secure network communication with HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
