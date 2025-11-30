
Real-Time Pair Programming Web Application

*A FastAPI + WebSockets + React-based collaborative coding platform*

---

## 📌 **1. Project Overview**

This project is a **real-time pair-programming web application** that allows two users to collaboratively edit the same code file in a shared room.

Whenever one user types, the other instantly sees the changes.

### 🧩 **What Problem Does It Solve?**

Many coding sessions, online interviews, collaborative debugging, mentoring, require **real-time code sharing**.
Traditional screen-sharing is slow, lacks interaction, and does not allow both people to edit.

This app solves that by enabling:

* Two people to work on the same code simultaneously
* Real-time updates using WebSockets
* AI-style autocomplete suggestions (mocked)

---

## ⚙️ **2. Features**

### ✅ **Room Creation & Joining**

* Create new rooms on the backend (`POST /rooms`)
* Join via URL: `http://localhost:5173/room/<roomId>`
* No authentication required

### ⚡ **Real-Time Collaborative Code Editing**

* WebSocket-based communication (`/ws/<roomId>`)
* Both users see updates instantly
* In-memory + database-backed room state
* Last-write-wins sync strategy

### 🤖 **AI Autocomplete (Mocked)**

* `POST /autocomplete` endpoint
* Accepts `{ code, cursorPosition, language }`
* Returns a static rule-based suggestion
* Triggered after 600ms of idle typing

### 🖥️ **Simple & Clean React UI**

* Minimal, lightweight editor
* Autocomplete hint display
* Room validation and routing

---

## 🏗️ **3. Architecture & Design Choices**

---

## 🧱 **System Architecture Diagram (ASCII)**

```
               ┌─────────────────────────┐
               │         Frontend         │
               │  React + TypeScript      │
               │  Code Editor UI          │
               │  WebSocket Client        │
               └─────────────┬───────────┘
                             │
                             │ WebSocket (bi-directional)
                             ▼
               ┌─────────────────────────┐
               │        Backend          │
               │ FastAPI + WebSockets    │
               │ REST APIs (rooms, AI)   │
               │ Room State Management   │
               └─────────────┬───────────┘
                             │
                             │ PostgreSQL
                             ▼
               ┌─────────────────────────┐
               │      Database Layer     │
               │   Room Code Storage     │
               │   Room Metadata         │
               └─────────────────────────┘
```

---

## 🧠 **Design Choices Explanation**

### **FastAPI**

* Modern, fast Python framework
* Excellent WebSocket support
* Built-in async capability
* Easy to scale & maintain

### **React + TypeScript**

* Component-based UI
* Type safety
* Ideal for real-time UIs
* Easy WebSocket integration

### **WebSockets**

* Required for live collaboration
* Allows instant updates
* Bi-directional communication

### **PostgreSQL**

* Reliable, production-grade DB
* Stores persistent room metadata

---

## 📁 **Folder Structure (Frontend)**

```
frontend/
│── package.json
│── tsconfig.json
└── src/
    │── index.tsx
    │── App.tsx
    │── api.ts
    │── store.ts
    └── features/
        └── room/
            └── Room.tsx
            └── CreateRoom.tsx
```

---

## 🔄 **Data Flow (Step-by-Step)**

### **1. User Opens `/room/<roomId>`**

* Frontend verifies roomId
* Establishes WebSocket connection with backend

### **2. User Starts Typing**

* Editor triggers local updates
* After each keystroke → send full code or diff to WebSocket server

### **3. Backend Broadcasts Update**

* WebSocket server receives update
* Sends the updated code to both connected users
* Updates in-memory state and database

### **4. Autocomplete Flow**

* User stops typing → 600ms timer
* Frontend calls `/autocomplete`
* Backend returns mocked suggestion
* UI displays suggestion below editor

---

## ▶️ **4. How to Run the Project**

Below are **beginner-friendly, step-by-step instructions**.

---

# 🖥️ **4.1 Running the Backend (FastAPI)**

### **1. Move into backend folder**

```sh
cd backend
```

### **2. Create a virtual environment**

```sh
python -m venv venv
```

### **3. Activate environment**

Windows:

```sh
venv\Scripts\activate
```

Mac/Linux:

```sh
source venv/bin/activate
```

### **4. Install dependencies**

```sh
pip install -r requirements.txt
```

### **5. Run the server**

```sh
uvicorn app.main:app --reload
```

Backend should now run at:

➡ **[http://localhost:8000](http://localhost:8000)**

---

# 💻 **4.2 Running the Frontend (React)**

### **1. Move into frontend folder**

```sh
cd frontend
```

### **2. Install packages**

```sh
npm install
```

### **3. Start development server**

```sh
npm run dev
```

Frontend runs at:

➡ **[http://localhost:5173](http://localhost:5173)**

---

## 🔧 **5. Tech Stack**

### **Frontend**

* React
* TypeScript
* Redux Toolkit
* Vite

### **Backend**

* FastAPI
* WebSockets
* Uvicorn

### **Database**

* PostgreSQL

### **Why These?**

* FastAPI = speed + simplicity
* React = best for dynamic real-time UIs
* WebSockets = real-time communication
* PostgreSQL = reliable persistence

---

## 🔁 **6. Project Flow (End-to-End)**

1. User creates a room (`POST /rooms`)
2. Backend returns a roomId (e.g., `a1b2c3d4`)
3. User enters the room URL (`/room/a1b2c3d4`)
4. Frontend establishes a WebSocket connection
5. User types → frontend sends changes → backend broadcasts
6. Both users see updates instantly
7. User pauses → frontend calls `/autocomplete`
8. Backend returns a suggestion
9. Frontend displays it under the editor

---

## ⚠️ **7. Limitations**

* No authentication
* No granular conflict resolution (only last-write-wins)
* No cursor/selection sharing
* AI autocomplete is mocked
* Only supports 2 users per room for now

---

## 🚀 **8. What Could Be Improved (Future Enhancements)**

* Real AI autocomplete (OpenAI, Codex, etc.)
* Multi-user presence indicators
* Display other users' cursors & selections
* Better diff-based syncing
* Real-time chat inside each room
* File system support (multiple files per room)
* User authentication & roles (interviewer, interviewee)
* Voice/video integration

---

## 🏁 **9. Conclusion**

This project demonstrates the real-world implementation of:

* WebSockets
* FastAPI architecture
* React real-time UI
* Database + in-memory hybrid state
* Collaborative live editing systems
