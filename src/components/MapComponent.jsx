// MapComponent.jsx
import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapImg from '../assets/images/map.png'; // Adjust the path if necessary

const MapComponent = () => {
    // Define the bounds for the image in [y, x] format.
    // Change these values based on your image's dimensions.
    const bounds = [[0, 0], [600, 800]];

    return (
        <div style={{ height: '600px' }}>
            <MapContainer
                crs={L.CRS.Simple}           // Use simple CRS for a static image
                bounds={bounds}              // Set the bounds from bottom-left to top-right
                style={{ height: '100%', width: '100%' }}
            >
                <ImageOverlay url={mapImg} bounds={bounds} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
