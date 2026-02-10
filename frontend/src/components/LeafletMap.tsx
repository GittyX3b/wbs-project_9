import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useSession } from '@data';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const LeafletMap = ({ className = '' }: { className?: string }) => {
  const { locationform } = useSession();

  return (
    /* Container MUST have a height */
    <div className={`z-10 min-h-fit w-full bg-white lg:px-20 lg:pt-10 ${className}`}>
      <MapContainer
        center={[locationform.inputs.latitude!, locationform.inputs.longitude!]}
        zoom={17}
        scrollWheelZoom={false}
        className='h-full w-full'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[locationform.inputs.latitude!, locationform.inputs.longitude!]}>
          <Popup>MapTold: Your location data starts here.</Popup>
        </Marker>
      </MapContainer>
      <div id='Map-Filter' className='grid h-fit grid-cols-4 gap-3 p-5 lg:px-0'>
        <button className='btn-mapfilter'>Gebäude</button>
        <button className='btn-mapfilter'>Strassen</button>
        <button className='btn-mapfilter'>Grünfläche</button>
        <button className='btn-mapfilter'>Gewässer</button>
      </div>
    </div>
  );
};
