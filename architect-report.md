[0m
> build · gpt-5.3-codex
[0m
[0m→ [0mRead src/lib/pricing.ts
[0m→ [0mRead src/components/MigrationToggle.tsx
[0m→ [0mRead src/components/MaintenanceTiers.tsx
Here’s the security audit of the provided changes.

- 🟡 MEDIUM: [`src/lib/pricing.ts:32`] — `calculateQuote` relies entirely on caller-supplied client state (`selectedPageIds`, `selectedFeatureIds`, `options.isMigration`) with no server-side authority shown; if this value is ever trusted for checkout/invoicing, users can manipulate state and underpay (business logic/pricing tampering).
- 🟢 LOW: [`src/lib/pricing.ts:37`] — Input integrity is weak (`pageCount` uses raw array length, no whitelist/uniqueness enforcement for page IDs, unknown feature IDs silently price as `0`); this can produce inconsistent/tampered quotes and weakens auditability.
- 🟢 LOW: [`src/lib/pricing.ts:51`] — `isMigration` fee is a plain boolean flag from caller context; without server-side recomputation, migration fee can be toggled off by tampering with client state.

OWASP Top 10 category coverage (for these files)
- A01 Broken Access Control: 0 Critical / 0 High / 0 Medium / 0 Low
- A02 Cryptographic Failures: 0 Critical / 0 High / 0 Medium / 0 Low
- A03 Injection: 0 Critical / 0 High / 0 Medium / 0 Low
- A04 Insecure Design: 0 Critical / 0 High / 1 Medium / 2 Low
- A05 Security Misconfiguration: 0 Critical / 0 High / 0 Medium / 0 Low
- A06 Vulnerable and Outdated Components: 0 Critical / 0 High / 0 Medium / 0 Low (cannot fully verify dependency CVEs from snippets alone)
- A07 Identification and Authentication Failures: 0 Critical / 0 High / 0 Medium / 0 Low
- A08 Software and Data Integrity Failures: 0 Critical / 0 High / 0 Medium / 0 Low
- A09 Security Logging and Monitoring Failures: 0 Critical / 0 High / 0 Medium / 0 Low
- A10 SSRF: 0 Critical / 0 High / 0 Medium / 0 Low

React-specific checks
- `dangerouslySetInnerHTML`: not used.
- Prop/content injection XSS: no untrusted HTML sinks observed in `MigrationToggle` or `MaintenanceTiers`; rendered content is static and React-escaped.
- State manipulation risk: present in pricing flow if client-calculated totals are trusted server-side.
