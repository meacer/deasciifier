exports.config = {
  seleniumServerJar: "../node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar",
  chromeDriver: "../node_modules/chromedriver/bin/chromedriver",
  specs: ['../out/interactive_browser_test.js'],

  rootElement: 'html',

  // Root directory is typescript root.
  baseUrl: "file://" + __dirname + "/../",

  // Allow XHRs from file:// URLs in Chrome.
  capabilities: {
    browserName: 'chrome',
      chromeOptions: {
        args: ['allow-file-access-from-files']
      }
  },
};
