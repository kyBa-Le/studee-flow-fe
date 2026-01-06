# StudeeFlow Frontend

**StudeeFlow Frontend** is a React-based web application designed for the **Student Progress and Goal Tracking System**. It provides a modern, user-friendly interface for Admins, Teachers, and Students to manage academic progress, set learning goals, and visualize performance data.

## 🚀 Live Demo & Credentials

Check out the live application here: **[StudeeFlow Live Preview](https://studee-flow-fe.vercel.app/)**

To explore the role-based features, you can use the following demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Teacher** | `teacher@example.com` | `password` |
| **Student** | `student@example.com` | `password` |

## Project Purpose

The purpose of this application is to provide a responsive and interactive user interface that allows users to:
* Track student progress effectively.
* Manage academic goals.
* View performance insights through clear data visualization.
* Facilitate role-based workflows for different user types.

## 👥 User Roles

* **Admin:**
    * Manage users and system data.
    * Monitor overall system activity.
* **Teacher:**
    * Track student progress.
    * Manage goals and schedules.
    * Review performance analytics.
* **Student:**
    * View academic progress.
    * Track personal goals and achievements.
    * Review feedback and schedules.

## ⚙️ Installation

### Prerequisites
* **Node.js** (v18 or later recommended)
* **NPM**
* **Laravel Backend API** (must be running locally or remotely)

### Setup Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kyBa-Le/studee-flow-fe
    cd studee-flow-fe
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the project root to configure your backend connection.
    ```env
    REACT_APP_API_BASE_URL=http://localhost:8000/api
    ```

4.  **Start the development server**
    ```bash
    npm start
    ```
    The application will be available at: `http://localhost:3000`

## 📜 Available Scripts

In the project directory, you can run:

* `npm start`: Runs the app in development mode.
* `npm run build`: Builds the app for production to the `build` folder.
* `npm test`: Launches the test runner in interactive watch mode.
* `npm run eject`: **Note:** this is a one-way operation to eject configuration files.