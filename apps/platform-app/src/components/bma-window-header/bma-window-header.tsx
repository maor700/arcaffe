import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { DisplayModes } from '../bma-window/types';

@Component({
  tag: 'bma-window-header',
  styleUrl: 'bma-window-header.less',
})
export class BmaWindowHeader {
  /**
   * The window name
   */
  @Prop() windowName: string;

  /**
   * Emit event to change window display mode
   */
  @Event() changeDisplayMode: EventEmitter<DisplayModes>;
  private changeDisplayModeEmitter(mode: DisplayModes) {
    this.changeDisplayMode.emit(mode);
  }

  private btnClickHandler = ({ target }: MouseEvent) => {
    const mode = (target as HTMLElement).attributes.getNamedItem('data-mode');
    this.changeDisplayModeEmitter(DisplayModes?.[mode?.value]);
  };

  render() {
    return (
      <div class="win-header">
        <span>{this.windowName}</span>
        <div class="btns">
          <ui5-icon
            onClick={this.btnClickHandler}
            data-mode="minimized"
            title="מזער"
            name="less"
          ></ui5-icon>
          <ui5-icon
            onClick={this.btnClickHandler}
            data-mode="dettached"
            title="נתק"
            name="popup-window"
          ></ui5-icon>
          <ui5-icon
            onClick={this.btnClickHandler}
            data-mode="fullscreen"
            title="מסך מלא"
            name="border"
          ></ui5-icon>

          <ui5-icon
            onClick={this.btnClickHandler}
            data-mode="closed"
            title="סגור"
            name="decline"
          ></ui5-icon>
        </div>
      </div>
    );
  }
}
