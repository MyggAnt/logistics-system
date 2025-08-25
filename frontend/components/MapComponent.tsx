import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

export default function MapComponent(): React.ReactElement {
  const warehouse: LatLngExpression = [55.7558, 37.6173];
  const store: LatLngExpression = [55.751244, 37.618423];
  const route: LatLngExpression[] = [warehouse, store];

  return (
    <MapContainer
      center={warehouse}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={warehouse}>
        <Popup>Склад</Popup>
      </Marker>
      <Marker position={store}>
        <Popup>Магазин</Popup>
      </Marker>
      <Polyline positions={route} color="blue" />
    </MapContainer>
  );
}

