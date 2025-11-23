# 📑 HeyaFiles Files Manager

## 📖 Overview

This project is a complete full-stack solution designed to demonstrate real-time data synchronization across a central server, a web application, and a mobile application. It allows users to upload, view, and delete documents seamlessly across devices without manual refreshing.

### 🏗️ Architecture Ecosystem

The project consists of three distinct, interconnected applications:

1. **The Backend (Server)**

   - **Framework:** NestJS
   - **Database:** MongoDB (via Mongoose)
   - **Storage:** UploadThing (Cloud file storage)
   - **Role:** Acts as the central API and WebSocket Gateway. It handles CRUD operations and broadcasts `file_added` or `file_deleted` events to all connected clients.

2. **The Web Client (Dashboard)**

   - **Framework:** Next.js 16.0.3 (App Router)
   - **UI Library:** Shadcn/ui + Tailwind CSS
   - **Role:** A modern desktop dashboard for managing files. It listens for WebSocket events to update the UI instantly when changes occur on the server or mobile app.

3. **The Mobile App (Native)**
   - **Framework:** Expo (React Native)
   - **Styling:** NativeWind (Tailwind for Mobile)
   - **Role:** A native iOS/Android application allowing users to upload files from their device storage and view the shared document list in real-time.

### 🔄 The Real-Time Workflow

1. **Action:** A user uploads a image via the Mobile App.
2. **Processing:** The Backend receives the file, sends it to UploadThing, saves metadata to MongoDB, and emits a socket event.
3. **Synchronization:** The Web App (open on a laptop) receives the event and instantly renders the new file card at the top of the list, without a page reload.

🚀 Technology Stack Summary

| Category           | Tech Stack                                  |
| ------------------ | ------------------------------------------- |
| **Core**           | TypeScript, Node.js                         |
| **Server**         | NestJS, Socket.IO, Mongoose                 |
| **Web**            | Next.js, React Hook Form, Zod, Lucide React |
| **Mobile**         | Expo, React Native, NativeWind              |
| **Infrastructure** | MongoDB Atlas, UploadThing                  |
