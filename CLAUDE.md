# Project Assistant Guide

## Project Overview
This project uses modern development practices with automated tooling.

## Development Guidelines

### Code Style
- Follow existing code patterns and conventions
- Use TypeScript for type safety
- Maintain consistent formatting

### Testing
Before completing any task, run:
- `npm test` - Run test suite
- `npm run lint` - Check code style
- `npm run typecheck` - Verify TypeScript types

### Git Workflow
- Only commit when explicitly requested
- Follow conventional commit format with these guidelines:

#### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect code meaning (formatting, whitespace)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Build process or auxiliary tool changes

#### Rules
- **Subject line**: ≤ 50 characters, present-tense imperative mood
- **No capitalization** after the type prefix
- **No period** at the end of subject line
- **Body**: Wrap at 72 characters, explain what and why
- **References**: Include issue numbers (e.g., `Closes #123`)
- **Breaking changes**: Add `BREAKING CHANGE:` in footer

#### Example
```
feat(api): add user authentication endpoint

Implements JWT-based authentication for API access.
Includes refresh token mechanism for extended sessions.

Closes #42
```

## Common Commands
```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Run linter
npm run typecheck # Run type checking
```

## Project Structure
- `/src` - Source code
- `/tests` - Test files
- `/docs` - Documentation

## Important Notes
- Always verify changes with lint and type checking
- Check for existing implementations before creating new files
- Follow security best practices