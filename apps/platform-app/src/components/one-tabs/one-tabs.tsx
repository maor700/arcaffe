import { Component, Host, h, Prop, Element, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'one-tabs',
  styleUrl: 'one-tabs.css',
})
export class OneTabs {
  children: Element[];
  @Prop({ reflect: true }) forceSelectedTab: string
  @State() selectedTab: string;
  @Element() elm: HTMLDivElement;
  @Event() selected: EventEmitter<{ selected: string }>
  selectHandler = (ev: any) => {
    const tabName = ev?.target?.tabName
    this.selectedTab = ev?.target?.tabName;
    this.selected.emit({ selected: tabName });
  }

  componentWillLoad() {
    this.selectedTab = this.forceSelectedTab ?? this.selectedTab;
    this.children = Array.from(this.elm.children || []);
  }

  componentShouldUpdate(newVal: any, oldVal: any, propName: string) {
    if (propName === "forceSelectedTab" && newVal !== oldVal) {
      this.selectedTab = newVal;
    }
  }

  render() {
    this.children.forEach((tabElm => {
      const tabName = tabElm.getAttribute("tab-name");
      const isSelected = tabName === this.selectedTab;
      tabElm.classList.toggle("selected", isSelected);
      tabElm.toggleAttribute("selected", isSelected);
      tabElm.addEventListener("click", this.selectHandler);
    }));

    return (
      <Host >
      </Host>
    );
  }

}
