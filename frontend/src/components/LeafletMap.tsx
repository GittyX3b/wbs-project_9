import type { Feature, FeatureCollection, GeoJsonObject, GeometryCollection } from 'geojson';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { LuBusFront, LuLoader } from 'react-icons/lu';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useSession } from '@data';

/* -----------------------------
   Map icons
------------------------------ */

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RestaurantIcon = L.icon({
  iconUrl: '../src/assets/images/map-icon-restaurant.png',
  shadowUrl: iconShadow,
  iconSize: [30, 30],
  iconAnchor: [10, 20],
  popupAnchor: [5, -12],
});
const CafeIcon = L.icon({
  iconUrl: '../src/assets/images/map-icon-cafe.png',
  shadowUrl: iconShadow,
  iconSize: [30, 30],
  iconAnchor: [10, 20],
  popupAnchor: [5, -12],
});
const TheatreIcon = L.icon({
  iconUrl: '../src/assets/images/map-icon-theatre.png',
  shadowUrl: iconShadow,
  iconSize: [30, 30],
  iconAnchor: [10, 20],
  popupAnchor: [5, -12],
});
const MuseumIcon = L.icon({
  iconUrl: '../src/assets/images/map-icon-museum.png',
  shadowUrl: iconShadow,
  iconSize: [30, 30],
  iconAnchor: [10, 20],
  popupAnchor: [5, -12],
});
const BusStopIcon = L.icon({
  iconUrl: '../src/assets/images/map-icon-busstop.png',
  shadowUrl: iconShadow,
  iconSize: [30, 30],
  iconAnchor: [10, 20],
  popupAnchor: [5, -12],
});

/* -----------------------------
   Types
------------------------------ */

type ApiFeatureCollection = {
  type: 'FeatureCollection' | null;
  features?: Feature[];
};

type GeoData = FeatureCollection | Feature | GeometryCollection | ApiFeatureCollection;

type MapLayerProps = {
  data?: GeoData;
  border: string;
  fill: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
};

const isRenderableFeatureCollection = (d: ApiFeatureCollection): d is FeatureCollection =>
  d.type === 'FeatureCollection' && Array.isArray(d.features);

const toGeoJson = (d?: GeoData): GeoJsonObject | null => {
  if (!d) return null;

  if ('type' in d && d.type === null) return null;

  if ('type' in d && d.type === 'FeatureCollection') {
    if (!isRenderableFeatureCollection(d)) return null;
    return d;
  }

  return d as GeoJsonObject;
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

  const geo = toGeoJson(data);
  if (!geo) return null;

  return <GeoJSON data={geo} style={style} />;
}

/* -----------------------------
   Main Map Component
------------------------------ */

