import {
  Component,
  Event,
  EventEmitter,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { Point } from 'geojson';
import L, { LatLng, Layer } from 'leaflet';

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

@Component({
  tag: 'bma-map-material',
  styleUrl: 'bma-map-material.less',
  shadow: true,
})
export class BmaMapMaterial {
  /**
   * The GeoJson feature
   */
  @Prop() geo: GeoJSON.Feature;
  /**
   * The color of geometry
   */
  @Prop() color: string;
  /**
   * The id of material
   */
  @Prop() geoId: string;

  @State() singleLayer: L.GeoJSON;
  /**
   *
   */
  @Event() remove: EventEmitter<L.GeoJSON>;
  /**
   *
   */
  @Event() add: EventEmitter<L.GeoJSON>;
  /**
   *
   */
  @Event() geoClick: EventEmitter<{geo:L.GeoJSON, id:string}>;

  @Watch('color')
  changeColor() {
    this.singleLayer.setStyle({
      ...geojsonMarkerOptions,
      fillColor: this.color,
    });
  }

  componentDidLoad() {
    if (this.singleLayer || !this.geo) return;
    this.singleLayer = new L.GeoJSON(this.geo, {
      pointToLayer: this._pointStyle,
    });
    this.singleLayer.on('click', () => {
      this.geoClick.emit({geo:this.singleLayer, id:this.geoId});
    });
    this.add.emit(this.singleLayer);
  }

  disconnectedCallback() {
    this.remove.emit(this.singleLayer);
  }

  private _pointStyle: (
    geoJsonPoint: GeoJSON.Feature<Point, any>,
    latlng: LatLng
  ) => Layer = (_, latlng) => {
    const markerOptions = { ...geojsonMarkerOptions, fillColor: this?.color };
    return L.circleMarker(latlng, markerOptions);
  };

  render() {
    return null;
  }
}
