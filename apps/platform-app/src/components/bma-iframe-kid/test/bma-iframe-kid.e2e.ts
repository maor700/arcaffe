import { newE2EPage } from '@stencil/core/testing';

describe('bma-iframe-kid', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bma-iframe-kid></bma-iframe-kid>');

    const element = await page.find('bma-iframe-kid');
    expect(element).toHaveClass('hydrated');
  });
});
