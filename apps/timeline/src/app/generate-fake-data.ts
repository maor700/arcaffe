import { liveQuery } from 'dexie';
import { bigmaManagerDb, IFilteredMaterial, IMaterial, ISource } from '@arcaffe/store';
import { from, map } from 'rxjs';
import { IUser } from '@arcaffe/common-types';

export type Group = {
  id: string;
  title: string;
  rightTitle: string;
  label: string;
};

export type Item = {
  id: string;
  group: string;
  title: string;
  start: number;
  end: number;
  canMove?: boolean;
  selected?: boolean;
  canResize?: string | boolean;
  className?: string;
  bgColor?: any;
  selectedBgColor?: any;
  color?: any;
  itemProps?: any;
};

const DEFAULT_ITEM: Item = {
  id: '',
  start: new Date().getTime(),
  end: new Date().getTime(),
  group: '1',
  title: 'Some Title',
  canMove: false,
  canResize: false,
  bgColor: 'red',
  selectedBgColor: 'pink',
  color: '#eee',
  itemProps: {},
};

export const groupsAndItems$ = from(
  liveQuery(async () => [
    await bigmaManagerDb.sources.toArray(),
    await bigmaManagerDb.filteredMaterials.toArray(),
  ])
).pipe(
  map(([allSources, allMaterials]) => {
    const sourcesData: Record<string, ISource> = (
      allSources as ISource[]
    ).reduce((sum, curr) => {
      sum[curr.name] = curr;
      return sum;
    }, {} as any);

    const items = (allMaterials as IFilteredMaterial<IUser>[]).map<Item>((m) => {
      const {
        id,
        sourceName,
        startTime,
        endTime,
        isSelected,
        additionalProps,
      } = m;
      const { name } = additionalProps;
      const bgColor = sourcesData[sourceName]?.color ?? DEFAULT_ITEM.color;
      const title = name ?? '';
      const group = sourcesData[sourceName]?.name ?? DEFAULT_ITEM.group;

      return {
        ...DEFAULT_ITEM,
        id,
        title,
        group,
        start: new Date(startTime ?? Date.now())?.getTime?.(),
        end: new Date(endTime ?? Date.now())?.getTime?.(),
        selected: isSelected === 1,
        itemProps: {
          id,
          className: `item-${id}`,
          style: {
            backgroundColor: isSelected ? 'rgba(0, 255, 255, 0.561)' : bgColor,
          },
        },
      } as Item;
    });

    const groups = (allSources as ISource[]).map<Group>(
      ({ name, displayName, color }) => ({
        id: name,
        title: displayName ?? '',
        rightTitle: displayName ?? '',
        label: displayName ?? '',
        color,
      })
    );

    return { items, groups };
  })
);
