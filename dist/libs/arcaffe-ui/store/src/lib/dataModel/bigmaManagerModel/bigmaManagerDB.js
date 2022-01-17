import Dexie from 'dexie';
export class BigmaManagerDB extends Dexie {
  constructor() {
    super('BigmaManagerDB');
    this.selectMaterialToggle = async (materialId, force) => {
      return this.transaction('rw', this.materials, async () => {
        const targetMaterial = await this.materials.get(materialId);
        if (targetMaterial) {
          const { isSelected, sourceName } = targetMaterial;
          if (!!isSelected === force)
            return;
          const finalStatus = force !== null && force !== void 0 ? force : (!isSelected || true);
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
    this.version(5).stores({
      app: '&key, value',
      iframes: '&name,isActive,ownerApp,displayMode,detached,size,position,resizable,detachable,closeable',
      filters: '&name,isActive,ownerApp,displayName,icon',
      missions: '&id, name,id,data,members',
      sources: '&name, ownerApp,displayName,schema,isHiddenFromMap,isHiddenFromTimeline',
      materials: '&id, [sourceName+isSelected], sourceName, isSelected, ownerApp,type,interval,geo,string,drawStyle,additionalProps,visibilityOnMap',
    });
    this._appTable = this.table('app');
    const handler = {
      get: async (_target, key) => {
        var _a;
        return (_a = (await this._appTable.get(key))) === null || _a === void 0 ? void 0 : _a.value;
      },
      set: async (_target, key, value) => {
        let result = 0;
        if (await isPropExist(this._appTable, key)) {
          result = await this._appTable.update(key, { value });
        }
        else {
          await this._appTable.add({ key, value });
          result = 1;
        }
        if (!result) {
          console.error("can't update unexist property");
          return false;
        }
        else {
          return true;
        }
      },
      delete: async (key) => {
        try {
          await this.table('app').delete(key);
          return true;
        }
        catch (e) {
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
}
function extendsTable(table, classMapping) {
  table.mapToClass(classMapping);
  table.upsert = async (key, value) => {
    let result = 0;
    if (await isRecordExist(table, key)) {
      result = await table.update(key, value);
    }
    else {
      await table.add(value, key);
      result = 1;
    }
    return !!result;
  };
  return table;
}
class IframeItem {
}
class Ifilter {
}
class IMission {
}
export class Material {
}
export class Source {
}
//utils
const isPropExist = async (table, propKey) => {
  return (await table.where('key').equals(propKey).count()) > 0;
};
const isRecordExist = async (table, indexKey) => {
  return !!(await table.get(indexKey));
};
export const bigmaManagerDb = new BigmaManagerDB();
console.log(bigmaManagerDb);
