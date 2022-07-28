// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { bigmaManagerDb, Material } from '@arcaffe/store';
import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import styles from './app.module.less';

const API_KEY = 'c13c2c32-9910-4076-93fd-51064cd48991';

export function App() {
  const flights = useLiveQuery(
    () => bigmaManagerDb.materials.where("sourceName").equals("FLIGHTS").toArray(),
    [],
    []
  );
  useEffect(() => {
    bigmaManagerDb.sources.put({
      color: 'black',
      name: 'FLIGHTS',
      ownerApp: 'flights-app',
    });
  }, []);
  const clickHandler = useCallback(async (e) => {
    const flights: Material[] = await getFlights();
    bigmaManagerDb.materials.bulkPut(flights);
  }, []);

  return (
    <div style={{color:"#eee"}}>
      <h1>Flights App</h1>
      <button onClick={clickHandler}>Get Flights</button>

      <h2>Flights</h2>
      <div >count:{flights.length}</div>
      {flights.splice(0,200).map((_) => (
        <div key={_.id}>{_.additionalProps.flight_number}</div>
      ))}
      <div />
    </div>
  );
}

export default App;

async function getFlights() {
  const { response } = (await fetch(
    `https://airlabs.co/api/v9/flights?api_key=${API_KEY}`
  ).then(res=>res.json())) as any;
  return response.map((f) => ({
    startTime: new Date(f.updated * 1000),
    endTime: new Date((f.updated + 1) * 1000),
    id: f.hex,
    sourceName: 'FLIGHTS',
    geo: {
      geometry: {
        type: 'Point',
        coordinates: [Number.parseFloat(f.lng), Number.parseFloat(f.lat)],
      },
      type: 'Feature',
    },
    type: 'flight',
    ownerApp: 'flights',
    additionalProps: { flight_number: f.flight_number, flag: f.flag },
  }));
}
