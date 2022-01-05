import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
} from '@stencil/core';

@Component({
  tag: 'bma-iframe-cross',
  styleUrl: 'bma-iframe-cross.css',
  shadow: true,
})
export class BmaIframeCross {
  @Prop() src!: string;
  @Prop() width: number;
  @Prop() height: number;
  @State() html: string;
  @State() error: string;
  @Prop() iframeRef: HTMLIFrameElement;
  @Prop() scriptToInject: string;
  @Event() iframeLoad: EventEmitter<HTMLIFrameElement>;

  loadHandler = () => {
    this.iframeLoad.emit(this.iframeRef);
  };
  _loadUrl = () => {
    try {
      const { origin } = new URL(this.src);
      fetch(this.src, { mode: 'cors' })
        .then((response) => {
          response.text().then((text) => {
            const htmlWithBase = text.replace(
              /<head>((?:.|\n|\r)+?)<\/head>/,
              `<base href="${origin}"/>$1<script>${this.scriptToInject}</script>`
            );
            this.html = htmlWithBase;
            const doc = new DOMParser().parseFromString(this.html, 'text/html');
            console.log(doc);

            this.error = null;
          });
        })
        .catch(() => {
          this.error = 'טעינת המסגרת נכשלה';
        });
    } catch (error) {
      this.error = 'טעינת המסגרת נכשלה';
    }
  };
  componentWillLoad() {
    this._loadUrl();
  }

  render() {
    const dimensions =
      this.width || this.height
        ? { width: this.width + 'px', height: this.height + 'px' }
        : undefined;
    const props = dimensions ? { style: dimensions } : undefined;
    return (
      <Host {...props}>
        {this.html ? (
          <iframe
            {...dimensions}
            onLoad={this.loadHandler}
            ref={(elm) => {
              this.iframeRef = elm;
            }}
            srcDoc={this.html}
          >
            <h2>Loading...</h2>
          </iframe>
        ) : this.error ? (
          <div class="error">
            <div>{this.error}</div>
            <div>{this.src}</div>
            <div>
              <button onClick={this._loadUrl} class="btn">
                טען שוב
              </button>
            </div>
          </div>
        ) : null}
      </Host>
    );
  }
}
