// src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapImg from '../assets/images/map.png'; // Check the path carefully!

const MapComponent = () => {
    // These bounds represent [y,x] coordinates. Adjust if needed based on your image.
    const bounds = [[0, 0], [600, 800]];

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
                crs={L.CRS.Simple}
                bounds={bounds}
                style={{ height: '100%', width: '100%' }}
            >
                <ImageOverlay url={mapImg} bounds={bounds} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;