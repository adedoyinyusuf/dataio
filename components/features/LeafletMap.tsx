'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZONE_STATES, ZONES } from '@/lib/constants';

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png', // We might not have these, but we don't need markers for chloropleth
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

interface LeafletMapProps {
    zonalData: number[];
    stateData?: { state: string, value: number }[];
    unit?: string;
}

export default function LeafletMap({ zonalData, stateData = [], unit = '%' }: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        console.log('Initializing Leaflet Map...');

        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            minZoom: 5,
            maxZoom: 10,
            attributionControl: false
        }).setView([9.08, 8.68], 6);

        // Add Zoom Control
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;

        // Load GeoJSON
        fetch('/data/nigeria_states.geojson')
            .then(res => {
                if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                // Safety check: verify map is still initialized
                if (!mapInstanceRef.current) return;

                console.log('GeoJSON Loaded');

                // create scale helper
                const updateStyle = (feature: any) => {
                    // We need to resolve values here. But 'zonalData' is in outer scope.
                    // We'll rely on the separate update effect to set styles initially too.
                    return {
                        fillColor: '#cbd5e1',
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                };

                const layer = L.geoJSON(data, {
                    style: updateStyle,
                    onEachFeature: (feature, layer) => {
                        layer.on({
                            mouseover: (e) => {
                                const l = e.target;
                                l.setStyle({
                                    weight: 2,
                                    color: '#666',
                                    dashArray: '',
                                    fillOpacity: 1
                                });
                                l.bringToFront();
                            },
                            mouseout: (e) => {
                                const l = e.target;
                                // Reset to base style (properties that change on hover)
                                // We don't touch fillColor so it stays data-driven
                                l.setStyle({
                                    weight: 1,
                                    color: 'white',
                                    dashArray: '3',
                                    fillOpacity: 0.8
                                });
                            }
                        });
                    }
                }).addTo(mapInstanceRef.current); // Use ref current to be safe

                geoJsonLayerRef.current = layer;
                setMapReady(true);

                // Remove loading generic
                // fit bounds
                // map.fitBounds(layer.getBounds());
            })
            .catch(err => {
                console.error('Failed to load GeoJSON:', err);
                if (mapContainerRef.current) {
                    mapContainerRef.current.innerHTML = `<div class="p-4 text-red-500">Error loading map data: ${err.message}</div>`;
                }
            });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update Data / Styles
    useEffect(() => {
        if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;

        // Ensure at least one data source exists (zonalData is required prop so unlikely null, but check)
        if (!zonalData && (!stateData || stateData.length === 0)) return;

        console.log('LeafletMap: Updating data', { zonalData, stateData, mapReady });

        // Calculate max for scale - combine datasets? 
        // Use stateData if available for scale, else zonal
        let validValues: number[] = [];
        if (stateData && stateData.length > 0) {
            validValues = stateData.map(d => Number(d.value)).filter(v => !isNaN(v));
        } else {
            validValues = zonalData.filter(v => typeof v === 'number');
        }

        const maxVal = Math.max(...validValues) || 100;
        const minVal = Math.min(...validValues) || 0;

        const getColor = (d: number | null) => {
            if (d === null || d === undefined) return '#e5e7eb';
            const range = maxVal - minVal;
            const ratio = range === 0 ? 1 : (d - minVal) / range;

            if (ratio > 0.8) return '#14532d';
            if (ratio > 0.6) return '#15803d';
            if (ratio > 0.4) return '#22c55e';
            if (ratio > 0.2) return '#86efac';
            return '#dcfce7';
        };

        // Helper to flatten all valid state names for quick lookup
        const ALL_STATES = Object.values(ZONE_STATES).flat().map(s => s.toLowerCase());

        const findStateInProperties = (props: any): string | null => {
            // Priority Check
            if (props.name && typeof props.name === 'string') return props.name;
            if (props.state && typeof props.state === 'string') return props.state;
            if (props.admin1Name && typeof props.admin1Name === 'string') return props.admin1Name; // Corrected typo: admin1Name

            // Scan all values
            for (const key in props) {
                const val = props[key];
                if (typeof val === 'string') {
                    const cleanVal = val.trim().toLowerCase();
                    if (ALL_STATES.some(s => cleanVal.includes(s) || s.includes(cleanVal))) {
                        return val;
                    }
                }
            }
            return null;
        };

        const getValueForFeature = (feature: any) => {
            const stateName = findStateInProperties(feature.properties);

            if (!stateName) {
                // console.warn('No matching state name found in properties:', feature.properties);
                return null;
            }

            const cleanName = stateName.trim();

            // 1. Try Specific State Data
            if (stateData && stateData.length > 0) {
                const found = stateData.find(d => {
                    const sNorm = d.state.toLowerCase();
                    const cNorm = cleanName.toLowerCase();
                    return sNorm === cNorm || cNorm.includes(sNorm) || sNorm.includes(cNorm);
                });
                if (found) return Number(found.value);
            }

            // 2. Fallback to Zonal
            const zoneIndex = ZONES.findIndex(zone =>
                ZONE_STATES[zone]?.some(s => {
                    const sNorm = s.toLowerCase();
                    const cNorm = cleanName.toLowerCase();
                    return sNorm === cNorm || cNorm.includes(sNorm) || sNorm.includes(cNorm);
                })
            );
            if (zoneIndex !== -1 && zonalData[zoneIndex] != null) return Number(zonalData[zoneIndex]);
            return null;
        };

        geoJsonLayerRef.current.eachLayer((layer: any) => {
            const feature = layer.feature;
            const stateName = findStateInProperties(feature.properties) || 'Unknown';

            const val = getValueForFeature(feature);

            layer.setStyle({
                fillColor: getColor(val),
                fillOpacity: 0.8,
                weight: 1,
                color: 'white',
                dashArray: '3'
            });

            const displayVal = (val !== null && val !== undefined && !isNaN(val)) ? Number(val).toFixed(1) + (unit || '') : 'N/A';
            const textContent = `${stateName}: ${displayVal}`;

            if (layer.getTooltip()) {
                layer.setTooltipContent(textContent);
            } else {
                layer.bindTooltip(textContent, { sticky: true });
            }
        });

    }, [zonalData, unit, mapReady]);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '400px', zIndex: 0 }} />;
}
