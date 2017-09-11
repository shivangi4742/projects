import { PaymentlinkPage } from './app.po';

describe('paymentlink App', () => {
  let page: PaymentlinkPage;

  beforeEach(() => {
    page = new PaymentlinkPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
