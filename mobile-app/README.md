# 📱Expo HeyaFile Mobile App

A native mobile application built with **Expo (React Native)** and styled with **NativeWind** (Tailwind CSS).  
It consumes the NestJS API to manage documents in real-time.

## 🚀Features

- **Native Experience**: Smooth iOS and Android experience powered by Expo
- **Modern Styling**: Utility-first styling with NativeWind (Tailwind CSS for React Native)
- **Real-time**: Updates instantly using Socket.IO when documents are added/removed on the web or other devices
- **File Upload**: Supports selecting and uploading files from the device storage
- **Zero Config**: Connects to the public NestJS API (no authentication required)

## 🛠️Tech Stack

- **Framework**: Expo SDK 50+
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **HTTP Client**: Axios
- **Real-time**: socket.io-client
- **File Picker**: expo-document-picker

## ⚙️Installation

### Prerequisites

- Node.js (v18+)
- Expo Go app installed on your physical device (iOS/Android) or an Emulator
- The Backend (NestJS) running on your local machine

### 1. Clone and Install

```bash
# Enter the mobile directory
cd mobile-app

# Install dependencies
npm install
```

### 2. Network Configuration (CRITICAL)

Since the app runs on a physical device or emulator, it **cannot access `localhost`**.  
You **must** use your computer’s local network IP address.

1. Find your local IP
   - Windows → `ipconfig` in the terminal
   - macOS/Linux → `ifconfig` or `ip addr show`

2. Open `src/utils/api.ts`

3. Replace the `LOCAL_IP` constant with your real IP:

```ts
// constants/api.ts
export const API_URL =
  Platform.OS === "android"
    ? "http://LOCAL_API:3002" // ← Replace with your actual IP
    : "http://localhost:3002";
```

### 3. Start the App

```bash
# Clear cache is recommended when using NativeWind
npx expo start --clear
```

- Scan the QR code with Expo Go (Android) or the Camera app (iOS).

- Press a to open on Android Emulator.

- Press i to open on iOS Simulator.

## 📂Project Structure

```tree
mobile-app/
├── .expo/
├── .vscode/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── files/
│       │   ├── [id].tsx
│       │   └── _layout.tsx
│       └── modal.tsx
├── assets/
├── components/
├── constants/
├── └── api.ts
```

### 🔌Socket.IO Integration

The app connects to the backend via WebSocket to receive live updates.

- **Endpoint**: `http://<YOUR_LOCAL_IP>:3002`
- **Events**:
  - `file_added` → Adds the new file card to the FlatList instantly
  - `file_deleted` → Removes the item from the list with smooth animation

### ⚠️Common Issues

- **Network Request Failed**  
  Make sure your phone and computer are on the **same Wi-Fi network**  
  Check that your firewall allows incoming/outgoing connections on **port 3002**

- **Styling Issues** (Tailwind/NativeWind classes not working)  
  Stop the dev server and restart with cache cleared:
  ```bash
  npx expo start --clear
  ```
