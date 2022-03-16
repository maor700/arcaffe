import { Component, Host, h, Element, State } from '@stencil/core';
import { DisplayModes } from '../mtv-window-header/types';

// import { ComponentContainer, GoldenLayout, LayoutConfig } from 'golden-layout/dist/esm';

@Component({
  tag: 'mtv-main',
  styleUrl: 'mtv-main.scss',
})
export class MtvMain {
  @State() showWindow: boolean = true;
  @Element() elm;

  displayModeHandler: (mode: DisplayModes) => void = (mode) => {
    switch (mode) {
      case DisplayModes.dettached:
      case DisplayModes.fullscreen:
      case DisplayModes.minimized:
      case DisplayModes.normal:
        this.showWindow = true;
        break;
      case DisplayModes.closed:
        this.showWindow = false;
        break;
    }
  };

  componentDidLoad() {
    // const myLayout = new GoldenLayout(this.elm);
    // myLayout.registerComponentFactoryFunction('trees', Trees);
    // myLayout.registerComponentFactoryFunction('list', list);
    // myLayout.registerComponentFactoryFunction('timeline', timeline);
    // myLayout.registerComponentFactoryFunction('chart', chart);
    // myLayout.registerComponentFactoryFunction('map', map);
    // myLayout.loadLayout(config);
  }

  render() {
    return (
      <Host style={{ height: '100%', width: '100%', direction: 'rtl' }}>
        <button onClick={() => this.displayModeHandler(DisplayModes.normal)}>
          show
        </button>
        <mtv-modal-portal nameId="test">
          <h2
            style={{
              width: 'fit-content',
              heigt: 'fit-content',
              color: 'red',
            }}
          >
            TEST
          </h2>
        </mtv-modal-portal>
        {this.showWindow && (
          <mtv-window
            style={{ height: '100%', width: '100%', direction: 'rtl' }}
          >
            <mtv-window-header
              onChangeDisplayMode={({ detail }) =>
                this.displayModeHandler(detail)
              }
              style={{ background: 'red' }}
              slot="header"
              windowName="בדיקה"
            ></mtv-window-header>
            <mtv-cross-iframe
              name="graph"
              slot="main"
              head-code="<script defer>document.addEventListener('DOMContentLoaded', ()=>{const elm = document.querySelector('.referer-warning'); if(elm){elm.remove()}}, false);</script>"
              src="https://cdpn.io/andreic/fullpage/KKyzJMW"
              style={{ height: '100%', width: '100%' }}
            ></mtv-cross-iframe>
          </mtv-window>
        )}
      </Host>
    );
  }
}

// function Trees(container: ComponentContainer) {
//   const span = document.createElement('span');
//   span.innerHTML = `<mtv-cross-iframe src="https://trees-creator.vercel.app/" style="height:100%, width:100%;"></mtv-cross-iframe>`;
//   container.element.appendChild(span);
//   return;
// }

// function list(container: ComponentContainer) {
//   const span = document.createElement('span');
//   span.innerHTML = `<mtv-cross-iframe src="http://localhost:3001/" style="height:100%, width:100%;"></mtv-cross-iframe>`;
//   container.element.appendChild(span);
//   return;
// }

// function timeline(container: ComponentContainer) {
//   const span = document.createElement('span');
//   span.innerHTML = `<mtv-cross-iframe src="http://localhost:3002/" style="height:100%;width:100%;"></mtv-cross-iframe>`;
//   container.element.appendChild(span);
//   return;
// }

// function chart(container: ComponentContainer) {
//   const span = document.createElement('span');
//   span.innerHTML = `<mtv-cross-iframe
//   head-code="<script defer>document.addEventListener('DOMContentLoaded', ()=>{const elm = document.querySelector('.referer-warning'); if(elm){elm.remove()}}, false);</script>"
//   src="https://cdpn.io/andreic/fullpage/KKyzJMW"
//   style="height:100%;width:100%"></mtv-cross-iframe>`;
//   container.element.appendChild(span);
//   return;
// }

// function map(container: ComponentContainer) {
//   const span = document.createElement('span');
//   span.innerHTML = `<mtv-cross-iframe
//   head-code="<script defer>document.addEventListener('DOMContentLoaded', ()=>{const elm = document.querySelector('.referer-warning'); if(elm){elm.remove()}}, false);</script>"
//   src="https://cdpn.io/maor700/fullpage/xxPVMyB"style="height:100%;width:100%;"></mtv-cross-iframe>`;
//   container.element.appendChild(span);
//   return;
// }

// const config: LayoutConfig = {
//   content: [
//     {
//       type: 'row',
//       content: [
//         {
//           type: 'column',
//           content: [
//             {
//               type: 'row',
//               content: [
//                 {
//                   type: 'stack',
//                   content: [
//                     {
//                       type: 'component',
//                       componentName: 'map',
//                     },
//                     {
//                       type: 'component',
//                       componentName: 'chart',
//                     },
//                   ],
//                 },
//                 {
//                   type: 'column',
//                   content: [
//                     {
//                       type: 'component',
//                       componentName: 'list',
//                     },
//                     {
//                       type: 'component',
//                       componentName: 'list',
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               type: 'component',
//               componentName: 'timeline',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// } as LayoutConfig;
