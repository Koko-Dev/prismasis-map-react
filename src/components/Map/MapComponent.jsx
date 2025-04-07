// This is the map component that shows our fantasy world
// We can click on regions like "Sabbia" to zoom in and see more

import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet'; // Leaflet is the map library we're using
import 'leaflet/dist/leaflet.css';

// These are the images for our maps
import mapImg from '../../assets/images/map.png';      // Big world map
import sabbiaImg from '../../assets/images/sabbia.jpg'; // Close-up of Sabbia
import tserysImg from '../../assets/images/tserys.jpeg'; // Close-up of Tserys

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
    // These are your defined areas (update if your conditions change)
    const sabbiaArea = { lngMin: 223, lngMax: 338, latMin: 100, latMax: 171 };
    const tserysArea = { lngMin: 404, lngMax: 566, latMin: 228, latMax: 337 };

    useEffect(() => {
        // Logs the area definitions once when your component mounts
        console.log(`The defined areas for Sabbia are: Longitude between ${sabbiaArea.lngMin}-${sabbiaArea.lngMax}, Latitude between ${sabbiaArea.latMin}-${sabbiaArea.latMax}`);
        console.log(`The defined areas for Tserys are: Longitude between ${tserysArea.lngMin}-${tserysArea.lngMax}, Latitude between ${tserysArea.latMin}-${tserysArea.latMax}`);
    }, []); // Empty dependency array ensures logging only happens once on mount

    useMapEvent('click', (e) => {
        const { lat, lng } = e.latlng;

        console.log(`Clicked coordinates: Latitude=${lat}, Longitude=${lng}`);

        if (mapName === 'main') {
            if (lng > sabbiaArea.lngMin && lng < sabbiaArea.lngMax && lat > sabbiaArea.latMin && lat < sabbiaArea.latMax) {
                console.log('You clicked on Sabbia');
                setMapName('sabbia');
            } else if (lng > tserysArea.lngMin && lng < tserysArea.lngMax && lat > tserysArea.latMin && lat < tserysArea.latMax) {
                console.log('You clicked on Tserys');
                setMapName('tserys');
            } else {
                console.log('You clicked outside defined areas');
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