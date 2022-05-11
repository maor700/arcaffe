import GeoJSON from 'geojson';

export interface IAppTable {
  user: IUser;
  authToken: string;
  ownerApp: string;
  mapArea: string;
  activeMission: string;
}

export interface ISource {
  name: string;
  color?: string;
  ownerApp?: string;
  displayName?: string;
  schema?: ISourceSchema;
  isHiddenFromMap?: number;
  isHiddenFromTimeline?: number;
  icon?: string; // base64
}

export interface ISourceSchema {
  [key: string]: ISchemaItem;
}

export interface ISchemaItem {
  key: string;
  valueType: 'number' | 'string' | 'object' | 'array';
  dispayName: string;
}

export interface IMaterial<T = any> {
  id: string;
  ownerApp: string;
  sourceName: string;
  displayName?: string;
  type: string;
  startTime?: Date;
  endTime?: Date;
  long?:number,
  lat?:number,
  geo?: GeoJSON.Feature;
  drawStyle?: any;
  onMaterialClick?: string; //serialized function
  additionalProps: T;
}

export interface IFilteredMaterial<T = any> extends IMaterial<T>{
  isSelected?: 1 | 0;
  visibilityOnMap: 'solo' | 'on' | 'off';
}

interface IUser {
  firstName: string;
  lastName: string;
  userId: string;
  hirarchy: string;
}

export interface IFilter<T = any> {
  name: string;
  isActive: number;
  ownerApp:string;
  displayName: string;
  icon: string; //base64
  value: T;
}

export interface IIframeItem {
  name: string;
  isActive: number;
  displayMode: 'minimized' | 'opened' | 'closed';
  detached: number;
  size: number[]; // [w,h]
  position: number[]; // [x,y]
  resizable: ['x'?, 'y'?];
  detachable: number;
  closeable: number;
}

export interface IMission {
  name: string;
  id: string;
  data: any;
  members: string[];
}
