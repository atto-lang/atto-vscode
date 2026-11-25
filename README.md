> **AI agent instructions (organization-wide):** Before working on code, issues, or pull requests, read and follow the [organization `AGENTS.md`](https://github.com/atto-lang/.github/blob/main/AGENTS.md), including its **merge-first stealth-development policy**. Honor any repository-local `AGENTS.md`, explicit holds, and GitHub-enforced rules.

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

## Legacy provenance and transfer verification

The historical predecessor was `ores-truffle-oreslang/vscode-plugins`. This repository is maintained in `atto-lang`; matching names or imported history do not establish preserved numeric repository identity or code parity. Preserve working legacy `.ores` inputs and historical package/CLI aliases until compiler-backed replacements and consumers are verified. New source follows canonical `.atto` contracts.

VS Code highlighting, LSP integration and editor workflows belong here; compiler lowering and commercial hosting do not. Preserving historical compatibility does not require registering legacy extensions in this preview. [atto-lang](https://github.com/atto-lang) maintains language, portable libraries and tooling; [atto-co](https://github.com/atto-co) separately governs commercial deployment, tenant infrastructure, identity, marketplace and billing. Any further original-ID transfer or commercial carve-out requires separate owner authorization and independent security review. This document authorizes no transfer or private-source mirror.

Before an authorized transfer, coordinate in [migration issue #26](https://github.com/ores-truffle-oreslang/.github/issues/26) and review the authorized runbook. Record source/target administrators, numeric ID, exact SHA/tree, history, visibility, access, rulesets, open PRs/issues, releases, packages, consumers, CI/billing/runners, secrets, deploy keys, apps, webhooks, Pages and rollback ownership. Verify unchanged ID/history/tree and restored controls afterward; execute exact-head tests before changing consumers. Zero-step jobs are NOT_EXECUTED; host-only and source-free checks do not certify compiled guest execution or production capabilities.

## Starter snippets (preview)

Type `atto-` in an Atto file to discover opt-in templates for functions, actors, conditionals, loops, match, Symbols and pipelines. These are editor templates, not verified compiler or backend support.
