import React from 'react';
import ReactDOM from 'react-dom/client';

// First, import CSS files in logical order
import './styles/theme.css';    // 1. Theme (CSS variables)
import './styles/main.css';     // 2. Main global styling
import './styles/modal.css';    // 3. Modal-specific styling

// Then import routing dependencies
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);