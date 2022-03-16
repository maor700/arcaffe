import { newSpecPage } from '@stencil/core/testing';
jest.mock('../fetchGustHtml');
import { MtvCrossIframe } from '../mtv-cross-iframe';
import { fetchGustHtml } from '../fetchGustHtml';
import { URL_TYPES } from '../__mocks__/fetchGustHtml';

const TEST_URL = 'http://not.matter.com/somepage';

describe('mtv-cross-iframe', () => {
  let component;
  beforeEach(() => {
    component = new MtvCrossIframe();
  });
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MtvCrossIframe],
      html: `<mtv-cross-iframe></mtv-cross-iframe>`,
    });
    expect(page.root).toEqualHtml(`
      <mtv-cross-iframe>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mtv-cross-iframe>
    `);
  });

  it('Fetch Html from gust url', async () => {
    const html = await fetchGustHtml(URL_TYPES.normalHTML);
    expect(html).toEqualHtml(`TEST`);
  });
  it('Build correct Html from gust url', async () => {
    component.src = TEST_URL;
    const resultHtml = await component.buildHtmlFromGustUrl(URL_TYPES.normalHTML);
    expect(resultHtml).toContain('<head><base href="http://not.matter.com"/></head>');
  });
  it('Build correct Html from gust url when html arrived without head tag', async () => {
    component.src = TEST_URL;
    const resultHtml = await component.buildHtmlFromGustUrl(URL_TYPES.HTMLWithoutHeadTag);
    expect(resultHtml).toContain('<head><base href="http://not.matter.com"/></head>');
  });
});
