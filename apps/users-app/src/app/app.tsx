import GeoJSON from 'geojson';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IUser } from '@arcaffe/common-types';
import { IMaterial, bigmaManagerDb } from '@arcaffe/store';
import { useLiveQuery } from 'dexie-react-hooks';
import styles from './app.module.less';
import { Users } from './components/users/Users';

const DB = bigmaManagerDb;

console.log(DB, 'DB');

export function App() {
  return (
    <div className={styles.app}>
      <Users />
    </div>
  );
}

export default App;