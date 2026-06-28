# Claude Code Configuration

This directory contains Claude Code configuration for the Lotus App Builder project.

## Skills

Skills are invoked with `/lotus:<skill>`. Available skills:

| Skill                                | Description                                                    | Uses                                |
| ------------------------------------ | -------------------------------------------------------------- | ----------------------------------- |
| `/lotus:plan-to-issue`               | Convert a plan to a GitHub issue                               | -                                   |
| `/lotus:fix-issue`                   | Fix a GitHub issue                                             | `pr-push`                           |
| `/lotus:pr-fix`                      | Fix PR issues from CI failures or review comments              | `pr-fix:comments`, `pr-fix:actions` |
| `/lotus:pr-fix:comments`             | Address unresolved PR review comments                          | `lint`, `pr-push`                   |
| `/lotus:pr-fix:actions`              | Fix failing CI checks and GitHub Actions                       | `e2e-rebase`, `pr-push`             |
| `/lotus:pr-rebase`                   | Rebase the current branch                                      | `pr-push`                           |
| `/lotus:pr-push`                     | Push changes and create/update a PR                            | `remember-learnings`                |
| `/lotus:fast-push`                   | Fast push via haiku sub-agent                                  | -                                   |
| `/lotus:lint`                        | Run all pre-commit checks (formatting, linting, type-checking) | -                                   |
| `/lotus:e2e-rebase`                  | Rebase E2E test snapshots                                      | -                                   |
| `/lotus:deflake-e2e`                 | Deflake flaky E2E tests                                        | -                                   |
| `/lotus:deflake-e2e-recent-commits`  | Gather flaky tests from recent CI runs and deflake them        | `deflake-e2e`, `pr-push`            |
| `/lotus:session-debug`               | Debug session issues                                           | -                                   |
| `/lotus:pr-screencast`               | Record visual demo of PR feature                               | -                                   |
| `/lotus:feedback-to-issues`          | Turn customer feedback into GitHub issues                      | -                                   |
| `/lotus:promote-beta-to-stable`      | Promote latest pre-release to stable release                   | -                                   |
| `/remember-learnings`              | Capture session learnings into AGENTS.md/rules                 | -                                   |
