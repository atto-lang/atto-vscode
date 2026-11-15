# AttoLang VS Code syntax extension (preview)

Registers `.atto` and legacy `.ores` with a real TextMate lexical grammar. **No production LSP, diagnostics, formatter, or backend-parity guarantee yet.**

The grammar is adapted from the [AttoLang keyword taxonomy](https://github.com/ores-truffle-oreslang/attolang-language-spec.md/blob/main/spec/23-keyword-taxonomy-and-highlighting.md). It extends the historical 93-word catalog with `guard` and `unsafe` from the Java lexer (blob `94920ee03b82c07d5bf962bc5b8ed1d555ac593e`). LLVM has a different 120-name reserved policy that is not automatically promoted to Java keywords.

Strings, line/block comments, templates and Symbols mask keyword-like text. The whole-word `nb-select` display scope does **not** claim that Java emits one token (it emits NB and SELECT separately). `critical-read`, `critical-write`, `transform-pipe`, `declare`, `sealed` and `pipe` require parser/contextual support; the lexical fallback does not classify them globally as reserved.

## Validation and installation

Run `npm install` and `npm test` to exercise the **real** `vscode-textmate` and WASM Oniguruma grammar engine. It is also possible to load the extension as an unpacked development extension in VS Code. Actual VS Code extension-host activation tests, parser-aware semantic tokens, interpolation analysis and compiler-backed execution remain separate milestones.

This package is private and unpublished; it has no background hooks, telemetry, network access or runtime compiler invocation.

## Starter snippets (preview)

VS Code now offers opt-in insertion snippets for a function, actor, conditional, while loop, match, Symbol and functional pipeline. Type `atto-` in an Atto file to discover them. They are **editor templates**, not executable compiler validation: target backends may support different subsets and match arms must be completed manually. The snippet registration and placeholder structure are checked with `npm test`.
