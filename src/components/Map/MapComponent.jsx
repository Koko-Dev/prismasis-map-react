// src/components/Map/MapComponent.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Image imports
import mapImg from '../../assets/images/map.png';
import sabbiaImg from '../../assets/images/sabbia.jpg';
import tserysImg from '../../assets/images/tserys.jpeg';

// Fixes layout bug by forcing the map to redraw after rendering
const FixMapRender = () => {
    const map = useMap();

    useEffect(() => {
        const handle = setTimeout(() => {
            map.invalidateSize();
        }, 500);
        return () => clearTimeout(handle);
    }, [map]);

    return null;
};

// Dynamically fits the image to screen by calculating optimal zoom level
const FitMapToBounds = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
        const containerSize = map.getSize();
        const imageHeight = bounds[1][0]; // Y (height in pixels)
        const imageWidth = bounds[1][1];  // X (width in pixels)

        const heightRatio = containerSize.y / imageHeight;
        const widthRatio = containerSize.x / imageWidth;
        const optimalZoom = Math.min(heightRatio, widthRatio);

        console.log("📐 Container size:", containerSize);
        console.log("🖼️ Image size:", imageWidth, imageHeight);
        console.log("🧮 Calculated optimal ratio:", optimalZoom);

        const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
        const centerLng = (bounds[0][1] + bounds[1][1]) / 2;

        map.setView([centerLat, centerLng], map.getMinZoom());

        setTimeout(() => {
            const screenWidth = window.innerWidth;

            // Refined Zoom Levels (scaled down by ~0.25 from earlier version)
            const zoomAdjustment =
                screenWidth >= 2560 ? 1.25 :
                    screenWidth >= 1920 ? 1.0 :
                        screenWidth >= 1440 ? 0.75 :
                            screenWidth >= 1024 ? 0.5 :
                                0.25;

            map.setZoom(map.getZoom() + zoomAdjustment);
            console.log(`🖥️ Screen width: ${screenWidth}, Zoom bump applied: ${zoomAdjustment}`);
        }, 300);
    }, [map, bounds]);

    return null;
};

// Handles region clicking logic
const MapClickHandler = ({ setMapName, mapName }) => {
    // Bounding boxes for clickable areas on the full map
    const sabbiaArea = { lngMin: 1032.4220, lngMax: 1812.6047, latMin: 541.8183, latMax: 956.8879 };
    const tserysArea = { lngMin: 2056.6681, lngMax: 2880.8661, latMin: 1272.7888, latMax: 1920.5857 };

    useEffect(() => {
        console.log(
            `✨ Defined areas for Sabbia: lng ${sabbiaArea.lngMin}-${sabbiaArea.lngMax}, lat ${sabbiaArea.latMin}-${sabbiaArea.latMax}`
        );
        console.log(
            `✨ Defined areas for Tserys: lng ${tserysArea.lngMin}-${tserysArea.lngMax}, lat ${tserysArea.latMin}-${tserysArea.latMax}`
        );
    }, []);

    useMapEvent('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log(`📍 Clicked coordinates: Latitude=${lat}, Longitude=${lng}`);

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

// Main Map Component that manages which image is shown
const MapComponent = () => {
    const [mapName, setMapName] = useState('main');      // Which map to show
    const [ready, setReady] = useState(false);           // Flag for when container is ready
    const wrapperRef = useRef(null);                     // Ref to container

    // Wait until the container is rendered and has measurable size
    useEffect(() => {
        const checkSize = () => {
            const el = wrapperRef.current;
            if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
                setReady(true);
            } else {
                requestAnimationFrame(checkSize);
            }
        };
        checkSize();
    }, []);

    // Settings for each map region
    const mapSettings = {
        main: {
            image: mapImg,
            bounds: [[0, 0], [3327, 4096]]
        },
        sabbia: {
            image: sabbiaImg,
            bounds: [[0, 0], [1767, 2048]]
        },
        tserys: {
            image: tserysImg,
            bounds: [[0, 0], [1587, 2048]]
        }
    };

    const current = mapSettings[mapName];

    return (
        <div
            ref={wrapperRef}
            style={{
                height: '100vh',
                width: '100vw',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {ready && (
                <MapContainer
                    crs={L.CRS.Simple}
                    bounds={current.bounds}
                    maxBounds={current.bounds}
                    minZoom={-2}
                    maxZoom={2}
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                >
                    <ImageOverlay url={current.image} bounds={current.bounds} />
                    <MapClickHandler setMapName={setMapName} mapName={mapName} />
                    <FixMapRender />
                    <FitMapToBounds bounds={current.bounds} />
                </MapContainer>
            )}

            {/* Only show the "Back to World Map" button if zoomed into a region */}
            {mapName !== 'main' && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
                    <button
                        onClick={() => setMapName('main')}
                        style={{
                            padding: '10px 15px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            backgroundColor: '#eee',
                            border: '1px solid #aaa'
                        }}
                    >
                        🔙 Back to World Map
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;