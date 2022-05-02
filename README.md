# Deasciifier

Deasciifier adds missing accented characters to Turkish text. It's based on Deniz Yuret's [Turkish Mode for Emacs]([https://github.com/denizyuret/deasciify](https://github.com/denizyuret/deasciify)).

This repository contains libraries for JavaScript, C++ and C# as
well as a website, a Chrome extension and a Firefox add-on.

Website: [https://deasciifier.com](https://deasciifier.com)

Chrome extension: [https://chrome.google.com/webstore/detail/turkish-deasciifier/nhfdmlgglfmcdheoabgklabmgjklgofk](https://chrome.google.com/webstore/detail/turkish-deasciifier/nhfdmlgglfmcdheoabgklabmgjklgofk)

Firefox add-on: [https://addons.mozilla.org/en-US/firefox/addon/deasciifier/](https://addons.mozilla.org/en-US/firefox/addon/deasciifier/)

[![Actions Status](https://github.com/meacer/deasciifier/workflows/TypeScript%20Build/badge.svg)](https://github.com/meacer/deasciifier/actions)

## Build instructions

The build tool is Apache Ant (https://ant.apache.org/). Install it and build the project as follows:

```
# Release build:
ant build-all

# Debug build:
ant -Dconfig.name=Debug build-all
```

This will write build artifacts to the `output/` directory. JavaScript artifacts can be found under `output/js/release` (or `output/js/debug`):

 - `chrome_extension/`: Directory containing Chrome extension code
 - `firefox_extension/`: Directory containing Firefox extension code
 - `deasciifier.min.js`: Minified JS library
 - `deasciifier.patterns.min.js`: Minified pattern data
 - `deasciify_box.lib.min.js`: Minified DeasciifyBox library (deprecated, do not use)

Minification of JS code is done using [Closure Compiler](https://developers.google.com/closure/compiler). A copy of Closure Compiler is included under `tools/closure_compiler`.

### TypeScript

The v2 version of the library is written in TypeScript. See [src/typescript/README.md](src/typescript/README.md).


### Website

The website is a static page. To build, do the following:

```
# Build all targets
ant build-all

# Build v2 Typescript library
cd src/typescript
npm run-script build

cd ../../website
python3 -m http.server

```

You can now load the site at `http://localhost:8000`.

