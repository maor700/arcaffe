import { Component, OnInit } from '@angular/core';
import { bigmaManagerDb, IMaterial } from '@arcaffe/store';
import { wktToGeoJSON } from '@terraformer/wkt';
import { liveQuery, Subscription } from 'dexie';
import { BehaviorSubject } from 'rxjs';

const URL_MATERIALS = 'http://localhost:8080/api/materials';

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
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.less'],
})
export class MaterialsListComponent implements OnInit {
  materials: IMaterial[] = [];
  subscriptions!: Subscription[];
  selectedId$ = new BehaviorSubject('');

  ngOnInit(): void {
    const selectedSubscription = liveQuery(() =>
      bigmaManagerDb.materials
        .where('[sourceName+isSelected]')
        .equals(['materials', 1])
        .first()
    ).subscribe((selectedMaterial) => {
      console.log(selectedMaterial, '*selected*');
      this.selectedId$.next(selectedMaterial?.id || '');
    });
    this.subscriptions?.push?.(selectedSubscription);

    const materialsSubscription = liveQuery(() =>
      bigmaManagerDb.materials.where('sourceName').equals('materials').toArray()
    ).subscribe((dbMaterials) => {
      this.materials = dbMaterials;
    });
    this.subscriptions?.push?.(materialsSubscription);

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

  // ngOnDestroy() {
  //   this.subscriptions.forEach((_) => _?.unsubscribe?.());
  // }

  public userSelectHandler(material: IMaterial) {
    bigmaManagerDb.selectMaterialToggle(material.id);
  }
}
