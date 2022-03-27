import Dexie, { Table } from 'dexie';
import { IUser } from '@arcaffe/common-types';
import GeoJSON from 'geojson';
import { IMaterial, ISource, ISourceSchema } from '../DataModel';
import { LayoutConfig } from 'golden-layout/dist/types';


interface AppProperties {
  appName: string;
  user: IUser;
  authToken: string;
  activeMission: string;
  mapArea: string;
  layout: ILayoutRecord;
}

export class BigmaManagerDB extends Dexie {
  app: { [K in keyof AppProperties]?: any };

  iframes!: ExtendedTable<IframeItem>;
  filters!: ExtendedTable<Ifilter>;
  layouts!: ExtendedTable<ILayoutRecord>;
  missions!: ExtendedTable<IMission>;
  _appTable: Dexie.Table;
  sources!: Table<ISource>;
  materials!: Table<IMaterial>;

  constructor() {
    super('BigmaManagerDB');
    this.version(7).stores({
      app: '&key, value',
      iframes:
        '&name,isActive,ownerApp,displayMode,detached,size,position,resizable,detachable,closeable',
      filters: '&name,isActive,ownerApp,displayName,icon',
      layouts: '&name',
      missions: '&id, name,id,data,members',
      sources:
        '&name, ownerApp,displayName,schema,isHiddenFromMap,isHiddenFromTimeline',
      materials:
        '&id, [sourceName+isSelected], sourceName, isSelected, ownerApp,type,interval,geo,string,drawStyle,additionalProps,visibilityOnMap',
    });

    this._appTable = this.table('app');
    const handler: any = {
      get: async <T>(_target, key: string) => {
        return (await this._appTable.get(key))?.value as T;
      },
      set: async (_target, key: string, value) => {
        let result = 0;
        if (await isPropExist(this._appTable, key)) {
          result = await this._appTable.update(key, { value });
        } else {
          await this._appTable.add({ key, value });
          result = 1;
        }
        if (!result) {
          console.error("can't update unexist property");
          return false;
        } else {
          return true;
        }
      },
      delete: async (key: string): Promise<boolean> => {
        try {
          await this.table('app').delete(key);
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      },
    };
    this.app = new Proxy({}, handler);
    extendsTable(this.iframes, IframeItem);
    extendsTable(this.filters, Ifilter);
    extendsTable(this.missions, IMission);
    extendsTable(this.sources, Source);
    extendsTable(this.materials, Material);
  }
  selectMaterialToggle = async (materialId: string, force?: boolean) => {
    return this.transaction('rw', this.materials, async () => {
      const targetMaterial = await this.materials.get(materialId);
      if (targetMaterial) {
        const { isSelected, sourceName } = targetMaterial;
        if (!!isSelected === force) return;
        const finalStatus = force ?? (!isSelected || true);
        await this.materials
          .where('[sourceName+isSelected]')
          .equals([sourceName, 1])
          .modify({ isSelected: 0 });
        await this.materials.update(materialId, {
          isSelected: finalStatus ? 1 : 0,
        });
      }
    });
  };
}

type ExtendedTable<T> = Table<T> & {
  upsert: <T>(key: string, value: T) => Promise<boolean>;
};

function extendsTable<T, S>(
  table: Table<T>,
  classMapping: S
): ExtendedTable<T> {
  table.mapToClass(classMapping as any);
  (table as ExtendedTable<T>).upsert = async (key, value) => {
    let result = 0;
    if (await isRecordExist(table, key)) {
      result = await table.update(key, value);
    } else {
      await table.add(value as any, key);
      result = 1;
    }
    return !!result;
  };
  return table as ExtendedTable<T>;
}

class IframeItem {
  name!: string;
  ownerApp!: string;
  isActive!: number;
  displayMode?: 'minimized' | 'opened' | 'closed' | 'hidden';
  detached?: number;
  size?: number[];
  position?: number[];
  resizable?: ['x'?, 'y'?];
  detachable?: number;
  closeable?: number;
}

class Ifilter<T = any> {
  name!: string;
  ownerApp!: string;
  isActive!: number;
  displayName!: string;
  icon!: string; //base64
  value!: T;
}

export class ILayoutRecord {
  name!: string;
  layout!: LayoutConfig;
}

class IMission {
  name!: string;
  id!: string;
  data: any;
  members!: string[];
}

export class Material implements IMaterial {
  id!: string;
  ownerApp!: string;
  type!: string;
  sourceName!: string;
  startTime!: Date;
  endTime!: Date;
  geo?: GeoJSON.Feature;
  drawStyle?: any;
  additionalProps: any;
  onMaterialClick?: string;
  visibilityOnMap?: 'solo' | 'on' | 'off';
}

export class Source implements ISource {
  name!: string;
  appName!: string;
  color!: string;
  displayName!: string;
  schema!: ISourceSchema;
  isHiddenFromMap!: number;
  isHiddenFromTimeline!: number;
  icon!: string; // base64
}

//utils

const isPropExist = async (
  table: Dexie.Table,
  propKey: string
): Promise<boolean> => {
  return (await table.where('key').equals(propKey).count()) > 0;
};
const isRecordExist = async (
  table: Dexie.Table,
  indexKey: string
): Promise<boolean> => {
  return !!(await table.get(indexKey));
};

export const bigmaManagerDb = new BigmaManagerDB();

console.log(bigmaManagerDb);
