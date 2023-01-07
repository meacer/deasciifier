This directory contains end-to-end tests for deasciifier and the website.

Make sure you run `npm build run` in the parent directory before running the
tests so that the typescript bundle is copied to the website directory.

Run the tests:
```
npx playwright test
```

Run with debugging enabled:
```
PWDEBUG=1 npx playwright test
```
