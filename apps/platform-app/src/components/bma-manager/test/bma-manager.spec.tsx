import { newSpecPage } from '@stencil/core/testing';
import { BmaManager } from '../bma-manager';

describe('bma-manager', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BmaManager],
      html: `<bma-manager></bma-manager>`,
    });
    expect(page.root).toEqualHtml(`
      <bma-manager>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bma-manager>
    `);
  });
});
