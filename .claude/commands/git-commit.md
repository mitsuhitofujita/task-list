---
allowed-tools: Bash(git:*), Read(*.md)
description: "Create and execute git commits following project-specific commit message conventions"
---

Create git commit messages following the rules specified in docs/instructions/git.md.
Carefully analyze the current changes and maintain appropriate commit granularity. When code changes are extensive and a single commit would not clearly convey the intent of the changes, split them into multiple logical commits.

Process:

1. First, analyze the current git status and staged/unstaged changes
2. Read the git commit conventions from docs/instructions/git.md
3. Determine the appropriate commit strategy (single vs multiple commits)
4. Generate commit messages following the conventions (prefix format, lowercase first letter, no trailing period, max 50 characters)
5. Present the proposed commits to the user for approval before executing
6. Execute the commits only after user confirmation

Always ask for user confirmation before executing any git commands that modify the repository.

Note: Files in `.claude/commands/*.md` are intended to be committed and shared with the team, as they contain project-specific Claude command configurations.
