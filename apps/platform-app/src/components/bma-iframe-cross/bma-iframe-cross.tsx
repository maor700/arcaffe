import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
} from '@stencil/core';

const baseStyle = `<style>
* {
  scrollbar-width: none;
  scrollbar-color: #3d3d3d #171717;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #171717;
}

*::-webkit-scrollbar-thumb {
  background-color: #3d3d3d;
  border-radius: 0px;
  border: 0px solid #ffffff;
}
</style>`;

@Component({
  tag: 'bma-iframe-cross',
  styleUrl: 'bma-iframe-cross.css',
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
              `<base href="${origin}"/>$1<script>${this.scriptToInject}</script>${baseStyle}`
            );
            this.html = htmlWithBase;

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
