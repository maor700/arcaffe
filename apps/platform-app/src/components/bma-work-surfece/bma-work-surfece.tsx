import { Component, h, Host, Element } from '@stencil/core';

import {
  ComponentContainer,
  GoldenLayout,
  LayoutConfig,
} from 'golden-layout/dist/esm';

@Component({
  assetsDirs:["./img"],
  tag: 'bma-work-surfece',
  styleUrl: 'bma-work-surfece.less',
})
export class BmaWorkSurfece {
  @Element() elm;

  componentDidLoad() {
    const myLayout = new GoldenLayout(this.elm);
    myLayout.registerComponentFactoryFunction('משתמשים', users);
    myLayout.registerComponentFactoryFunction('materials', materials);
    myLayout.registerComponentFactoryFunction('timeline', timeline);
    myLayout.registerComponentFactoryFunction('chart', chart);
    myLayout.registerComponentFactoryFunction('map', map);
    myLayout.loadLayout(config);
  }

  render() {
    return (
      <Host style={{direction:"ltr",width:"100%", height:"100%"}}></Host>
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

const config: LayoutConfig = {
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'column',
          content: [
            {
              type: 'row',
              height:75,
              content: [
                {
                  type: 'stack',
                  width:70,
                  content: [
                    {
                      type: 'component',
                      componentName: 'map',
                    },
                    {
                      type: 'component',
                      componentName: 'chart',
                    },
                  ],
                },
                {
                  type: 'stack',
                  width:30,
                  content: [
                    {
                      type: 'component',
                      componentName: 'משתמשים',
                    },
                    {
                      type: 'component',
                      componentName: 'materials',
                    },
                  ],
                },
              ],
            },
            {
              type: 'component',
              componentName: 'timeline',
              height: 25,
            },
          ],
        },
      ],
    },
  ],
} as LayoutConfig;
