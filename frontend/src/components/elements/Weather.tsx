import { LuDroplets, LuSun, LuWind } from 'react-icons/lu';

import { useSession } from '@data';
import { getDayName } from '@utils';

export const Weather = () => {
  const { responsedata } = useSession();

  return (
    <div id='Weather' className='response-component grid gap-3'>
      <h3>Wetter</h3>
      {/* today */}
      <div className='flex justify-between px-3'>
        <div title='Temperatur'>
          {/* TODO: match icon to weather + display undisplayed data */}
          <LuSun className='mr-2 inline text-xl text-yellow-500' />
          {responsedata.weather.temperature.toFixed(0)}°C
        </div>
        <div title='WindSpeed'>
          <LuWind className='mr-2 inline text-xl' /> {responsedata.weather.wind_speed.toFixed(0)}{' '}
          m/s
        </div>
        <div title='Humidity'>
          <LuDroplets className='mr-2 inline text-xl' /> {responsedata.weather.humidity.toFixed(0)}{' '}
          %
        </div>
      </div>
      <hr />
      {/* prediction */}
      <table className='w-full'>
        <thead>
          <tr title='Wochentag'>
            <th>{getDayName(responsedata.weather.time, 1)}</th>
            <th>{getDayName(responsedata.weather.time, 2)}</th>
            <th>{getDayName(responsedata.weather.time, 3)}</th>
            <th>{getDayName(responsedata.weather.time, 4)}</th>
            <th>{getDayName(responsedata.weather.time, 5)}</th>
            <th>{getDayName(responsedata.weather.time, 6)}</th>
            <th>{getDayName(responsedata.weather.time, 7)}</th>
          </tr>
        </thead>
        <tbody>
          <tr title='T max'>
            <td>{responsedata.weather.max_temp_next7days[0].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[1].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[2].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[3].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[4].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[5].toFixed(0)}°C</td>
            <td>{responsedata.weather.max_temp_next7days[6].toFixed(0)}°C</td>
          </tr>
          <tr title='T min'>
            <td>{responsedata.weather.min_temp_next7days[0].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[1].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[2].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[3].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[4].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[5].toFixed(0)}°C</td>
            <td>{responsedata.weather.min_temp_next7days[6].toFixed(0)}°C</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
