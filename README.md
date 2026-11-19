# AttoLang VS Code syntax extension (preview)

Registers only canonical AttoLang `.atto` source with a TextMate lexical grammar. The package manifest does not register historical language file extensions. **No production LSP, diagnostics, formatter, or backend-parity guarantee yet.**

The grammar is adapted from the [current AttoLang specification](https://github.com/atto-lang/atto-spec). The grammar is a conservative lexical approximation. Backend-specific historic token inventories are not normative; consult the current specification and test each lexical rule.

Strings, line/block comments, templates and Symbols mask keyword-like text. The whole-word `nb-select` display scope does **not** claim that Java emits one token (it emits NB and SELECT separately). `critical-read`, `critical-write`, `transform-pipe`, `declare`, `sealed` and `pipe` require parser/contextual support; the lexical fallback does not classify them globally as reserved.

## Canonical naming and specification

[atto-vscode](https://github.com/atto-lang/atto-vscode) is the maintained AttoLang repository. Use `.atto` source, `atto-*` repository names, and [atto-spec](https://github.com/atto-lang/atto-spec) for current language rules (ownership, borrowing, effects, actors, and syntax). Distinguish proposed and parser-only features from independently executed compiler support in [atto-platform-conformance](https://github.com/atto-lang/atto-platform-conformance). Naming migration does not by itself rename implementation artifacts, guarantee backend compatibility or certify guest execution.

## Validation and installation

Run `npm install` and `npm test` to exercise the **real** `vscode-textmate` and WASM Oniguruma grammar engine. It is also possible to load the extension as an unpacked development extension in VS Code. Actual VS Code extension-host activation tests, parser-aware semantic tokens, interpolation analysis and compiler-backed execution remain separate milestones.

This package is private and unpublished; it has no background hooks, telemetry, network access or runtime compiler invocation.

## Repository ownership and contribution routing

**Belongs here:** VS Code AttoLang language registration, syntax highlighting, diagnostics/LSP client, formatting integration and editor release assets.

**Belongs elsewhere:** Canonical formatting engine in atto-format, compiler diagnostics producer in atto-static-analysis.rs and normative grammar in atto-spec.

**Security and portability boundary:** Untrusted workspace content must not execute commands on activation; no arbitrary compiler downloads without verified provenance; respect extension sandbox and workspace trust.

AttoLang is the canonical project identity; use `.atto` and the `atto-lang` organization for current documentation. This README defines scope, not feature readiness.

**Acceptance:** name exact source SHA/tree, runtime/toolchain, positive and negative checks and execution receipt before claiming support. Host-only tests and empty CI steps do not prove guest execution.
