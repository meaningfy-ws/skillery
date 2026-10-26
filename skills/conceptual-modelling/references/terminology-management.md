# Terminology, disambiguation, and definitions management

The model is also the project's **glossary**. Every class and slot is a *term* with a definition;
the codebase and the specs speak that vocabulary. This is the ubiquitous-language layer.

## Definitions live on the model

- **Every class and slot carries a `description`** in the LinkML source — a precise, one-sentence
  definition written for a domain reader, not a code comment. This is the authoritative definition;
  the generated docs (`gen-doc`/HTML) render it.
- **Definitions are reviewed like code.** A vague or circular definition is a defect; tighten it the
  same way you tighten a function name. A term without a clear definition is not ready to model.
- **One definition, one place.** The definition lives on the model and nowhere else — code
  docstrings and spec prose *reference* the term, they do not restate the meaning (single source of
  authority).

## Disambiguation

- **One concept, one term.** If two parts of the domain use the same word for different concepts,
  split them into two named classes with distinct definitions and distinct IRIs — never overload one
  term. If two words mean the same concept, pick one canonical term and record the other as a
  synonym (LinkML `aliases`).
- **Record synonyms and "see also".** Use `aliases` for accepted synonyms and `exact_mappings` /
  `related_mappings` to point at equivalent terms in published vocabularies (see vocabulary reuse in
  [`ontology-practices.md`](ontology-practices.md)).
- **Homonym guard.** When a term is ambiguous across bounded contexts, qualify it
  (`BillingAccount` vs `UserAccount`) rather than relying on context to disambiguate.

## Ubiquitous language — the tie to OpenSpec specs

The model's terms are the **ubiquitous language** the specs are written in:

- **OpenSpec specs reference model classes by name.** A requirement that talks about an `Invoice`
  means the modelled `Invoice` — same term, same definition, same IRI. The spec states the *rules*;
  the model owns the *vocabulary and meaning* (see the boundary in the SKILL: normative requirements
  delegate to the spine specs at [`../../../../spine/README.md`](../../../../spine/README.md)).
- **The model is the glossary the spine points at.** When a spec introduces a term that is not yet
  modelled, that is a signal to model it — close the loop so specs never invent free-floating
  vocabulary.
- **Code, contracts, and specs converge.** Because the Pydantic classes, the JSON Schema, the OWL
  ontology, and the spec prose all trace to the same modelled term, the language is consistent
  end-to-end — the point of ubiquitous language.

## Keeping it honest

- When a term's meaning shifts, **change the definition on the model** and regenerate — do not let
  code and specs drift to a private understanding.
- A new or renamed term flows out through `make generate-models`; the glossary is never maintained
  by hand in parallel with the schema.
