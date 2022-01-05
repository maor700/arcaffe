import { newSpecPage } from '@stencil/core/testing';
import { BmaIframeCross } from '../bma-iframe-cross';

describe('bma-iframe-cross', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BmaIframeCross],
      html: `<bma-iframe-cross></bma-iframe-cross>`,
    });
    expect(page.root).toEqualHtml(`
      <bma-iframe-cross>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bma-iframe-cross>
    `);
  });
});
