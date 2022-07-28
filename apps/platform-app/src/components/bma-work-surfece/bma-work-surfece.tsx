import { bigmaManagerDb, ILayoutRecord } from '@arcaffe/store';
import { Component, h, Host, Element, State } from '@stencil/core';
import { liveQuery } from 'dexie';
import {
  ComponentContainer,
  GoldenLayout,
} from 'golden-layout/dist/esm';
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
    this.myLayout = (window as any).myLayout = new GoldenLayout(this.elm);
    this.myLayout.registerComponentFactoryFunction('users', users);
    this.myLayout.registerComponentFactoryFunction('flights', flights);
    this.myLayout.registerComponentFactoryFunction('materials', materials);
    this.myLayout.registerComponentFactoryFunction('timeline', timeline);
    this.myLayout.registerComponentFactoryFunction('chart', chart);
    this.myLayout.registerComponentFactoryFunction('map', map);
    this.myLayout.registerComponentFactoryFunction('ui5App', ui5App);

    liveQuery(async () => {
      return await bigmaManagerDb.app.layout;
    }).subscribe((layoutRecord: ILayoutRecord) => {
      if (!this.myLayout.isInitialised) return;
      this.myLayout.loadLayout(layoutRecord?.layout);
      this.layoutCurrentState = JSON.stringify(layoutRecord?.layout);
    });

    this.myLayout.on('stateChanged', async () => {
      if (!this.loaded) return;
      if (this.myLayout._isInitialised) {
        const newState: LayoutConfig = this.myLayout?.toConfig();
        const newStateStr = JSON.stringify(newState);
        if (newStateStr !== this.layoutCurrentState) {
          layoutStateChanged.postMessage(newState);
          this.myLayout.updateSize();
          this.layoutCurrentState = newStateStr;
        }
      }
    });

    // this.myLayout.on('stackCreated', function ({ target: stack }) {
    //   /*
    //    * Re-use the label
    //    */
    //   // var label = stack.layoutManager.config.labels.popout;

    //   /*
    //    * Callback when the user clicks the popout button
    //    */
    //   var popout = function () {
    //     /*
    //      * The currently selected item - that's the one you'd want to pop out
    //      */
    //     let item = stack._header.activeContentItem;
    //     // let indexInParent = stack._contentItems.findIndex(
    //     //   (e) => e._title == item._title
    //     // );

    //     /**
    //      * Remove the item as a child from the stack. true indicates that we DON'T
    //      * want the item to be destroyed
    //      */
    //     console.log('Items in the stack before: ' + stack._contentItems.length);
    //     stack.removeChild(item, true);

    //     /*************************************
    //      * From here on its up to you. item is an instance of contentItem (https://golden-layout.com/docs/Item.html),
    //      * you can access its element using item.element.
    //      */

    //     const winHtml = `<bma-window style="width:100%; height:100%">
    //     <bma-iframe-kid
    //       slot="main"
    //       class="main"
    //       src="http://localhost:3001/"
    //       name="users"
    //     ></bma-iframe-kid>
    //   </bma-window>`;

    //     const newWin = window.open(
    //       'http://localhost:3334/',
    //       'win',
    //       `width=800,height=400,screenX=200,screenY=200`
    //     );

    //     setTimeout(() => {
    //       newWin.document.open();
    //       newWin.document.write(winHtml);
    //       newWin.document.close();
    //     }, 5000);

    //     // displayProxyPopup(item, stack, indexInParent);
    //   };

    //   // Fix for reordering of "open in new window" icon.
    //   console.log({ stack });

    //   let ctrlsCtr = stack._header._controlsContainerElement;
    //   console.log({ ctrlsCtr });
    //   const popuotElm = ctrlsCtr.querySelector('.lm_popout');
    //   let openWinIcon = popuotElm.cloneNode(true);
    //   popuotElm.remove();
    //   openWinIcon.addEventListener('click', popout);
    //   $(ctrlsCtr).prepend(openWinIcon);
    // });

    // var displayProxyPopup = (item, stack, indexInParent) => {
    //   addItemBackToLayout(item, stack, indexInParent);
    // };

    // var addItemBackToLayout = (item, stack, indexInParent) => {
    //   if (item.isComponent) {
    //     let itemConfig = {
    //       id: item._title,
    //       type: 'component',
    //       component: item._component,
    //       componentName: item._componentName,
    //       props: item._props,
    //       title: item._title,

    //       componentState: item._componentState,
    //     };
    //     console.log('Items in the after: ' + stack._contentItems.length);
    //     stack.addChild(itemConfig, indexInParent); // Doesn't do any favor.
    //   }
    // };

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
function flights(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-window style="width:100%; height:100%">
  <bma-iframe-kid
    slot="main"
    class="main"
    src="http://localhost:3006/"
    name="flights"
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
    src="https://cdpn.io/andreic/fullpage/KKyzJMW"
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

function ui5App(container: ComponentContainer) {
  const span = document.createElement('span');
  span.innerHTML = `<bma-iframe-kid
  src="http://localhost:4200/"
  style="height:100%;width:100%"></bma-iframe-kid>`;
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

let config_1: RootItemConfig = 
{
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
                      id: 'map',
                      type: 'component',
                      componentType: 'map',
                      componentName: 'map',
                    },
                    {
                      id: 'ui5App',
                      type: 'component',
                      componentType: 'ui5App',
                      componentName: 'ui5App',
                    },
                  ],
                },
                {
                  type: 'stack',
                  width: 30,
                  content: [
                    {
                      id: 'flights',
                      type: 'component',
                      componentType: 'flights',
                      componentName: 'טיסות',
                    },
                    {
                      id: 'users',
                      type: 'component',
                      componentType: 'users',
                      componentName: 'משתמשים',
                    },
                    {
                      type: 'component',
                      componentType: 'materials',
                      componentName: 'חומרים',
                      id: 'materials',
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
              id: 'timeline',
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
                      id: 'flights',
                      type: 'component',
                      componentType: 'flights',
                      componentName: 'טיסות',
                    },
                    {
                      type: 'component',
                      componentType: 'users',
                      componentName: 'users',
                      id: 'users',
                    },
                    {
                      type: 'component',
                      componentType: 'materials',
                      componentName: 'חומרים',
                      id: 'materials',
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
                      id: 'map',
                    },
                    {
                      type: 'component',
                      componentType: 'ui5App',
                      componentName: 'ui5App',
                      id: 'ui5App',
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
