// src/App.jsx
import React from 'react';
import MapComponent from './components/Map/MapComponent';

export default function App() {
    return (
        <div id="main" style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
            {/* Floating title */}
            <h1 style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                color: '#fdf8e4',
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: '2.5rem',
                textShadow: '0 0 8px #000',
                margin: 0,
                padding: 0
            }}>
                Prismasis Pausalis
            </h1>

            {/* The full map */}
            <MapComponent />
        </div>
    );
}