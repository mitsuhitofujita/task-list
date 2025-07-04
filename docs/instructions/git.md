# Git

## Git Workflow

- Only commit when explicitly requested
- Follow conventional commit format with these guidelines:

## Commit Message

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect code meaning (formatting, whitespace)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Build process or auxiliary tool changes

### Rules
- **Subject line**: ≤ 50 characters, present-tense imperative mood
- **No capitalization** after the type prefix
- **No period** at the end of subject line
- **Body**: Wrap at 72 characters, explain what and why
- **References**: Include issue numbers (e.g., `Closes #123`)
- **Breaking changes**: Add `BREAKING CHANGE:` in footer

### Example
```
feat(api): add user authentication endpoint

Implements JWT-based authentication for API access.
Includes refresh token mechanism for extended sessions.

Closes #42
```
