// src/MapView.js

import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const geoJsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Brazil", "initiatives": 20 },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [-35.859375, 5.266007882805498],
              [-35.859375, -33.7243396617476],
              [-73.828125, -33.7243396617476],
              [-73.828125, 5.266007882805498],
              [-35.859375, 5.266007882805498]
            ]
          ]
        }
        }
    ]
    };
    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh' }}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geoJsonData} />
        </MapContainer>
        );
    }

export default MapView;