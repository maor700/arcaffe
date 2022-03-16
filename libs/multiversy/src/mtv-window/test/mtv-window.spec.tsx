import { newSpecPage } from '@stencil/core/testing';
import { MtvWindow } from '../mtv-window';

describe('mtv-window', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MtvWindow],
      html: `<mtv-window></mtv-window>`,
    });
    expect(page.root).toEqualHtml(`
      <mtv-window>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mtv-window>
    `);
  });
});
