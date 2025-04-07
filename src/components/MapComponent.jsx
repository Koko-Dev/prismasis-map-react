// Import essential libraries and dependencies for React, state management, and Leaflet maps
import React, { useState } from 'react';
import { MapContainer, ImageOverlay, useMapEvent } from 'react-leaflet';
import L from 'leaflet';

// Import map images used in your application
import mapImg from '../assets/images/map.png';
import sabbiaImg from '../assets/images/sabbia.jpg';
import tserysImg from '../assets/images/tserys.jpeg';

// Component handling click events on the Leaflet map
const MapClickHandler = ({ setMapName, mapName }) => {

    // Listen for click events on the map and access coordinates where the click occurred
    useMapEvent('click', (e) => {
        // Destructure latitude (vertical position) and longitude (horizontal position)
        const { lat, lng } = e.latlng;

        // Always log clicked coordinates to console for easy debugging and determining coordinate ranges
        console.log(`🖱️ Clicked at latitude: ${lat}, longitude: ${lng}`);

        if (mapName === 'main') {
            // Checks if clicked coordinates match the region defined for 'Sabbia'
            if (lng >= 180 && lng <= 520 && lat >= 180 && lat <= 420) {
                console.log('✅ Sabbia region clicked. Changing map to Sabbia.');
                setMapName('sabbia'); // Change displayed map to Sabbia region
            }
            // Checks if clicked coordinates match the region defined for 'Tserys'
            else if (lng > 500 && lng < 600 && lat > 100 && lat < 300) {
                console.log('✅ Tserys region clicked. Changing map to Tserys.');
                setMapName('tserys'); // Change displayed map to Tserys region
            }
            // Add more conditions here clearly for other regions if needed
            else {
                console.log('⚠️ Click did not match any defined region.');
            }
        } else {
            console.log('ℹ️ You are on a sub-region map. Click "Back to World Map" to return.');
        }
    });

    return null; // This intentionally returns null because it's a handler (it doesn't render JSX itself)
};

// Helper component to address rendering issues in Leaflet (such as forcing map resize on load)
const FixMapRender = () => {
    const map = useMapEvent('load', () => {
        // Wait for 100ms after map load event, then re-render the bounds ensuring proper display
        setTimeout(() => map.invalidateSize(), 100);
    });
    return null;
};

// Main component that renders your clickable interactive world map
const MapComponent = () => {
    // Using state hook for keeping track of currently active map ("main", "sabbia", "tserys", etc.)
    const [mapName, setMapName] = useState('main');

    // Map settings object: clearly defines each map name with its corresponding image and bounds dimensions
    const mapSettings = {
        main: { image: mapImg, bounds: [[0, 0], [600, 800]] }, // Main world map settings
        sabbia: { image: sabbiaImg, bounds: [[0, 0], [600, 800]] }, // Sabbia map settings
        tserys: { image: tserysImg, bounds: [[0, 0], [600, 800]] }, // Tserys map settings
    };

    // Current settings based on active map name in state
    const current = mapSettings[mapName];

    return (
        <div style={{ height: '600px', width: '100%' }}>
            {/* MapContainer component from react-leaflet houses the interactive map logic */}
            <MapContainer
                crs={L.CRS.Simple} // Use simple coordinate reference for non-geographic maps like video game or hand-drawn maps
                bounds={current.bounds} // Sets dimensions exactly matching your uploaded image
                style={{ height: '100%', width: '100%', cursor: 'crosshair' }} // cursor: 'crosshair' clearly gives a precise pointer for debugging coordinates
            >

                {/* Overlays the map image onto the Leaflet Map to visualize the current region */}
                <ImageOverlay
                    url={current.image} // URL of the current region's image as defined above in mapSettings
                    bounds={current.bounds} // Set boundaries clearly matching the image (top-left and bottom-right corners)
                />

                {/* Component handling clicks and triggering map switch according to clicked coordinates */}
                <MapClickHandler setMapName={setMapName} mapName={mapName} />

                {/* Ensures map display accuracy on load or resizing events. */}
                <FixMapRender />

            </MapContainer>

            {/* Conditionally render a "Back to World Map" button clearly shown when viewing any sub-region */}
            {mapName !== 'main' && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button onClick={() => {
                        console.log('🔙 Button clicked, going back to main world map.');
                        setMapName('main');
                    }}>
                        🔙 Back to World Map
                    </button>
                </div>
            )}
        </div>
    );
};

// Export your fully described and functional map component for importing and usage throughout your React application
export default MapComponent;