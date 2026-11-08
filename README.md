# atto-vscode

Visual Studio Code extension for AttoLang syntax highlighting and development tooling.

## Project scope

Editor syntax grammar, diagnostics, formatting, and language-service integration.

## Development and validation

Use checked-in extension source and host-editor workflows for installation. Ensure `.atto` language registration and formatting/syntax support match the canonical specification.

## Status

This is a statement of intended scope, not a claim of completed implementation or production readiness. Source, CI, and checked-in examples are authoritative for actual supported features and commands.

## Ecosystem

- [AttoLang organization](https://github.com/atto-lang)
- [Language specification](https://github.com/atto-lang/atto-spec)
- [Platform conformance](https://github.com/atto-lang/atto-platform-conformance)

## Repository ownership and contribution routing

**Belongs here:** VS Code AttoLang language registration, syntax highlighting, diagnostics/LSP client, formatting integration and editor release assets.

**Belongs elsewhere:** Canonical formatting engine in atto-format, compiler diagnostics producer in atto-static-analysis.rs and normative grammar in atto-spec.

**Security and portability boundary:** Untrusted workspace content must not execute commands on activation; no arbitrary compiler downloads without verified provenance; respect extension sandbox and workspace trust.

AttoLang is the public name; preserve existing Oreslang/.ores compatibility and use canonical .atto for new portable library source. This README defines scope, not feature readiness.

**Acceptance:** name exact source SHA/tree, runtime/toolchain, positive and negative checks and execution receipt before claiming support. Host-only tests and empty CI steps do not prove guest execution.
