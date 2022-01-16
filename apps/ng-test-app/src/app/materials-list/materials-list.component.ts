import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ApplicationRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { bigmaManagerDb, IMaterial } from '@arcaffe/store';
import { wktToGeoJSON } from '@terraformer/wkt';
import { liveQuery, Subscription } from 'dexie';
import { from, of } from 'rxjs';

const URL_MATERIALS = 'http://localhost:8080/api/materials';

const materialsObs$ = from<Array<IMaterial[]>>(
  liveQuery(() =>
    bigmaManagerDb.materials.where('sourceName').equals('materials').toArray()
  ) as any
);

materialsObs$.subscribe((arr) => console.log('**__ARRIVED__**', arr));
export interface Material {
  geo: string;
  type: string;
  image: string;
  id: string;
  displayName: string;
  interval: Interval;
  additionalProps: AdditionalProps;
}

interface Interval {
  start: string;
  end: string;
}

interface AdditionalProps {
  email: string;
  url: string;
  phone: string;
}

@Component({
  selector: 'arcaffe-materials-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.less'],
})

export class MaterialsListComponent implements OnInit {
  materials$ = from<Array<IMaterial[]>>(
    liveQuery(async () => {
      const results = await bigmaManagerDb.materials
        .where('sourceName')
        .equals('materials')
        .toArray();
      console.log('inner ', results);
      // this.appRef.tick();
      return results;
    }) as any
  );

  selectedId$ = liveQuery<string | undefined>(
    async () =>
      (
        await bigmaManagerDb.materials
          .where('[sourceName+isSelected]')
          .equals(['materials', 1])
          .first()
      )?.id
  );

  constructor(private appRef: ApplicationRef) {}

  ngOnInit(): void {
    console.log('');

    fetch(URL_MATERIALS)
      .then((res) => res.json())
      .then((data: Material[]) => {
        const newMaterials = data.map((mat) => {
          const { id, additionalProps, geo, displayName } = mat;
          const { email, phone } = additionalProps;
          const geometry = geo ? wktToGeoJSON(geo) : null;
          let geoj: GeoJSON.Feature | null = null;
          if (geometry) {
            geoj = {
              geometry,
              type: 'Feature',
              properties: {
                name: displayName,
                content: `name:${displayName} email:${email} phon:${phone}`,
              },
            };
          }
          return {
            id,
            geo: geoj,
            sourceName: 'materials',
            ownerApp: 'materials-app',
            visibilityOnMap: 'on',
            type: 'material',
            additionalProps: additionalProps,
          } as IMaterial;
        });
        bigmaManagerDb.materials.bulkPut(newMaterials);
      });
  }

  public userSelectHandler(material: IMaterial) {
    bigmaManagerDb.selectMaterialToggle(material.id);
  }
}
