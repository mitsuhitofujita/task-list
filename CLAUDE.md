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
- Create descriptive commit messages
- Only commit when explicitly requested
- Follow conventional commit format: `type: description`

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