# Chattrix – AI Powered Real-Time Chat App

## Features

* ⚡ Real-time messaging using Socket.io
* 🔐 JWT Authentication
* 🟢 Online/Offline status tracking
* 📩 Message delivery & read status
* 🖼️ Image sharing via Cloudinary
* 🤖 AI Smart Reply Suggestions (Gemini API)

## AI Feature

* Context-aware reply suggestions using last 5 messages
* Real-time suggestion delivery

## 🛠️ Tech Stack

* Frontend: React.js, Tailwind CSS
* Backend: Node.js, Express.js
* Database: MongoDB
* Realtime: Socket.io
* AI: Google Gemini API

## ⚙️ Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 🔑 Environment Variables

Create `.env` in server:

```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
CLOUDINARY_URL=your_cloudinary
```

---

## 📌 Future Improvements

* AI suggestions while typing
* Multilingual chat support
* AI emotion detection
* Smart action suggestions

---

## Author

Ansh Srivastava

