import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bma-list',
  styleUrl: 'bma-list.less',
  shadow: true,
})
export class BmaList<T> {
  /**
   * Array of items
   */
  @Prop() items: T[];

  /**
   * Item render function
   */
  @Prop() itemRenderer: (item: T) => JSX.Element;

  render() {
    return <div class="list-con">{this.items?.map(this.itemRenderer)}</div>;
  }
}
