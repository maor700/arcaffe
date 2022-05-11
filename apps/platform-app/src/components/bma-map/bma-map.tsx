/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { bigmaManagerDb, ISource } from '@arcaffe/store';
import { Component, getAssetPath, h, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import L from 'leaflet';
//@ts-ignore
import 'leaflet.markercluster';

@Component({
  tag: 'bma-map',
  styleUrls: ['./bma-map.css'],
  assetsDirs: ['./images'],
})
export class BmaMap {
  @State() map: L.Map;
  @State() sources: ISource[] = [];

  private suorcesSubscription: Subscription;

  private mapElm: HTMLDivElement;
  private setMap = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: `${getAssetPath('./images/marker-icon-2x.png')}`,
      iconUrl: `${getAssetPath('./images/marker-icon.png')}`,
      shadowUrl: `${getAssetPath('./images/marker-shadow.png')}`,
    });

    this.map  = (window as any).appMap = L.map(this.mapElm, {
      center: [41.8781, -87.6298],
      zoom: 13,
    });
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.map.on('moveend', () => {
      const boundsStr = this.map.getBounds().toBBoxString();
      console.log({boundsStr});
      
      bigmaManagerDb.filters.put({
        name: 'geoFilter',
        ownerApp: 'app',
        isActive: 1,
        displayName: 'פילטור גיאוגרפי',
        icon: 'polygon',
        value: boundsStr,
      });
    });
  };

  componentWillLoad() {
    this.suorcesSubscription = liveQuery(() =>
      bigmaManagerDb.sources.toArray()
    ).subscribe((sources) => {
      this.sources = sources;
    });
  }
  componentDidLoad() {
    this.setMap();
  }

  disconnectedCallback() {
    this.suorcesSubscription?.unsubscribe();
  }

  private style = {
    height: '100%',
    width: '100%',
  };
  render() {
    return (
      <div class="map-con" style={{ height: '100%' }}>
        <bma-map-effects map={this.map} />
        {this.sources.map((source) => (
          <bma-map-source-layer source={source} map={this.map} />
        ))}
        <div
          ref={(el) => {
            this.mapElm = el;
          }}
          id="map"
          style={this.style}
        ></div>
      </div>
    );
  }
}
