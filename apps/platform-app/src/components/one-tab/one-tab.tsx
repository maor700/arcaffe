import { Component, Host, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'one-tab',
  styleUrl: 'one-tab.css',
  // shadow: true,
})
export class OneTab {
  @Prop({ reflect: true }) tabName: string;
  @Prop({ reflect: true }) selected: string;
  @Prop({ reflect: true }) disabled: string;
  @Element() elm: HTMLElement;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
