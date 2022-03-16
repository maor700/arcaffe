import GeoJSON from 'geojson';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IUser } from '@arcaffe/common-types';
import { IMaterial, bigmaManagerDb } from '@arcaffe/store';
import { useLiveQuery } from 'dexie-react-hooks';
import styles from './app.module.less';
import { Users } from './components/users/Users';
import { createClient } from '@supabase/supabase-js';

const supabase_url = "http://localhost:8000";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'

const supabase = createClient(supabase_url, SERVICE_KEY);

supabase.from("messages").select("*").then(console.log);


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