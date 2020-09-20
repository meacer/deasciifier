if (process.platform == "win32") {
  process.env.CHROME_DRIVER = process.env.CHROME_DRIVER || "../node_modules/chromedriver/lib/chromedriver/chromedriver.exe"
} else {
  process.env.CHROME_DRIVER = process.env.CHROME_DRIVER || "../node_modules/chromedriver/bin/chromedriver"
}

exports.config = {
  chromeDriver: process.env.CHROME_DRIVER,
  specs: ['../out/interactive_browser_test.js'],

  rootElement: 'html',
  directConnect: true,

  // Root directory is typescript root.
  baseUrl: "file://" + __dirname + "/../",

  // Allow XHRs from file:// URLs in Chrome.
  capabilities: {
    browserName: 'chrome',
      chromeOptions: {
        args: ['allow-file-access-from-files', '--headless']
      }
  },
};
