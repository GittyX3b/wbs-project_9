import { fetchWeatherApi } from 'openmeteo';
import type { openMeteoDTO } from '#types';

const params = {
  latitude: 0,
  longitude: 0,
  daily: ['temperature_2m_max', 'temperature_2m_min'],
  current: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m', 'snowfall', 'is_day'],
  timezone: ''
};

export async function openMeteo(
  latFixed: number,
  lonFixed: number,
  timezoneFixed = 'Europe/Berlin'
): Promise<openMeteoDTO> {
  params.latitude = latFixed;
  params.longitude = lonFixed;
  params.timezone = timezoneFixed;

  const responses = await fetchWeatherApi(process.env.OPENMETRO_API_URL!, params);
  // Process first location.
  // a for-loop for multiple locations or weather models
  const response = responses[0] as any;
  //console.log(responses);
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;
  const daily = response.daily()!;
  // Define Int64 variables so they can be processed accordingly

  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      relative_humidity_2m: current.variables(1)!.value(),
      precipitation: current.variables(2)!.value(),
      wind_speed_10m: current.variables(3)!.value(),
      snowfall: current.variables(4)!.value(),
      is_day: current.variables(5)!.value()
    },
    daily: {
      time: Array.from(
        { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m_max: daily.variables(0)!.valuesArray(),
      temperature_2m_min: daily.variables(1)!.valuesArray()
      // Map Int64 values to according structure
    }
  };
  return weatherData as openMeteoDTO;
}
