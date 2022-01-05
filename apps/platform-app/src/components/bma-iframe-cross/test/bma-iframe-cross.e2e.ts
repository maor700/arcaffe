import { newE2EPage } from '@stencil/core/testing';

describe('bma-iframe-cross', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bma-iframe-cross></bma-iframe-cross>');

    const element = await page.find('bma-iframe-cross');
    expect(element).toHaveClass('hydrated');
  });
});
