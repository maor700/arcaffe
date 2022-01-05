import { bigmaManagerDb, IMaterial, ISource } from '@arcaffe/store';
import { Component, Prop, State, h, Host } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import L from 'leaflet';

@Component({
  tag: 'bma-map-source-layer',
  styleUrl: 'bma-map-source-layer.less',
  shadow: true,
})
export class BmaMapSourceLayer {
  /**
   * The Source name
   */
  @Prop() source: ISource;

  /**
   * The middle name
   */
  @Prop() map: L.Map;
  /**
   * The middle name
   */
  @State() layerGroup: L.LayerGroup;

  @State() materials: IMaterial[] = [];
  @State() selected: IMaterial = null;

  private addGeoHandler = ({ detail: geo }: CustomEvent<L.GeoJSON>) => {
    this.layerGroup?.addLayer(geo);
  };

  private removeGeoHandler = ({ detail: geo }: CustomEvent<L.GeoJSON>) => {
    this.layerGroup?.removeLayer(geo);
  };
  private _geoClickHandler: (
    event: CustomEvent<{ geo: L.GeoJSON; id: string }>
  ) => void = ({ detail: { id } }) => {
    bigmaManagerDb.selectMaterialToggle(id);
  };
  private materialsSubscription: Subscription;
  private selectedMaterialSubscription: Subscription;
  private sourceSubscription: Subscription;

  constructor() {
    this.materialsSubscription = liveQuery(() =>
      bigmaManagerDb.materials
        .where('sourceName')
        .equals(this.source.name)
        .toArray()
    ).subscribe((materials) => {
      console.log(materials);
      this.materials = materials;
    });

    this.selectedMaterialSubscription = liveQuery(() =>
      bigmaManagerDb.materials
        .where('[sourceName+isSelected]')
        .equals([this.source?.name, 1])
        .first()
    ).subscribe(async (material) => {
      if (!material) {
        this.selected = null;
      } else if (material !== undefined && material?.id !== this.selected?.id) {
        bigmaManagerDb.app.mapArea = L.geoJSON(material.geo)
          .getBounds()
          .toBBoxString();
        this.selected = material;
      }
    });
  }

  async componentDidLoad() {
    const source = await bigmaManagerDb.sources.get(this.source?.name);
    if (!source) {
      console.warn(`${this.source?.name} does not exist in Sources table`);
    }
    this.layerGroup = new L.LayerGroup();
    this.layerGroup.addTo(this.map);
  }

  disconnectedCallback() {
    this.materialsSubscription?.unsubscribe();
    this.selectedMaterialSubscription?.unsubscribe();
    this.sourceSubscription?.unsubscribe();
  }

  render() {
    return (
      <Host>
        {this.materials.map(({ geo, id, isSelected }) => (
          <bma-map-material
            onGeoClick={this._geoClickHandler}
            key={id}
            geoId={id}
            geo={geo}
            color={isSelected ? 'red' : this.source?.color ?? 'blue'}
            onAdd={this.addGeoHandler}
            onRemove={this.removeGeoHandler}
          />
        ))}
      </Host>
    );
  }
}
