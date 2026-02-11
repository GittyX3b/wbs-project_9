import type { Opentopodata } from '#types';

/*Fetches elevation data from the Opentopodata API for given latitude and longitude coordinates.*/
export async function fetchElevation(lat: number, lon: number): Promise<number> {
  const response = await fetch(`${process.env.OPENTOPODATA_API_URL!}?locations=${lat},${lon}`);

  if (!response.ok) throw new Error(`Failed to fetch elevation data`, { cause: { status: response.status } });

  const data = (await response.json()) as Opentopodata;

  return data.results?.[0]?.elevation ?? 0;
}
