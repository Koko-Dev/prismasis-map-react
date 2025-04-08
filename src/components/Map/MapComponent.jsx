// src/components/Map/MapComponent.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Image imports
import mapImg from '../../assets/images/map.png';
import sabbiaImg from '../../assets/images/sabbia.jpg';
import tserysImg from '../../assets/images/tserys.jpeg';

// Fixes layout bug by invalidating the map size after render
const FixMapRender = () => {
    const map = useMap();

    useEffect(() => {
        const handle = setTimeout(() => {
            map.invalidateSize();
        }, 500); // Slight delay to ensure container is rendered
        return () => clearTimeout(handle);
    }, [map]);

    return null;
};

// Centers and fits the map to the given bounds after the component mounts
const FitMapToBounds = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            const containerSize = map.getSize();
            console.log("🫱 Leaflet container size:", containerSize);

            // First fit to bounds (no padding)
            map.fitBounds(bounds, {
                padding: [0, 0],
                animate: false,
            });

            // After the move is complete, zoom in slightly for better effect
            map.once('moveend', () => {
                const currentZoom = map.getZoom();
                map.setZoom(currentZoom + 0.25); // Can try +1 if you want it tighter
                console.log("🔍 Zoom increased to:", map.getZoom());

            });
        }, 300); // Let layout settle before fitting bounds
    }, [map, bounds]);

    return null;
};

// Handles user interaction with the map for clicking specific regions
const MapClickHandler = ({ setMapName, mapName }) => {
    // Define clickable bounding boxes for map regions (temporary values)
    const sabbiaArea = { lngMin: 223, lngMax: 338, latMin: 100, latMax: 171 };
    const tserysArea = { lngMin: 404, lngMax: 566, latMin: 228, latMax: 337 };

    useEffect(() => {
        // Log the defined clickable areas once on component mount
        console.log(
            `✨ Defined areas for Sabbia: lng ${sabbiaArea.lngMin}-${sabbiaArea.lngMax}, lat ${sabbiaArea.latMin}-${sabbiaArea.latMax}`
        );
        console.log(
            `✨ Defined areas for Tserys: lng ${tserysArea.lngMin}-${tserysArea.lngMax}, lat ${tserysArea.latMin}-${tserysArea.latMax}`
        );
    }, []);

    useMapEvent('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log(`📍 Clicked coordinates: Latitude=${lat}, Longitude=${lng}`); // Very useful for defining clickable zones

        if (mapName === 'main') {
            if (lng > sabbiaArea.lngMin && lng < sabbiaArea.lngMax && lat > sabbiaArea.latMin && lat < sabbiaArea.latMax) {
                console.log('✨ You clicked on Sabbia');
                setMapName('sabbia');
            } else if (lng > tserysArea.lngMin && lng < tserysArea.lngMax && lat > tserysArea.latMin && lat < tserysArea.latMax) {
                console.log('✨ You clicked on Tserys');
                setMapName('tserys');
            } else {
                console.log('❌ You clicked outside defined areas');
            }
        }
    });

    return null;
};

// Main Map Component that switches between different map regions
const MapComponent = () => {
    const [mapName, setMapName] = useState('main'); // Tracks current map view
    const [ready, setReady] = useState(false);     // Only renders Leaflet when container is ready
    const wrapperRef = useRef(null);               // Ref to the wrapper div for size checking

    // This ensures the container has a visible size before rendering the map
    useEffect(() => {
        const checkSize = () => {
            const el = wrapperRef.current;
            if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
                setReady(true); // Trigger rendering of Leaflet map
            } else {
                requestAnimationFrame(checkSize); // Try again next frame
            }
        };
        checkSize();
    }, []);

    // Each map region has an image and its pixel bounds
    const mapSettings = {
        main: {
            image: mapImg,
            bounds: [[0, 0], [3327, 4096]] // full world map dimensions (height x width)
        },
        sabbia: {
            image: sabbiaImg,
            bounds: [[0, 0], [1767, 2048]] // Sabbia province
        },
        tserys: {
            image: tserysImg,
            bounds: [[0, 0], [1587, 2048]] // Tserys province
        }
    };

    const current = mapSettings[mapName]; // Current map settings based on view

    return (
        <div ref={wrapperRef} style={{ height: '100%', width: '100%' }}>
            {ready && (
                <MapContainer
                    crs={L.CRS.Simple}              // Flat projection for image maps
                    bounds={current.bounds}         // Size of the image
                    maxBounds={current.bounds}      // Prevents scrolling beyond image edges
                    minZoom={-2}                    // Allows zooming out
                    maxZoom={2}                     // Reasonable max zoom
                    style={{ height: '100%', width: '100%' }} // Full container size
                >
                    <ImageOverlay url={current.image} bounds={current.bounds} />
                    <MapClickHandler setMapName={setMapName} mapName={mapName} />
                    <FixMapRender />
                    <FitMapToBounds bounds={current.bounds} />
                </MapContainer>
            )}
        </div>
    );
};

export default MapComponent;
