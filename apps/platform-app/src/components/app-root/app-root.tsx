import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {

  render() {
    return (
      <Host>
        <stencil-router>
          <stencil-route-link url="/work-surface">work</stencil-route-link>
          <stencil-route-switch>
            <stencil-route url="/work-surface" routeRender={() => (<div>HII!</div>)} ></stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </Host>
    );
  }

}
