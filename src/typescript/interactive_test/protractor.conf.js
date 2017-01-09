exports.config = {
  seleniumServerJar: "../node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar",
  chromeDriver: "../node_modules/webdriver-manager/selenium/chromedriver_2.26",
  specs: ['../out/interactive_test/interactive_browser_test.js'],

  // Root directory is typescript root.
  baseUrl: "file://" + __dirname + "/../",

  // Allow XHRs from file:// URLs in Chrome.
  capabilities: {
    browserName: 'chrome',
      chromeOptions: {
        args: ['allow-file-access-from-files']
      }
  }
};
