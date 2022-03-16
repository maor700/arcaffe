import { newE2EPage } from '@stencil/core/testing';

describe('mtv-cross-iframe', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mtv-cross-iframe src="http://localhost:3333/forTest.html"></mtv-cross-iframe>');

    const element = await page.find('mtv-cross-iframe');
    expect(element).toHaveClass('hydrated');
  });
});
