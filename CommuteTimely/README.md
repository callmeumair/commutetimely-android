# CommuteTimely

A React Native app built with Expo that helps you plan your commute by calculating the optimal time to leave for your destination.

## Features

- **Home Screen**: Welcome screen with app introduction and "Get Started" button
- **Planner Screen**: Form to input commute details including:
  - Commute mode (Walk, Drive, Bus, Train)
  - Start location
  - Destination
  - Arrival time
- **Result Screen**: Displays calculated leave time with helpful tips

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for screen navigation
- **NativeWind** (Tailwind CSS for React Native) for styling
- **Custom Components** for reusability

## Mock Data

The app currently uses mocked commute duration estimates:
- Walk: 15 minutes
- Drive: 10 minutes
- Bus: 25 minutes
- Train: 20 minutes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CommuteTimely
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running the App

- **iOS Simulator**: Press `i` in the terminal or scan the QR code with Expo Go app
- **Android Emulator**: Press `a` in the terminal or scan the QR code with Expo Go app
- **Web**: Press `w` in the terminal to open in web browser

## Project Structure

```
CommuteTimely/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dropdown.tsx
│   │   └── TimePicker.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── PlannerScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts
│   │   └── nativewind.d.ts
│   └── utils/              # Utility functions
│       └── estimateLeaveTime.ts
├── App.tsx                 # Main app component
├── babel.config.js         # Babel configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── global.css              # Global styles
└── package.json
```

## Components

### Button
A reusable button component with different variants (primary/secondary) and sizes.

### Input
A styled text input component with label and error handling.

### Dropdown
A custom dropdown component for selecting commute modes.

### TimePicker
A custom time picker component with hours, minutes, and AM/PM selection.

## Navigation

The app uses React Navigation with a stack navigator:
- **Home** → **Planner** → **Result**

## Styling

The app uses NativeWind (Tailwind CSS for React Native) for consistent styling across all components.

## Future Enhancements

- Real-time traffic integration
- Google Places Autocomplete for locations
- Weather integration for more accurate estimates
- Save favorite routes
- Push notifications for leave reminders
- Multiple commute options comparison

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 