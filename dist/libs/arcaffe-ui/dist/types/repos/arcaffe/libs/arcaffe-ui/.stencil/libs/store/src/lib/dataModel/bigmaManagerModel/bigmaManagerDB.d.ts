import Dexie, { Table } from 'dexie';
import { IUser } from '@arcaffe/common-types';
import GeoJSON from "geojson";
import { IMaterial, ISource, ISourceSchema } from '../DataModel';
interface AppProperties {
  appName: string;
  user: IUser;
  authToken: string;
  activeMission: string;
  mapArea: string;
}
export declare class BigmaManagerDB extends Dexie {
  app: {
    [K in keyof AppProperties]?: any;
  };
  iframes: ExtendedTable<IframeItem>;
  filters: ExtendedTable<IframeItem>;
  missions: ExtendedTable<IframeItem>;
  _appTable: Dexie.Table;
  sources: Table<ISource>;
  materials: Table<IMaterial>;
  constructor();
  selectMaterialToggle: (materialId: string, force?: boolean) => Promise<void>;
}
declare type ExtendedTable<T> = Table<T> & {
  upsert: <T>(key: string, value: T) => Promise<boolean>;
};
declare class IframeItem {
  name: string;
  ownerApp: string;
  isActive: number;
  displayMode?: 'minimized' | 'opened' | 'closed' | 'hidden';
  detached?: number;
  size?: number[];
  position?: number[];
  resizable?: ['x'?, 'y'?];
  detachable?: number;
  closeable?: number;
}
export declare class Material implements IMaterial {
  id: string;
  ownerApp: string;
  type: string;
  sourceName: string;
  startTime: Date;
  endTime: Date;
  geo?: GeoJSON.Feature;
  drawStyle?: any;
  additionalProps: any;
  onMaterialClick?: string;
  visibilityOnMap?: 'solo' | 'on' | 'off';
}
export declare class Source implements ISource {
  name: string;
  appName: string;
  color: string;
  displayName: string;
  schema: ISourceSchema;
  isHiddenFromMap: number;
  isHiddenFromTimeline: number;
  icon: string;
}
export declare const bigmaManagerDb: BigmaManagerDB;
export {};
