import { newSpecPage } from '@stencil/core/testing';
import { BmaIframeKid } from '../bma-iframe-kid';

describe('bma-iframe-kid', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BmaIframeKid],
      html: `<bma-iframe-kid></bma-iframe-kid>`,
    });
    expect(page.root).toEqualHtml(`
      <bma-iframe-kid>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bma-iframe-kid>
    `);
  });
});
