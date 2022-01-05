import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'work-surface',
  styleUrl: 'work-surface.css',
  shadow: true,
})
export class WorkSurface {

  render() {
    return (
      <Host>
        <h1>משטח עבודה</h1>
      </Host>
    );
  }

}
