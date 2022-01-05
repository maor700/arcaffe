import { Component, h, Host, Listen, Prop, State } from '@stencil/core';
import { Dimensions } from '../bma-iframe-kid/bma-iframe-kid';
import { DisplayModes } from './types';

@Component({
  tag: 'bma-window',
  styleUrl: 'bma-window.less',
})
export class BmaWindow {
  /**
   * Is resizable
   */
  @Prop() dimensions: Dimensions;

  /**
   * Is resizable
   */
  @Prop() resize: string;

  /**
   * Display modes
   */
  @Prop() displayMode: DisplayModes;

  /**
   * Enabled Display modes
   */
  @Prop() enabledDisplayModes: DisplayModes[];

  @State() mode: DisplayModes = DisplayModes['normal'];

  @Listen('changeDisplayMode')
  todoCompletedHandler({ detail }: CustomEvent<DisplayModes>) {
    this.displayMode = detail;
  }

  render() {
    console.log(this.displayMode);

    return (
      <Host>
        <div class={'window grid-header-footer-con ' + this.displayMode}>
          <slot name="header"></slot>
          <div class="main main-con">
            <slot name="main">Content</slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
