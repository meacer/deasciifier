This directory contains the new TypeScript based code. TS code is compiled into
JS and used in the [v2 of the website](https://deasciifier.com/v2).

# Build instructions

The build uses `npm`. Install it and run (from this directory):

```
# Install the dependencies.
npm install

# Build the code.
# This will write build artifacts to out/ directory and write a
# combined JS file at //src/website/static/ts/bundle.js.
npm run build

# Run tests.
npm run test
```
