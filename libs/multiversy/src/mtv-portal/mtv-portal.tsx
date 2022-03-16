import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'mtv-portal',
  styleUrl: 'mtv-portal.scss',
})

export class MtvPortal {
  /**
   * Uniqe name for internal classes names and ect
   */
  @Prop() nameId: string;

  /**
   * The target container that will contain the portaled element.
   */
  @Prop() targetContainer: HTMLElement = window?.top?.document?.body;

  /**
   * HTML head inline code (scripts, links, styles ect...)  to inject to the targetContainer in addition to the portaled element itself;
   */
  @Prop() headInlineHtml: string;

  /**
   * portalLoaded event fired when the portal element complete to load.
   */
  @Event({ bubbles: true, composed: true })
  portalLoaded: EventEmitter<HTMLElement>;

  /**
   * elementLandedInTarget event fired when the element complete to land on targetContainer.
   */
  @Event({ bubbles: true, composed: true })
  elementLandedInTarget: EventEmitter<{
    portalElm: HTMLElement;
    portalContentElm: HTMLElement;
    target: HTMLElement;
  }>;

  portalContent: HTMLElement;
  private portal: HTMLElement;
  private element: HTMLElement;
  private moved = false;

  private createPortal() {
    this.portal = document.createElement('div');
    this.portal.setAttribute('id', this.nameId);
    this.targetContainer?.append(this.portal);
  }

  private moveElementToPortal() {
    this.portal.appendChild(this.element);
  }

  componentWillLoad() {
    this.createPortal();
  }

  componentDidLoad() {
    this.portalLoaded.emit(this.portalContent);
    this.moveElementToPortal();
  }

  connectedCallback() {
    if (this.portal?.parentNode === this.targetContainer) {
      this.moved = true;
      this.elementLandedInTarget.emit({
        portalElm: this.portal,
        portalContentElm: this.portalContent,
        target: this.targetContainer,
      });
    } else {
      this.moved = false;
    }
  }

  disconnectedCallback() {
    this.moved && this.portal.remove();
  }

  render() {
    return (
      <Host ref={el => (this.element = el)}>
        <div innerHTML={this.headInlineHtml}></div>
        <div
          ref={elm => {
            this.portalContent = elm;
          }}
          class="portal-content"
        >
          <slot></slot>
        </div>
      </Host>
    );
  }
}
