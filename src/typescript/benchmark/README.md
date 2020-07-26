# How to run benchmarks

`package.json` contains a target to run the `benchmark.ts` script.

Run it as follows:

```
npm run-script benchmark <input-file> <optional-output-file>
```

# Cleaning up text

Some Turkish corpus text can contain non-Turkish unicode characters.
For example, one example corpus uses Combining Dot Above (U+0307) after
(i, u, o) characters to denote that they should be treated as Turkish
(ı, ö, ü). These characters negatively affect the benchmark since they
aren't handled by the deasciifier. Such texts can be cleaned up using
the `cleanup.ts` script as follows:

```
npm run-script cleanup <input-file> <output-file>
```

This will remove some (but not all) such characters from the text.
