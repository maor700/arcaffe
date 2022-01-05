import { Component, Host, h, State, Watch } from '@stencil/core';
import { liveQuery } from 'dexie';
import { AppServices } from '../..';
import { IMission } from '@arcaffe/store';

import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/less.js';
import '@ui5/webcomponents-icons/dist/border.js';
import '@ui5/webcomponents-icons/dist/popup-window.js';
import '@ui5/webcomponents/dist/Button.js';

let services: AppServices = null;

@Component({
  tag: 'bma-main',
  styleUrl: 'bma-main.less',
  shadow: true,
  assetsDirs: ['assets'],
})
export class BmaMain {
  @State() showIframe = false;
  @State() bigMamaIsReady: boolean;
  @State() mission: IMission;
  @State() locations: { lon: number; lat: number }[] = [];

  @Watch('bigMamaIsReady')
  initHandler(currentValue, oldValue) {
    if (currentValue && !oldValue) {
      const materials$ = liveQuery(async () => {
        const activeIframes = (
          await services.model.iframes.where({ isActive: 1 }).toArray()
        ).map((iframeRecord) => iframeRecord.name);
        const materials = await services.model.materials
          .where('ownerApp')
          .anyOf(activeIframes)
          .toArray();
        return materials;
      });
      materials$.subscribe((_) => console.log(_, 'main'));
      (services.dexie as any)
        .liveQuery(() => services.model.app.activeMission)
        .subscribe((mission: IMission) => {
          this.mission = mission;
        });
    }
  }

  private onBigmamaReay = ({ detail }: CustomEvent<AppServices>) => {
    services = detail;
    this.bigMamaIsReady = true;
  };

  render() {
    return (
      <Host>
        <bma-manager
          style={{ height: '100%' }}
          class="manager grid-header-footer-con"
          onReady={this.onBigmamaReay}
        >
          <div class="header">
            <one-header class="header" />
          </div>
          <div class="main">
            <main style={{ height: '100%' }}>
              <stencil-router>
                <stencil-route-switch>
                  <stencil-route url="/work-surface">
                    <div
                      class="con"
                      style={{ display: 'flex', height: '100%' }}
                    >
                      <bma-window style={{ width: '100%', height: '100%' }}>
                        <bma-window-header
                          slot="header"
                          class="header"
                          windowName="משתמשים"
                        ></bma-window-header>
                        <bma-iframe-kid
                          slot="main"
                          class="main"
                          src={'http://localhost:3001/'}
                          name="users"
                        ></bma-iframe-kid>
                      </bma-window>
                      <bma-window style={{ width: '100%', height: '100%' }}>
                        <bma-window-header
                          slot="header"
                          class="header"
                          windowName="Materials"
                        ></bma-window-header>
                        <bma-iframe-kid
                          slot="main"
                          class="main"
                          src={'http://localhost:3005/'}
                          name="materials"
                        ></bma-iframe-kid>
                      </bma-window>
                      <bma-window style={{ width: '100%', height: '100%' }}>
                        <bma-map slot="main" />
                      </bma-window>
                    </div>
                  </stencil-route>
                  <stencil-route url="/display-surface">
                    משטח הצגה
                  </stencil-route>
                  <stencil-route url="/files">קבצים</stencil-route>
                  <stencil-route url="/mission-activity">
                    פעילות במשימה
                  </stencil-route>
                </stencil-route-switch>
              </stencil-router>
            </main>
          </div>
          <div class="footer">
            <bma-window style={{ width: '100%', height: '400px' }}>
              <bma-window-header
                slot="header"
                class="header"
                windowName="ציר זמן"
              ></bma-window-header>
              <bma-iframe-kid
                slot="main"
                class="main"
                src={'http://localhost:3002/'}
                name="users"
              ></bma-iframe-kid>
            </bma-window>
          </div>
        </bma-manager>
      </Host>
    );
  }
}
