import { newSpecPage } from '@stencil/core/testing';
import { UiList } from './ui-list';

describe('ui-list', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [UiList],
      html: '<ui-list></ui-list>',
    });
    expect(root).toEqualHtml(`
      <ui-list>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </ui-list>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [UiList],
      html: `<ui-list first="Stencil" last="'Don't call me a framework' JS"></ui-list>`,
    });
    expect(root).toEqualHtml(`
      <ui-list first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </ui-list>
    `);
  });
});
