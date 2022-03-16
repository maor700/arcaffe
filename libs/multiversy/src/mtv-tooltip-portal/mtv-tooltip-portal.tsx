import { Component, Element, h, Host, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'mtv-tooltip-portal',
  styleUrl: 'mtv-tooltip-portal.scss',
})
export class TooltipPortal {
  /**
   * Uniqe name for internal classes names and ect
   */
  @Prop() nameId: string;

  /**
   * The target container that will contain the portaled element.
   */
  @Prop() targetContainer?: HTMLElement = window?.top?.document?.body;

  /**
   * The Position of the portaled element.
   */
  @Prop() position?: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Background color of the tooltip;
   */
  @Prop() background?: string = 'transparent';
  
  @State() styles = '';
  
  /**
   * tooltipBlur event fired when tooltip element out of focus, or in shortly - blurred;
   */
  @Event()
  tooltipBlur: EventEmitter;

  @Element() elm: HTMLDivElement;

  portal: HTMLMtvPortalElement;

  componentDidLoad() {
    const headElements = document.head.querySelectorAll(`link[rel="stylesheet"], style`);
    this.styles = Array.from(headElements)
      .map(_ => _.outerHTML)
      .join('');
  }

  disconnectedCallback() {
    this.portal.remove();
  }

  private _blurHandler = () => {
    this.tooltipBlur.emit();
  };

  render() {
    const { x, y } = this.position;
    return (
      <Host>
        <div class="tooltip-con">
          <mtv-portal
            tabIndex={1}
            style={{
              ...portalStyle,
              left: `${x}px`,
              top: `${y}px`,
              background: this.background,
            }}
            ref={elm => (this.portal = elm)}
            headInlineHtml={this.styles}
            nameId={this.nameId}
            onBlur={this._blurHandler}
            onElementLandedInTarget={() => {
              this.portal.focus();
            }}
            targetContainer={this.targetContainer}
          >
            <div class="overlay"></div>
            <slot></slot>
          </mtv-portal>
        </div>
      </Host>
    );
  }
}

const portalStyle = {
  transition: 'all .2s ease',
  background: '#eee',
  position: 'absolute',
  display: 'block',
  zIndex: '9999',
  outline: 'none',
  border: 'none',
};
