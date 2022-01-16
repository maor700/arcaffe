import { newSpecPage } from '@stencil/core/testing';
import { BmaList } from './bma-list';

describe('bma-list', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [BmaList],
      html: '<bma-list></bma-list>',
    });
    expect(root).toEqualHtml(`
      <bma-list>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </bma-list>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [BmaList],
      html: `<bma-list first="Stencil" last="'Don't call me a framework' JS"></bma-list>`,
    });
    expect(root).toEqualHtml(`
      <bma-list first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </bma-list>
    `);
  });
});
