import { newE2EPage } from '@stencil/core/testing';

describe('bma-manager', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bma-manager></bma-manager>');

    const element = await page.find('bma-manager');
    expect(element).toHaveClass('hydrated');
  });
});
