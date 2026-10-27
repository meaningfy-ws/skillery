# Supply-chain hardening (recommended, not required)

A release is more trustworthy when consumers can verify *what* was published and *how* it was built.
These practices are the **target**, adopted **per-repo and incrementally** — nothing here blocks a
release. Aim for **SLSA Level 2**, reachable on GitHub Actions in a day or two.

References: [Sigstore/SLSA/SBOM in CI](https://nathanberg.io/posts/supply-chain-security-ci-sbom-slsa-sigstore/) ·
[SLSA levels](https://www.kusari.dev/learning-center/slsa-supply-chain-levels-for-software-artifacts).

## The four layers (adopt in this order)

1. **PyPI attestations** — the cheapest win. `pypa/gh-action-pypi-publish` can emit PEP 740 attestations
   during the OIDC publish (see [`pypi-publishing.md`](pypi-publishing.md)) at almost no extra cost. Start
   here.
2. **Keyless signing (Sigstore / cosign)** — sign the built artifacts with short-lived certs tied to the
   workflow's OIDC identity. No keys to manage, no key rotation.
3. **SLSA provenance (Level 2)** — emit signed build provenance (the SLSA GitHub Actions generator) so a
   consumer can verify the artifact came from this repo's workflow, not a side channel.
4. **SBOM** — generate a Software Bill of Materials (e.g. Syft) and attach it to the GitHub Release, so
   consumers get a parts list (dependencies, versions, licences) for vulnerability and licence scanning.

## Why opt-in, not mandatory

Mandating all four across every repo on day one is a heavy lift with low early payoff for internal-only
libraries. Make it a graduated target: a public, widely-depended-on library should reach SLSA L2; an
internal tool can stop at attestations. The skill states the target; each repo's maintainer decides the
rung — and `project-setup` can scaffold the chosen rung.

## Anti-patterns

| ❌ Don't | ✅ Do | Why |
|---------|------|-----|
| Manage long-lived signing keys | keyless Sigstore signing via OIDC | key management is the failure mode signing was meant to remove |
| Treat an SBOM as a one-off audit | generate it per release, attached to the tag | an SBOM is only useful if it matches the exact artifact shipped |
| Block releases until SLSA L2 is met | adopt incrementally, attestations first | a hard gate stalls shipping for marginal early benefit |
