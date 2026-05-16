# Hotel Management SaaS - Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Follow the code standards
5. Submit a pull request

## Code Standards

### TypeScript

- Use strict mode
- Define interfaces for all objects
- Avoid `any` type
- Use meaningful variable names

### React

- Use functional components with hooks
- Keep components small and reusable
- Use proper prop typing
- Avoid prop drilling (use context/stores)

### Express

- Use async/await
- Proper error handling
- Input validation
- Meaningful HTTP status codes

## Commit Guidelines

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): implement JWT authentication
```

## Pull Request Process

1. Update tests and documentation
2. Ensure all tests pass
3. Link related issues
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Performance acceptable
- [ ] Security considered

## Reporting Issues

- Use clear, descriptive titles
- Include steps to reproduce
- Add screenshots when applicable
- Specify environment details

---

Thanks for contributing! 🙌
