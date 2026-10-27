# Deploy-request template — the app repo asks the stacks repository to deploy

> **Illustrative / teaching only.** The deploy mechanism (`.env` assembly, copy to the VM,
> health-gated `docker compose up --wait`) lives **once, in `infrastructure-stacks`**, as that
> repository's reusable deploy workflow; how it works is owned by the
> `stack-operations` skill. An app repo never carries
> deploy glue (SSH, bastion, rsync, `.env`) of its own; it only **requests** a deploy.

## The two request shapes

The stacks repository defines which it accepts; use the one it documents.

1. **A PR that bumps the pinned image** (preferred): the app's release job opens a PR in
   `infrastructure-stacks` that changes the stack's image line to the new `tag@sha256:digest`.
   Merging that PR is the deploy; reverting it is the rollback.
2. **A dispatch**: the app's workflow calls a `workflow_dispatch` the stacks repository defines,
   passing the stack and the pinned image.

## Illustrative request job (placeholders only — C2)

```yaml
# .github/workflows/release.yaml (ILLUSTRATIVE) — runs after the image is pushed
# (see release-image-template.md, which outputs the pushed digest).
  request-deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Ask infrastructure-stacks to deploy the pinned image
        env:
          # A token that may open PRs (or dispatch) in the stacks repo only; a name, never a value.
          GH_TOKEN: ${{ secrets.STACKS_REQUEST_TOKEN }}
        run: |
          gh workflow run <<REQUEST_WORKFLOW>> --repo <<ORG>>/infrastructure-stacks \
            -f stack=<<STACK_NAME>> \
            -f image=<<REGISTRY>>/<<IMAGE>>:${{ needs.build-and-push.outputs.version }}@${{ needs.build-and-push.outputs.digest }}
```

The PR shape replaces the `gh workflow run` line with a branch, an edit of the stack's image line
and `gh pr create` in the stacks repository; the stacks repository's review and deploy rules apply
from there.
