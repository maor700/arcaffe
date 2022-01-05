import { Component, Prop, State } from '@stencil/core';
import React from 'react';
import ReactDOM from "react-dom";
console.log(ReactDOM);
console.log(React);

@Component({
  tag: 'portal-panel',
  styleUrl: 'portal-panel.css',
  shadow: false,
})
export class PortalPanel {
  @Prop() isOpened: boolean = true;
  @Prop() portalGateSelector: string;
  @Prop() name: string;
  @State() portalGateElement: Element;
  @State() modalElm: HTMLElement;

  componentDidLoad() {
    // const modalElm = document.createElement("div");
    // modalElm.classList.add(this.name);
    // this.modalElm = modalElm;
    const hostDoc = this.getHostDocument();
    const modalsConElm = hostDoc.querySelector(this.portalGateSelector);
    this.portalGateElement = modalsConElm;
    console.log(modalsConElm);
    
    // modalsConElm?.append(modalsConElm);
    
  }

  getHostDocument = () => window?.parent?.document?.body ?? window.document.body;

  render() {
    ReactDOM.render(
      React.createElement('div', null, `Hello jgjhk`),
      this.portalGateElement
    )
    return null;
  }

}

