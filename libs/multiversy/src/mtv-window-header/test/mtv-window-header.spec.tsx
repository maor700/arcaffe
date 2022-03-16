import { newSpecPage } from '@stencil/core/testing';
import { MtvWindowHeader } from '../mtv-window-header';

describe('mtv-window-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MtvWindowHeader],
      html: `<mtv-window-header></mtv-window-header>`,
    });
    expect(page.root).toEqualHtml(`
      <mtv-window-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mtv-window-header>
    `);
  });
});
