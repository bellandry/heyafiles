💻 Next.js HeyaFiles Web-app

A modern frontend application built with Next.js 16.0.3 (App Router) and Shadcn/ui, serving as a dashboard to manage files in real-time.

## 🚀 Features

- **Modern UI:** Clean and accessible interface designed with Shadcn/ui and Tailwind CSS.
- **Real-time Updates:** List automatically refreshes when users (Web or Mobile) add or delete files via Socket.IO.
- **Robust Forms:** Form handling and validation using React Hook Form and Zod.
- **File Upload:** Drag-and-drop style file selection and upload to the backend.
- **Responsive:** Optimized for desktop and tablet usage.

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Forms:** React Hook Form + Zod
- **Real-time:** Socket.io-client
- **HTTP Client:** Axios

## ⚙️ Installation

**Prerequisites**

- Node.js (v18+)
- The Backend (NestJS) running on port 3000

1. **Clone and Install**

```bash
# Enter the client directory
cd frontend

# Install dependencies
npm install
```

2. **Configuration**

By default, the application connects to `http://localhost:3000`.
If you need to change this, check `src/app/page.tsx` or configure Environment Variables (optional setup required in code).

3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or `3001` if the port is not free).

## 📂 Project Structure

```tree
src/
├── app/
│   ├── page.tsx               # Main Dashboard Page (Socket.IO logic here)
│   └── layout.tsx             # Root Layout
│   └── files/                  # Root Layout
|       └── [id]/
|           └──page.tsx         # display single file with all informations
├── components/
│   ├── ui/                     # Shadcn reusable components (Button, Card, Input...)
│       ├── confirm-dialog.tsx   # Confirmation dialog for deletion
│       ├── file-card.tsx        # Displays a single files item
│       ├── file-gallery.tsx    # Displays images in gallery mode
│       ├── file-upload.tsx     # Zod-validated Upload Form
│       └── search-input.tsx    # Searchbar for image browsing
├── lib/
│   └── utils.ts               # Tailwind class merger utility
└── types/
    └── file.ts                # TypeScript interfaces
```

## 🔌 Socket.IO Integration

The frontend uses `socket.io-client` to listen for events broadcasted by the NestJS backend.

- Connection: Connects to the backend URL (e.g., `http://localhost:3000`).

- Listeners:

  - `file_added`: Appends the new document to the top of the list instantly.
  - `file_deleted`: Removes the document from the list instantly without refreshing.

## 🎨 UI Components (Shadcn)

This project uses the following Shadcn components (installed in components/ui):

- `Button`
- `Card`
- `Input`
- `Label`
- `Form` (React Hook Form wrapper)
- `Toast` (Optional)

To add more components:

```bash
npx shadcn@latest add [component-name]
```
