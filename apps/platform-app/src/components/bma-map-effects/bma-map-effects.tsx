import { bigmaManagerDb } from '@arcaffe/store';
import { Component, h, Host, Prop } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import L from 'leaflet';

@Component({
  tag: 'bma-map-effects',
  styleUrl: 'bma-map-effects.less',
  shadow: true,
})
export class BmaMapEffects {
  /**
   * Map object
   */
  @Prop() map: L.Map;

  private subscriptions: Subscription[] = [];

  componentDidLoad() {
    // flyto area
    const sub1 = liveQuery(() => bigmaManagerDb.app.mapArea).subscribe(
      (bounds: string) => {
        const bbox = bounds?.split(',').map(Number.parseFloat);
        if (!bbox) return;
        const [southwest_lng, southwest_lat, northeast_lng, northeast_lat] =
          bbox;
        this.map.flyToBounds(
          new L.LatLngBounds(
            [southwest_lat, southwest_lng],
            [northeast_lat, northeast_lng]
          ),
          {
            duration: 0.3,
            maxZoom: 4,
          }
        );
      }
    );
    this.subscriptions.push(sub1);
  }

  disconnectedCallback() {
    this.subscriptions?.forEach((sub) => sub?.unsubscribe());
  }

  render() {
    return <Host></Host>;
  }
}
