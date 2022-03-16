import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'mtv-shadow-fragment',
  scoped: true,
})
export class MtvShadowFragment {
  /**
   * Uniqe name for internal classes names and ect
   */
  @Prop() name: string;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
