import { Component, Event, h, EventEmitter, Prop } from '@stencil/core';
import { DisplayModes } from './types';

@Component({
  tag: 'mtv-window-header',
  styleUrl: 'mtv-window-header.scss',
})
export class MtvWindowHeader {
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
          <div onClick={this.btnClickHandler} title="סגור">X</div>
        </div>
      </div>
    );
  }
}
