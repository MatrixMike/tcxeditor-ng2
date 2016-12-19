import { Tcx16Page } from './app.po';

describe('tcx16 App', function() {
  let page: Tcx16Page;

  beforeEach(() => {
    page = new Tcx16Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
