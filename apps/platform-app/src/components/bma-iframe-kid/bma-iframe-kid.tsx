/* eslint-disable @stencil/async-methods */
import {
  Component,
  Host,
  h,
  EventEmitter,
  Event,
  Prop,
  Method,
  State,
  Element,
} from '@stencil/core';
import { BigmaManagerDB, GustModel } from '@arcaffe/store';

export type Dimensions = { width: number; height: number };

@Component({
  tag: 'bma-iframe-kid',
  styleUrl: 'bma-iframe-kid.css',
  assetsDirs: ['assets'],
})
export class BmaIframeKid {
  /**
   * Name of iframe module, needed for dexie db record.
   */
  @Prop() name: string;
  /**
   * Is Hidden?
   */
  @Prop() hidden: boolean;
  /**
   * Url address to load
   */
  @Prop() src: string;
  /**
   * Data model to inject the iframe
   */
  @Prop({ mutable: true }) model: GustModel;
  /**
   * Services to inject the iframe
   */
  @Prop({ mutable: true }) services;
  /**
   * Public Method on the element that called when the child mount and let the parent know about his new baby;
   */
  @Event() registerMe: EventEmitter;
  @State() ready = false;
  @State() loader = false;
  @State() errors: string[] = null;
  @State() dimensions: Dimensions = {
    width: NaN,
    height: NaN,
  };
  @Element() el: HTMLBmaIframeKidElement;

  private registerMeHandler(name: string) {
    this.loader = true;
    this.registerMe.emit(name);
  }
  /**
   *
   * @param registrationResponse is the response of the registration
   * @returns Promise<boolean> represent the registration response handling success
   */
  @Method()
  async registrationResponse({
    success,
    payload,
    errors,
  }: RegistrationResponse): Promise<boolean> {
    this.loader = false;
    try {
      if (success) {
        const { model, services } = payload;
        this.model = new GustModel(model, this.name);
        this.services = services;
        this.ready = true;
      } else {
        this.ready = false;
      }
      return this.ready;
    } catch (error) {
      this.errors = [error];
      this.errors ??= errors;
    }
    return this.ready;
  }

  componentWillLoad() {
    this.registerMeHandler(this.name);
  }
  componentDidLoad() {
    const observer = new ResizeObserver(([{ contentRect }]) => {
      const { width, height } = contentRect;
      this.dimensions = { width, height };
    });
    observer.observe(this.el);
  }

  private loadHandler = (_event: CustomEvent<HTMLIFrameElement>) => {
    this.loader = false;
  };

  render() {
    const props = this.hidden
      ? { style: { display: this.hidden ? 'none' : 'initial' } }
      : {};
    return (
      <Host
        {...props}
        aria-hidden={this.hidden ? 'true' : 'false'}
        id={`${this.name}-iframe-wrapper`}
        class="kid-con"
      >
        {this.loader && <div class="loader">loading...</div>}
        {this.errors?.length && (
          <div class="errors">
            {this.errors.map((err) => (
              <div class="err-item">{err}</div>
            ))}
          </div>
        )}
        <div class="header">
          <slot name="header"></slot>
        </div>
        <div class="content">
          {this.ready && (
            <bma-iframe-cross
              {...this.dimensions}
              onIframeLoad={this.loadHandler}
              scriptToInject={`const gustName='${this.name}'`}
              slot="iframe"
              src={this.src}
            ></bma-iframe-cross>
          )}
        </div>
      </Host>
    );
  }
}

export type RegistrationResponse = {
  success: boolean;
  payload: { services; model: BigmaManagerDB };
  errors?: string[];
};
