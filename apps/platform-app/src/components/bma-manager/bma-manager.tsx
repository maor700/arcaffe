import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { bigmaManagerDb } from '@arcaffe/store';
import Dexie from "dexie";
import { AppServices } from '../..';
import { ReplaySubject } from 'rxjs';
import Toaster from "toastr";
import Faker from "faker";
console.log(Faker);
console.log(bigmaManagerDb);


@Component({
  tag: 'bma-manager',
  styleUrls: ['bma-manager.css'],
  // shadow: true,
})
export class BmaManager {
  @Prop() name: string;
  @Prop() userId: string;
  @Event() ready: EventEmitter<AppServices>;
  toasterCon: HTMLDivElement;
  $ready = new ReplaySubject<AppServices>()
  services: AppServices = null;

  constructor() {
    // create dbs
    // assign services and dbs to window
    const services = { model: bigmaManagerDb, dexie: Dexie as any, toaster: Toaster };
    window.parentApp = { services };
    this.services = services;
  }

  componentDidLoad() {
    Toaster.options.target = this.toasterCon as any;
    this.ready.emit(this.services);
  }


  private _iframeKidRegistration = async (name, element: HTMLBmaIframeKidElement) => {
    // register kids
    this.services.model.iframes.upsert(name, { name, isActive: 1, displayMode: "opened" });
    const initSuccess = await element.registrationResponse({ success: true, payload: { services: {}, model: this.services.model } })
    console.log(initSuccess);
  }

  private registrationHandler = ({ detail, target }: CustomEvent<string>) => {
    this._iframeKidRegistration(detail, target as HTMLBmaIframeKidElement);
  }

  render() {
    return (
      <Host onRegisterMe={this.registrationHandler}>
        <slot></slot>
        <div ref={(elm) => { this.toasterCon = elm }} class="toastr"></div>
      </Host>
    );
  }
}

