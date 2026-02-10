import { useSession } from '@data';

export const GeoInfo = () => {
  const { responsedata } = useSession();

  return (
    <div id='Geo-Info' className='response-component'>
      <h3>Geografische Informationen</h3>
      <div className='flex justify-between text-base'>
        <span>Höhenlage:</span>
        <span id='Geo-Info-1'>{responsedata.elevation}m ü. NN</span>
      </div>
    </div>
  );
};
