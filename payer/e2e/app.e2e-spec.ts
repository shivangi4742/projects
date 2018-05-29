import { NgoconsolePage } from './app.po';

describe('ngoconsole App', () => {
  let page: NgoconsolePage;

  beforeEach(() => {
    page = new NgoconsolePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
