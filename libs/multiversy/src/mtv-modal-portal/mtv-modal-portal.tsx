import { Component, Element, h, Host, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'mtv-modal-portal',
  styleUrl: 'mtv-modal-portal.scss',
  shadow:true
})
export class MtvModalPortal {
  /**
   * Id for the portal element
   */
  @Prop() nameId: string;

  /**
   * Element To put the portal into. it's Can be element from current document or even element from another document like iframe parent body.
   */
  @Prop() targetContainer: HTMLElement;

  /**
   * Overlay background color
   */
  @Prop({reflect:true}) overlayColor: string = 'rgba(0, 0, 0, 0.8)';

  /**
   * Hide overlay element
   */
  @Prop() hideOverlay: boolean = false;

  @State() styles = '';

  /**
   * elementLandedInTarget event fired when the element complete to land on targetContainer.
   */
  @Event({ bubbles: true, composed: true })
  elementLandedInTarget: EventEmitter<{
    portalElm: HTMLElement;
    portalContentElm: HTMLElement;
    target: HTMLElement;
    modalContentElm: HTMLDivElement;
  }>;

  @Element() elm: HTMLDivElement;

  @Event()
  portalLoaded: EventEmitter<HTMLElement>;

  portal: HTMLMtvPortalElement;

  modalContentElm: HTMLDivElement;

  componentDidLoad() {
    const headElements = document.head.querySelectorAll(`link[rel="stylesheet"], style`);
    this.styles = Array.from(headElements)
      .map(_ => _.outerHTML)
      .join('');
  }

  disconnectedCallback() {
    this.portal.remove();
  }

  render() {
    return (
      <Host>
        <div innerHTML={this.styles}></div>
        <mtv-portal
          onElementLandedInTarget={ev => {
            ev.stopPropagation();
            this.elementLandedInTarget.emit({ ...ev.detail, modalContentElm: this.modalContentElm });
          }}
          ref={elm => (this.portal = elm)}
          nameId={this.nameId}
          style={portalCss}
          targetContainer={this.targetContainer}
        >
          <div
            ref={elm => {
              this.modalContentElm = elm;
            }}
            class="modal-con"
          >
            <style>{modalStyle}</style>
            <slot></slot>
            <style>{getOverlayStyle(this.overlayColor)}</style>
            {!this.hideOverlay && <div class="overlay"></div>}
          </div>
        </mtv-portal>
      </Host>
    );
  }
}

const portalCss = {
  position: 'fixed',
  display: 'grid',
  top: '0',
  left: '0',
  zIndex: '10000',
  placeContent: 'center',
  height: '-webkit-fill-available',
  width: '-webkit-fill-available',
};

const modalStyle = `.modal{
  padding: 1em;
  border-radius: 3px;
}`;

const getOverlayStyle = background => `.modal-con .overlay{
  background: ${background};
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}`;
