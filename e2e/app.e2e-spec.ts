import { NgWeatherAppPage } from './app.po';

describe('ng-weather-app App', () => {
  let page: NgWeatherAppPage;

  beforeEach(() => {
    page = new NgWeatherAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
