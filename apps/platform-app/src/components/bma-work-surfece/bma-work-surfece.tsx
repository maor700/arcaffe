import { bigmaManagerDb, ILayoutRecord } from '@arcaffe/store';
import { Component, h, Host, Element, State } from '@stencil/core';
import { liveQuery } from 'dexie';
import { ComponentContainer, GoldenLayout } from 'golden-layout/dist/esm';
import { LayoutConfig, RootItemConfig } from 'golden-layout/dist/types';
import { layoutStateChanged } from '../../globals/channels';

@Component({
  assetsDirs: ['./img'],
  tag: 'bma-work-surfece',
  styleUrl: 'bma-work-surfece.less',
})
export class BmaWorkSurfece {
  @State() layoutChanged: ILayoutRecord[];
  @State() layoutCurrentState: string = null;
  @State() loaded = false;
  @Element() elm;
  private myLayout;

  componentWillLoad() {
    this.myLayout = new GoldenLayout(this.elm);
    this.myLayout.registerComponentFactoryFunction('users', users);
    this.myLayout.registerComponentFactoryFunction('materials', materials);
    this.myLayout.registerComponentFactoryFunction('timeline', timeline);
    this.myLayout.registerComponentFactoryFunction('chart', chart);
    this.myLayout.registerComponentFactoryFunction('map', map);

    liveQuery(async () => {
      return await bigmaManagerDb.app.layout;
    }).subscribe((layoutRecord: ILayoutRecord) => {
      this.myLayout.loadLayout(layoutRecord?.layout);
      this.layoutCurrentState = JSON.stringify(layoutRecord?.layout);
    });

    this.myLayout.on('stateChanged', async () => {
      if (!this.loaded) return;
      console.log('changed');

      const newState: LayoutConfig = this.myLayout?.toConfig();
      const newStateStr = JSON.stringify(newState);
      if (newStateStr !== this.layoutCurrentState) {
        layoutStateChanged.postMessage(newState);
        this.myLayout.updateSize();
        this.layoutCurrentState = newStateStr;
      }
    });

    const observer = new ResizeObserver(() => {
      this.myLayout.updateSize();
    });
    observer.observe(this.elm);
  }

  componentDidLoad() {
    this.loaded = true;
  }

  render() {
    return (
      <Host style={{ direction: 'ltr', width: '100%', height: '100%' }}></Host>
    );
  }
}

function users(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-window style="width:100%; height:100%">
  <bma-iframe-kid
    slot="main"
    class="main"
    src="http://localhost:3001/"
    name="users"
  ></bma-iframe-kid>
</bma-window>`;
  container.element.appendChild(span);
  return;
}

function materials(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-window style="width:100%; height:100%">
  <bma-iframe-kid
    slot="main"
    class="main"
    src="http://localhost:3005/"
    name="materials"
  ></bma-iframe-kid>
</bma-window>`;
  container.element.appendChild(span);
  return;
}

function timeline(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-window style="width:100%;">
  <bma-iframe-kid
    slot="main"
    class="main"
    src="http://localhost:3002/"
    name="users"
  ></bma-iframe-kid>
</bma-window>`;
  container.element.appendChild(span);
  return;
}

function chart(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-iframe-kid
  head-code="<script defer>document.addEventListener('DOMContentLoaded', ()=>{const elm = document.querySelector('.referer-warning'); if(elm){elm.remove()}}, false);</script>"
  src="https://cdpn.io/andreic/fullpage/KKyzJMW"
  style="height:100%;width:100%"></bma-iframe-kid>`;
  container.element.appendChild(span);
  return;
}

function map(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-window style="width:100%; height:100%">
  <bma-map slot="main" />
</bma-window>`;
  container.element.appendChild(span);
  return;
}

bigmaManagerDb.on('populate', async () => {
  bigmaManagerDb.layouts.bulkAdd([
    { name: 'base layout', layout: { root: config_1 } },
    { name: 'lists and map', layout: { root: config_2 } },
  ]);
  bigmaManagerDb.app.layout = { name: 'base layout', layout: config_1 };
});

let config_1: RootItemConfig = {
  type: 'row',
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'column',
          content: [
            {
              type: 'row',
              height: 75,
              content: [
                {
                  type: 'stack',
                  width: 70,
                  content: [
                    {
                      type: 'component',
                      componentType: 'map',
                      componentName: 'map',
                    },
                    {
                      type: 'component',
                      componentType: 'chart',
                      componentName: 'chart',
                    },
                  ],
                },
                {
                  type: 'stack',
                  width: 30,
                  content: [
                    {
                      type: 'component',
                      componentType: 'users',
                      componentName: 'משתמשים',
                    },
                    {
                      type: 'component',
                      componentType: 'materials',
                      componentName: 'חומרים',
                    },
                  ],
                },
              ],
            },
            {
              type: 'component',
              componentType: 'timeline',
              componentName: 'ציר זמן',
              height: 25,
            },
          ],
        },
      ],
    },
  ],
};

let config_2: RootItemConfig = {
  type: 'row',
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'column',
          content: [
            {
              type: 'row',
              height: 75,
              content: [
                {
                  type: 'stack',
                  width: 30,
                  content: [
                    {
                      type: 'component',
                      componentType: 'users',
                      componentName: 'users',
                    },
                    {
                      type: 'component',
                      componentType: 'materials',
                      componentName: 'חומרים',
                    },
                  ],
                },
                {
                  type: 'stack',
                  width: 70,
                  content: [
                    {
                      type: 'component',
                      componentType: 'map',
                      componentName: 'map',
                    },
                    {
                      type: 'component',
                      componentType: 'chart',
                      componentName: 'chart',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
