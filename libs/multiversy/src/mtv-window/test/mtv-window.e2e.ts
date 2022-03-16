import { newE2EPage } from '@stencil/core/testing';

describe('mtv-window', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mtv-window></mtv-window>');

    const element = await page.find('mtv-window');
    expect(element).toHaveClass('hydrated');
  });
});