export const LeafletMap = ({ className = '' }: { className?: string }) => {
  const { locationform, responsedata, dispatchResponseData } = useSession();

  const [filterButtons, setFilterButtons] = useState({
    buildings: true,
    roads: true,
    green: true,
    water: true,
    showMore: 'no',
    restaurant: false,
    cafe: false,
    theatre: false,
    museum: false,
    busstop: false,
  });

  const showMoreFilter = async () => {
    setFilterButtons((prev) => ({ ...prev, showMore: 'pending' }));
    const url =
      import.meta.env.VITE_API_BASE_URL +
      '/geo/pois?zoneId=' +
      responsedata.zoneId +
      '&types=restaurant,cafe,museum,theatre,bus_stop';

    try {
      const res = await fetch(url);
      if (!res.ok) {
        setFilterButtons((prev) => ({ ...prev, showMore: 'no' }));
        throw new Error(`Error! Problems connecting to ${url}`);
      }

      const data = await res.json();
      if (!data) {
        setFilterButtons((prev) => ({ ...prev, showMore: 'no' }));
        throw new Error(`Error! Problems resolving data from ${url}`);
      } else {
        console.log('New Filter: ', data);
        dispatchResponseData({ type: 'UPDATE_LAYERS', payload: data });
        setFilterButtons((prev) => ({ ...prev, showMore: 'yes' }));
      }
    } catch (error) {
      setFilterButtons((prev) => ({ ...prev, showMore: 'no' }));
      throw new Error(`Fetching additional filters failed: ${error}`);
    }
  };

  const toggleLayer = (key: keyof typeof filterButtons) => {
    setFilterButtons((prev) => ({
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
        className='h-150 w-full'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Marker position={[locationform.inputs.latitude!, locationform.inputs.longitude!]}>
          <Popup>Your location</Popup>
        </Marker>

        {filterButtons.buildings && (
          <MapLayer
            data={layers.buildings as GeoData}
            border='white'
            fill='#878EA3'
            weight={1}
            opacity={1}
            fillOpacity={0.6}
          />
        )}

        {filterButtons.roads && (
          <MapLayer
            data={layers.roads as GeoData}
            border='black'
            fill='#BABABA'
            weight={6}
            opacity={0.3}
            fillOpacity={0.9}
          />
        )}

        {filterButtons.green && (
          <MapLayer
            data={layers.green as GeoData}
            border='white'
            fill='#42C25B'
            weight={1}
            opacity={1}
            fillOpacity={0.6}
          />
        )}

        {filterButtons.water && (
          <MapLayer
            data={layers.water as GeoData}
            border='white'
            fill='#4F9FE3'
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          />
        )}

        {filterButtons.restaurant &&
          layers.pois?.restaurant?.features?.map((feature: Feature, idx: number) => {
            if (feature.geometry.type !== 'Point') return null;

            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) return null;
            const [lng, lat] = coords as [number, number];

            return (
              <Marker key={idx} position={[lat, lng]} icon={RestaurantIcon}>
                <Popup>
                  <div className='text-xs'>
                    <strong>{feature.properties?.name}</strong>
                    <p>{feature.properties?.opening_hours}</p>
                    <p>
                      <a href={`tel:${feature.properties?.phone}`}>{feature.properties?.phone}</a>
                    </p>
                    <p>
                      <a href={feature.properties?.website} target='_blank'>
                        {feature.properties?.website}
                      </a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {filterButtons.cafe &&
          layers.pois?.cafe?.features?.map((feature: Feature, idx: number) => {
            if (feature.geometry.type !== 'Point') return null;

            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) return null;
            const [lng, lat] = coords as [number, number];

            return (
              <Marker key={idx} position={[lat, lng]} icon={CafeIcon}>
                <Popup>
                  <div className='text-xs'>
                    <strong>{feature.properties?.name}</strong>
                    <p>{feature.properties?.opening_hours}</p>
                    <p>
                      <a href={`tel:${feature.properties?.phone}`}>{feature.properties?.phone}</a>
                    </p>
                    <p>
                      <a href={feature.properties?.website} target='_blank'>
                        {feature.properties?.website}
                      </a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {filterButtons.theatre &&
          layers.pois?.theatre?.features?.map((feature: Feature, idx: number) => {
            if (feature.geometry.type !== 'Point') return null;

            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) return null;
            const [lng, lat] = coords as [number, number];

            return (
              <Marker key={idx} position={[lat, lng]} icon={TheatreIcon}>
                <Popup>
                  <div className='text-xs'>
                    <strong>{feature.properties?.name}</strong>
                    <p>{feature.properties?.opening_hours}</p>
                    <p>
                      <a href={`tel:${feature.properties?.phone}`}>{feature.properties?.phone}</a>
                    </p>
                    <p>
                      <a href={feature.properties?.url} target='_blank'>
                        {feature.properties?.url}
                      </a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {filterButtons.museum &&
          layers.pois?.museum?.features?.map((feature: Feature, idx: number) => {
            if (feature.geometry.type !== 'Point') return null;

            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) return null;
            const [lng, lat] = coords as [number, number];

            return (
              <Marker key={idx} position={[lat, lng]} icon={MuseumIcon}>
                <Popup>
                  <div className='text-xs'>
                    <strong>{feature.properties?.name}</strong>
                    <p>{feature.properties?.opening_hours}</p>
                    <p>
                      <a href={`tel:${feature.properties?.phone}`}>{feature.properties?.phone}</a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {filterButtons.busstop &&
          layers.pois?.bus_stop?.features?.map((feature: Feature, idx: number) => {
            if (feature.geometry.type !== 'Point') return null;

            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) return null;
            const [lng, lat] = coords as [number, number];

            return (
              <Marker key={idx} position={[lat, lng]} icon={BusStopIcon}>
                <Popup>
                  <div className='flex text-xs'>
                    {feature.properties?.bus && (
                      <LuBusFront className='mr-2 inline text-xl text-yellow-400' />
                    )}
                    <div>
                      <strong>{feature.properties?.name}</strong>
                      <ul className='list-disc px-5 text-xs'>
                        {feature.properties?.shelter && <li className='disc'>mit Dach</li>}
                        {feature.properties?.bank && <li className='disc'>mit Bank</li>}
                      </ul>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Filter Buttons */}
      <div className='grid grid-cols-4 gap-3 p-5 sm:px-15 lg:px-20'>
        <button
          onClick={() => toggleLayer('buildings')}
          className={filterButtons.buildings ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Gebäude
        </button>
        <button
          onClick={() => toggleLayer('roads')}
          className={filterButtons.roads ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Straßen
        </button>
        <button
          onClick={() => toggleLayer('green')}
          className={filterButtons.green ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Grünfläche
        </button>
        <button
          onClick={() => toggleLayer('water')}
          className={filterButtons.water ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
        >
          Gewässer
        </button>

        {filterButtons.showMore === 'yes' ? (
          <>
            <button
              onClick={() => toggleLayer('restaurant')}
              className={filterButtons.restaurant ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
            >
              Restaurants
            </button>
            <button
              onClick={() => toggleLayer('cafe')}
              className={filterButtons.cafe ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
            >
              Cafés
            </button>
            <button
              onClick={() => toggleLayer('museum')}
              className={filterButtons.museum ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
            >
              Museen
            </button>
            <button
              onClick={() => toggleLayer('theatre')}
              className={filterButtons.theatre ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
            >
              Theater
            </button>
            <button
              onClick={() => toggleLayer('busstop')}
              className={filterButtons.busstop ? 'btn-mapfilter' : 'btn-mapfilter-outline'}
            >
              Bushaltestellen
            </button>
          </>
        ) : (
          <button
            onClick={() => showMoreFilter()}
            className='btn-mapfilter-outline'
            disabled={filterButtons.showMore === 'pending'}
          >
            {filterButtons.showMore === 'pending' ? (
              <>
                <LuLoader className='animate-spin' /> <i>bitte Geduld</i>
              </>
            ) : (
              '+ mehr Filter'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
