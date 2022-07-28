import { liveQuery } from 'dexie';
import { bigmaManagerDb, IFilteredMaterial } from '@arcaffe/store';
import { debounceTime, from } from 'rxjs';

export function dbController() {
  const subsc = from(
    liveQuery(async () => {
      await bigmaManagerDb.materials.toArray();
      return bigmaManagerDb.filters.get('timeRange');
    })
  )
    .pipe(debounceTime(50))
    .subscribe(async (timeRange) => {
      if (!timeRange) return;
      bigmaManagerDb.transaction(
        'rw',
        bigmaManagerDb.filteredMaterials,
        bigmaManagerDb.materials,
        async () => {
          const newFiltered: IFilteredMaterial[] = [];
          const start = timeRange?.value?.start;
          const end = timeRange?.value?.end;
          await bigmaManagerDb.materials
            .where('[startTime+endTime]')
            .between([start, start], [end, end])
            .each(async (m) => {
              const currentFilteredMaterial =
                await bigmaManagerDb.filteredMaterials.get(m.id);
              let newFilteredMaterial: IFilteredMaterial = {
                ...m,
                isSelected: 0,
                visibilityOnMap: 'on',
              };

              if (currentFilteredMaterial) {
                newFilteredMaterial = {
                  ...newFilteredMaterial,
                  ...currentFilteredMaterial,
                  ...m,
                };
              }
              newFiltered.push(newFilteredMaterial);
            });
          // console.log({ newFiltered });
          await bigmaManagerDb.filteredMaterials.clear();
          await bigmaManagerDb.filteredMaterials.bulkPut(newFiltered);
        }
      );
    });

  // const subsc2 = liveQuery(async () => {
  //   return bigmaManagerDb.filters.get('geoFilter') as Promise<IFilter<string>>;
  // }).subscribe(async (geoFilter) => {
  //   if (!geoFilter) return;
  //   const bbox = geoFilter?.value?.split(',').map(Number.parseFloat);
  //   if (!bbox) return;
  //   const [southwest_lat, southwest_lng, northeast_lat, northeast_lng] = bbox;

  //   bigmaManagerDb.transaction(
  //     'rw',
  //     bigmaManagerDb.filteredMaterials,
  //     bigmaManagerDb.materials,
  //     async () => {
  //       const newFiltered: IFilteredMaterial[] = [];
  //       await bigmaManagerDb.materials
  //         .where('[lat+long]')
  //         .between(
  //           [southwest_lng, southwest_lat],
  //           [northeast_lng, northeast_lat]
  //         )
  //         .each(async (m) => {
  //           const currentFilteredMaterial =
  //             await bigmaManagerDb.filteredMaterials.get(m.id);
  //           let newFilteredMaterial: IFilteredMaterial = {
  //             ...m,
  //             isSelected: 0,
  //             visibilityOnMap: 'on',
  //           };

  //           if (currentFilteredMaterial) {
  //             newFilteredMaterial = {
  //               ...newFilteredMaterial,
  //               ...currentFilteredMaterial,
  //               ...m,
  //             };
  //           }
  //           newFiltered.push(newFilteredMaterial);
  //         });
  //       console.log({ newFiltered });
  //       await bigmaManagerDb.filteredMaterials.clear();
  //       await bigmaManagerDb.filteredMaterials.bulkPut(newFiltered);
  //     }
  //   );
  // });

  return () => {
    subsc?.unsubscribe();
    // subsc2?.unsubscribe();
  };
}
