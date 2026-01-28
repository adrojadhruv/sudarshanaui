# Sudarshana UI 🌟

> **The Golden Standard for React Components.**
> An advanced, collaborative component library built with the MERN stack.

![Sudarshana UI](https://via.placeholder.com/800x400?text=Sudarshana+UI+Preview) *Add a screenshot here!*

## 🚀 Overview

Sudarshana UI is not just a component library; it's a **collaborative platform** where developers can create, browse, and evolve React components. It features a unique "Collaboration Mode" that allows users to propose changes to existing components, complete with a version-controlled approval workflow.

## ✨ Key Features

*   **🎨 Premium UI/UX:** Built with a "Golden Standard" aesthetic, featuring glassmorphism, responsive grids, and smooth GSAP animations.
*   **🔐 Role-Based Access:** Distinguishes between Guests, Basic Users, Verified Users, and Admins.
*   **🤝 Collaboration Workflow:**
    *   **Propose Changes:** Users can fork and edit components in a dedicated "Collaboration Mode".
    *   **Review System:** Owners and Admins review proposals with a built-in code editor.
    *   **Version Control:** Approved changes automatically bump the component version (e.g., v1.0.0 -> v1.0.1) and archive the previous state.
*   **🛠️ Advanced Editor:**
    *   Live Preview with `iframe` sandboxing.
    *   Validation for JSON-based component definitions.
    *   One-click "Download Package" to export components as `npm` ready packages.
*   **🔍 Explore & Search:** Infinite marquee categories and real-time search filtering.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), GSAP (Animations), Context API (State Management), React Router v6.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose) with complex schemas for `Components`, `Versions`, and `CollaborationRequests`.
*   **Authentication:** JWT-based auth with secure HttpOnly cookies.

## ⚡ Getting Started

### Prerequisites

*   Node.js (v14+)
*   MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/sudarshana.git
    cd sudarshana
    ```

2.  **Install Backend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Configuration

Create a `.env` file in the **root** (backend) directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

### Running the App

1.  **Start the Backend:**
    ```bash
    # From root directory
    npm run dev
    ```

2.  **Start the Frontend:**
    ```bash
    # From frontend directory
    npm run dev
    ```

Visit `http://localhost:5173` to view the app!

## 🛣️ Roadmap

*   [ ] OAuth Integration (GitHub/Google)
*   [ ] Private Components for Teams
*   [ ] CLI Tool for direct component installation

## 👨‍💻 Contributors

*   **Dhruv Adroja** - *Lead Developer*

---

*Made with ❤️ using the MERN Stack.*
