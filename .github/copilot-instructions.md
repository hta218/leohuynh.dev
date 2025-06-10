---
applyTo: '**'
---

# Copilot Instructions

This project is a personal blog and portfolio site built with NextJS, TypeScript, and TailwindCSS.

## Coding Standards

- Use camelCase for variable and function names.
- Use PascalCase for component names.
- Use ALL_CAPS for constants
- Use double quotes for strings.
- Use 2 spaces for indentation.
- Use arrow functions for callbacks.
- Prefix private class members with underscore (\_)
- Use async/await for asynchronous code.
- Use const for constants only (variable named with all camel-cased letters) and prefer let for others.
- Use destructuring for objects and arrays.
- Use template literals for strings that contain variables.
- Use the latest JavaScript features (ES6+) where possible.

## TypeScript Guidelines

- Always define types for function parameters and return values, try to avoid using `any`
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators for safe property access

## React Guidelines

- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling

## Error Handling

- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information
