// This is the map component that shows our fantasy world
// We can click on regions like "Sabbia" to zoom in and see more

import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet'; // Leaflet is the map library we're using
import 'leaflet/dist/leaflet.css';

// These are the images for our maps
import mapImg from '../assets/images/map.png';      // Big world map
import sabbiaImg from '../assets/images/sabbia.jpg'; // Close-up of Sabbia
import tserysImg from '../assets/images/tserys.jpeg'; // Close-up of Tserys

// This fixes a bug where the map doesn't show up right away
const FixMapRender = () => {
    const map = useMap();

    // After the map loads, we tell it to resize itself correctly
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100); // wait 100ms just to be safe
    }, [map]);

    return null;
};

// This lets us click on parts of the map to zoom into a region
const MapClickHandler = ({ setMapName, mapName }) => {
    useMapEvent('click', (e) => {
        const { lat, lng } = e.latlng; // These are the map coordinates we clicked on

        // Only allow clicking on regions when we're on the world map
        if (mapName === 'main') {
            // If we click in the area where Sabbia is...
            if (lng > 180 && lng < 520 && lat > 180 && lat < 420) {
                setMapName('sabbia'); // Show Sabbia map
            }
            // If we click in the area where Tserys is...
            else if (lng > 500 && lng < 600 && lat > 100 && lat < 300) {
                setMapName('tserys'); // Show Tserys map
            }
        }
    });

    return null;
};

const MapComponent = () => {
    // This keeps track of which map we're currently showing
    const [mapName, setMapName] = useState('main'); // Start with the main world map

    // Each map has its image and size (called "bounds")
    const mapSettings = {
        main: {
            image: mapImg,
            bounds: [[0, 0], [600, 800]] // size of the world map
        },
        sabbia: {
            image: sabbiaImg,
            bounds: [[0, 0], [600, 800]] // size of the Sabbia map
        },
        tserys: {
            image: tserysImg,
            bounds: [[0, 0], [600, 800]] // size of the Tserys map
        }
    };

    const current = mapSettings[mapName]; // This is the map we're currently using

    return (
        <div style={{ height: '600px', width: '100%' }}>
            {/* This is the map itself */}
            <MapContainer
                crs={L.CRS.Simple} // We're using a flat map instead of a globe
                bounds={current.bounds}
                style={{ height: '100%', width: '100%' }}
            >
                {/* This shows the map image */}
                <ImageOverlay url={current.image} bounds={current.bounds} />

                {/* This lets us click on the map to zoom in */}
                <MapClickHandler setMapName={setMapName} mapName={mapName} />

                {/* This makes sure the map displays correctly */}
                <FixMapRender />
            </MapContainer>

            {/* Show a back button if we're not on the main map */}
            {mapName !== 'main' && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button onClick={() => setMapName('main')}>🔙 Back to World Map</button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;