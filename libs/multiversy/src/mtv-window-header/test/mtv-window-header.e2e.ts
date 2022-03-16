import { newE2EPage } from '@stencil/core/testing';

describe('mtv-window-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mtv-window-header></mtv-window-header>');

    const element = await page.find('mtv-window-header');
    expect(element).toHaveClass('hydrated');
  });
});
