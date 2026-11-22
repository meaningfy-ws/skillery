# Dev-Environment Hygiene

Practical setup rules that prevent slow, confusing failures.

## Editor / IDE

- Use PyCharm, VS Code, or whatever you prefer — but ensure **plugins exist for your tech
  stack** (syntax highlighting at the very least) so the development loop stays efficient.

## Formatting — beware less-common stacks (RDF!)

- **Turn off auto-formatting** for less-common stacks that are integral to our work — notably
  **RDF**. Auto-formatters mangle them.
- The tell: if formatted code looks **vastly different** from the existing code or from common
  practice among peers, formatting is undesired — disable it for that file type.

## WSL — do not cross the filesystem boundary

- **Do not store project copies on the Windows filesystem and access them through WSL.** Keep
  files **in WSL**, and open them with a Windows app *from* the WSL environment (or use a native
  WSL app).
- Crossing the boundary causes non-obvious slowdowns — e.g. slow `git status`/`git diff` due to
  slow Git indexing on slow underlying file operations.

## Identity & notifications

- Commit with your **company email address** on company projects (especially contractual client
  work) — set globally or per-repo.
- Set up notification routing if you have more than one email address; otherwise **check GitHub
  notifications every working day** so you don't miss review requests.
