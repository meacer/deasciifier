# Deasciifier

Deasciifier adds missing accented characters to Turkish text. It's based on Deniz Yuret's [Turkish Mode for Emacs]([https://github.com/denizyuret/deasciify](https://github.com/denizyuret/deasciify)).

This repository contains libraries for JavaScript, C++ and C# as
well as a website and a Chrome extension.

Website: [https://deasciifier.com](https://deasciifier.com)

Chrome extension: [https://chrome.google.com/webstore/detail/turkish-deasciifier/nhfdmlgglfmcdheoabgklabmgjklgofk](https://chrome.google.com/webstore/detail/turkish-deasciifier/nhfdmlgglfmcdheoabgklabmgjklgofk)


## Build instructions

The build tool is Apache Ant (https://ant.apache.org/). Install it and build the project as follows:

```
# Release build:
ant build-all

# Debug build:
ant -Dconfig.name=Debug build-all
```

This will write build artifacts to the `output/` directory. JavaScript artifacts can be found under `output/js/release` (or `output/js/debug`):

 - `chrome_extension/`: Directory containing the Chrome extension code
 - `deasciifier.min.js`: Minified JS library
 - `deasciifier.patterns.min.js`: Minified pattern data
 - `deasciify_box.lib.min.js`: Minified DeasciifyBox library (deprecated, do not use)

Minification of JS code is done using [Closure Compiler](https://developers.google.com/closure/compiler). A copy of Closure Compiler is included under `tools/closure_compiler`.

### TypeScript

The v2 version of the library is written in TypeScript. See (src/typescript/README.md)[src/typescript/README.md].
