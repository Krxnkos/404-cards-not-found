# Reimagined-octo-lamp Project Style Guide

This styleguide outlines the conventions for writing code for this project. Code that is not compliant to this styleguide runs the risk of being denied for acceptance or being heavily modified to be granted for release.

## Naming Conventions

- **Variables, Functions, and Methods:** Use `camelCase`.
  - Example: `let userName = "Thomas";`
  - Example: `function fetchData() { ... }`
- **Classes and Components:** Use `PascalCase`.
  - Example: `class UserProfile { ... }`
- **Constants:** Use `UPPER_CASE_WITH_UNDERSCORES`.
  - Example: `const MAX_USERS = 100;`

## Formatting

- Use 2 spaces for indentation.
- Keep lines under 80 characters when possible.
- Use single quotes `'` for strings.
- End appropriate statements with semicolons `;`.

## Comments

- use `//` for single-line comments.
- use `/** ... */` for multi-line and documentation comments.

## File Structure

- Files should be organised by feature or functionality
- Place documentation in the `docs/` folder.

## Pull Requests

- Ensure all code follows this styleguide before submitting a Pull Request
- Include all relevant comments and documentation for new features.

---
*Following these guidelines helps keep the codebase clean and readable!*
