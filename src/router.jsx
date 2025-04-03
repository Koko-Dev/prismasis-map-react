import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Economy from './pages/Economy';
import Lore from './pages/Lore';
// Add additional page imports here as needed...

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'economy', element: <Economy /> },
            { path: 'lore', element: <Lore /> },
            // Add additional routes here
        ],
    },
]);

export default router;