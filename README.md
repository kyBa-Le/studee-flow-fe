## 📁 Project Structure – React App
This document explains the structure of the src folder in this React project, clarifying the purpose and sample usage of each subdirectory.

### 📂 assets/
Role:
Contains static resources such as images, fonts, SVGs, and possibly CSS files.

Why We Need It:
Centralizes all static and visual assets for easy management and import across the app.

Sample Structure:

```
assets/
├── images/
│   └── logo.png
├── fonts/
│   └── Roboto-Regular.ttf
└── styles/
    └── global.css
```
Sample Usage:

```
import logo from '../assets/images/logo.png';

<img src={logo} alt="Logo" />
```

### 📂 components/
Houses all the reusable UI and logic building blocks.

### 📁 layouts/
Role:
Defines application layouts used across different pages (e.g., main layout, auth layout).

Why We Need It:
Keeps layout logic reusable and separate from content logic.

Sample Usage:

```
// components/layouts/MainLayout.jsx
const MainLayout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);
```

### 📁 ui/
Role:
Holds low-level UI components like buttons, inputs, modals, etc.

Why We Need It:
Promotes UI consistency and reuse across the application.

Sample Usage:

```
// components/ui/Button.jsx
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
```

### 📁 utils/
Role:
Houses utility/helper components related to rendering logic or state management helpers.

Why We Need It:
Keeps non-visual helpers modular and testable.

Sample Usage:

```
// components/utils/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) =>
  isAuthenticated ? children : <Navigate to="/login" />;
```

### 📂 pages/
Each folder here represents a route/view in the application.

- 📁 Home/ and 📁 Login/
Role:
Contain logic and UI for their respective routes.

Why We Need It:
Encapsulates route-specific logic and makes each page self-contained.

Sample Usage:

```
// pages/Home/index.jsx
const Home = () => (
  <div>
    <h1>Welcome Home!</h1>
    <p>This is the main landing page.</p>
  </div>
);
```

### 📂 routes/
Role:
Defines the routing configuration for the application using react-router-dom.

Why We Need It:
Centralizes route management, making navigation structure easier to modify and maintain.

Sample Usage:

```
// routes/index.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
```

### 📂 services/
Role:
Manages all API calls and external services integrations.

Why We Need It:
Keeps data-fetching logic decoupled from UI for scalability and easier testing.

Sample Usage:

```
// services/authService.js
import axios from 'axios';
```

export const login = (email, password) => 
  axios.post('/api/login', { email, password });
### ✅ Summary
This structure keeps code modular, scalable, and maintainable. Each folder has a clear responsibility, aligning with the Separation of Concerns principle in software development.