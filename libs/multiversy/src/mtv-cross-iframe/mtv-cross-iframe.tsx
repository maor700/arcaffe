import { Component, Host, h, Prop, State, Watch, Element } from '@stencil/core';
import { fetchGustHtml } from './fetchGustHtml';

@Component({
  tag: 'mtv-cross-iframe',
  styleUrl: 'mtv-cross-iframe.scss',
})
export class MtvCrossIframe {
  /**
   * The url of the gust app to be hosted.
   */
  @Prop({ mutable: true, reflect: true }) src: string;

  /**
   * The route of the gust app.
   */
  @Prop({ mutable: true, reflect: true }) route: string;

  /**
   * The app name id.
   */
  @Prop() name: string;

  /**
   * Head code to inject to the iframe, styles, links and scripts;
   */
  @Prop() headCode: string;

  /**
   * Fit size of the Element to the content of the iframe;
   */
  @Prop({ mutable: true, reflect: true }) fitToContent: boolean | string; // string = selector of the element target in iframe

  /**
   * Disable loader on iframe loading;
   */
  @Prop() disableLoader: boolean = false;

  /**
   * Disable loader on iframe loading;
   */
  @Prop() appRoute: boolean = false;

  /**
   * The final html to inject to the iframe
   */
  @State() htmlSrc: string;

  /**
   * is Loading status
   */
  @State() isLoading: boolean = false;

  /**
   * Iframe html fetch error message
   */
  @State() fetchError: string | null = null;

  @Element() elm: HTMLElement;

  iframeElm: HTMLIFrameElement;

  iframeContentElm: null | HTMLElement;

  resizeObserver: ResizeObserver = null;

  $store: { map: any; user: any; route: { url: string; data: any } };

  /**
   * Handle src changes, load the html...
   */
  @Watch('src')
  public async loadUrl(url: string) {
    try {
      this.isLoading = true;
      this.fetchError = null;
      this.htmlSrc = await this.buildHtmlFromGustUrl(url);
    } catch (error) {
      this.fetchError = error;
      this.isLoading = false;
    }
  }
  /**
   * Handle htmlSrc changes, create new iframe document.
   */
  @Watch('htmlSrc')
  public async createNewDoc(newHtml: string) {
    try {
      this.isLoading = true;
      this.fetchError = null;
      this.iframeElm.contentDocument.open();
      this.iframeElm.contentDocument.write(newHtml);
      this.iframeElm.contentDocument.close();
    } catch (error) {
      this.fetchError = error;
    } finally {
      this.isLoading = false;
    }
  }
  /**
   * Handle route changes
   */
  // @Watch('route')
  // public async handleRouteChanges(route: string) {
  //   try {
  //     this.isLoading = true;
  //     this.fetchError = null;
  //     this.htmlSrc = await this.buildHtmlFromGustUrl(route);
  //   } catch (error) {
  //     this.fetchError = error;
  //     this.isLoading = false;
  //   }
  // }

  /**
   * Handle fitToContent changes, resize according to some selector or body element by default.
   */
  @Watch('fitToContent')
  public async resizeHandler(newVal: null | HTMLElement) {
    this.resizeObserver?.disconnect();
    const relevantContainer = this.iframeElm ?? this.elm;
    const relevantForQuery = (relevantContainer as HTMLIFrameElement)?.contentDocument ?? relevantContainer;
    const targetElm = newVal ? relevantForQuery.querySelector<any>(newVal) : null;
    if (targetElm) {
      this.resizeObserver = new ResizeObserver(entries => {
        const [entry] = entries;
        if (!entry?.target) return;
        const { target } = entry;
        const { width, height } = target.getBoundingClientRect();
        relevantContainer.style.setProperty('inline-size', width + 'px');
        relevantContainer.style.setProperty('block-size', height + 'px');
      });
      this.resizeObserver.observe(targetElm);
    }
  }

  componentWillLoad() {
    this.loadUrl(this.src);
  }

  public async buildHtmlFromGustUrl(url: string) {
    let originalHtml = '';
    try {
      if (!url) return null;
      originalHtml = await fetchGustHtml(url);
    } catch (error) {
      throw 'Failed to fetch the app url:' + this.src;
    } finally {
      this.isLoading = false;
    }
    const { origin } = new URL(this.src);
    const hasHead = originalHtml?.indexOf(`<head>`) !== -1;
    originalHtml = !hasHead ? originalHtml?.replace(/(<html>)((?:.|\n|\r)+?)?(<\/html>)/, `$1<head></head>$2$3`) : originalHtml;
    const htmlWithBase = originalHtml?.replace(/(<head>)((?:.|\n|\r)+?)?(<\/head>)/, `$1<base href="${origin}"/>${iframeInjectedCSS}${this.headCode ?? ''}$2$3`);
    return htmlWithBase;
  }

  loadHandler = () => {
    const ev = new CustomEvent('load', { detail: { iframeElm: this.iframeElm, iframeContentElm: this.iframeContentElm, elm: this.elm } });
    this.elm.dispatchEvent(ev);
    if (this.elm.hasAttribute('fit-to-content')) {
      this.fitToContent = this.fitToContent ? this.fitToContent + ' ' : 'body';
    }
  };

  render() {
    const sizeStyle = this.fitToContent ? { '--size': 'fit-content' } : null;
    return (
      <Host style={sizeStyle}>
        <iframe
          style={{ display: `${this.htmlSrc ? 'block' : 'none'}` }}
          name={this.name}
          ref={elm => {
            this.iframeElm = elm;
          }}
          class={this.fitToContent ? '' : 'full'}
          data-url={this.src}
          onLoad={this.loadHandler}
        ></iframe>
        {!this.disableLoader && this.isLoading ? (
          <div class="loading">
            <div class="loader">Loading...</div>
          </div>
        ) : null}
        {this.fetchError ? (
          <div class="fetchError">
            {this.fetchError}
            <button onClick={() => this.loadUrl(this.src)} class="btn">
              Load Again
            </button>
            {this.htmlSrc && (
              <button
                onClick={() => {
                  this.fetchError = null;
                }}
                class="btn"
              >
                Close
              </button>
            )}
          </div>
        ) : null}
        <slot></slot>
      </Host>
    );
  }
}

const iframeInjectedCSS = `
<style>
* {
  scrollbar-width: none;
  scrollbar-color: #3d3d3d #171717;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #c5c5c5;
}

*::-webkit-scrollbar-thumb {
  background-color: #939393;
  border-radius: 0px;
  border: 0px solid #ffffff;
}
</style>
`;
