import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'mtv-window',
  styleUrl: 'mtv-window.scss',
  scoped: true,
})
export class MtvWindow {
  /**
   * Uniqe name for internal classes names and ect
   */
  @Prop() name: string;

  render() {
    return (
      <Host>
        <div class={'window grid-header-footer-con ' + (this.name ?? '')}>
          <slot name="header"></slot>
          <div class="main main-con">
            <slot name="main"></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
