import type { Feature, FeatureCollection, GeometryCollection } from 'geojson';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useSession } from '@data';

/* -----------------------------
   Fix default marker icon
------------------------------ */

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/* -----------------------------
   Types
------------------------------ */

type GeoData = FeatureCollection | Feature | GeometryCollection;

type MapLayerProps = {
  data?: GeoData;
  border: string;
  fill: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
};

/* -----------------------------
   Layer Component
------------------------------ */

function MapLayer({ data, border, fill, weight, opacity, fillOpacity }: MapLayerProps) {
  const style = useMemo(
    () => ({
      color: border,
      weight,
      opacity,
      fillColor: fill,
      fillOpacity,
    }),
    [border, fill, weight, opacity, fillOpacity],
  );

  if (!data) return null;

  return <GeoJSON data={data} style={style} />;
}

/* -----------------------------
   Main Map Component
------------------------------ */

export const LeafletMap = ({ className = '' }: { className?: string }) => {
  const { locationform, responsedata } = useSession();

  const [visibleLayers, setVisibleLayers] = useState({
    buildings: true,
    roads: true,
    green: true,
    water: true,
  });

  const toggleLayer = (key: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const layers = responsedata?.layers ?? {};

  return (
    <div className={`h-full w-full bg-white ${className}`}>
      <MapContainer
        center={[locationform.inputs.latitude!, locationform.inputs.longitude!]}
        zoom={16}
        scrollWheelZoom={false}
        className='h-[600px] w-full'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Marker position={[locationform.inputs.latitude!, locationform.inputs.longitude!]}>
          <Popup>Your location</Popup>
        </Marker>

        {visibleLayers.buildings && (
          <MapLayer
            data={layers.buildings}
            border='white'
            fill='#A2A7B8'
            weight={1}
            opacity={1}
            fillOpacity={0.6}
          />
        )}

        {visibleLayers.roads && (
          <MapLayer
            data={layers.roads}
            border='black'
            fill='#3D3C3C'
            weight={5}
            opacity={0.5}
            fillOpacity={0.9}
          />
        )}

        {visibleLayers.green && (
          <MapLayer
            data={layers.green}
            border='white'
            fill='#42C25B'
            weight={1}
            opacity={1}
            fillOpacity={0.6}
          />
        )}

        {visibleLayers.water && (
          <MapLayer
            data={layers.water}
            border='white'
            fill='#4F9FE3'
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          />
        )}
      </MapContainer>

      {/* Filter Buttons */}
      <div className='grid grid-cols-4 gap-3 p-5'>
        <button
          onClick={() => toggleLayer('buildings')}
          className={visibleLayers.buildings ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Gebäude
        </button>
        <button
          onClick={() => toggleLayer('roads')}
          className={visibleLayers.roads ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Straßen
        </button>
        <button
          onClick={() => toggleLayer('green')}
          className={visibleLayers.green ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Grünfläche
        </button>
        <button
          onClick={() => toggleLayer('water')}
          className={visibleLayers.water ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Gewässer
        </button>
      </div>
    </div>
  );
};
