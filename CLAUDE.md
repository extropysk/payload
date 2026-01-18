# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@extropysk/payload`, a TypeScript SDK for Payload CMS that provides a type-safe client for executing REST operations. The SDK wraps the Payload CMS REST API and provides methods like `find`, `findByID`, `create`, `update`, `delete`, `count`, and authentication methods (`login`, `logout`, `me`).

## Commands

- **Build**: `yarn build` (runs TypeScript compilation then Vite build)
- **Dev mode**: `yarn dev` (builds with watch mode)
- **Lint**: `yarn lint` (ESLint on src directory)
- **Test**: `yarn test` (Vitest watch mode)
- **Test**: `yarn test:run` (Vitest)

## Architecture

The SDK is a simple three-file structure in `src/`:

- **payload.ts**: Main `Payload<T>` class that accepts a generic type parameter for collection types. Provides CRUD methods (`find`, `findByID`, `create`, `update`, `delete`), utility methods (`count`), auth methods (`login`, `logout`, `me`), and file upload support. Uses `qs` library for query string serialization.

- **ajax.ts**: Low-level HTTP client using fetch. Exports `ajax()` function and `AjaxError` class with status code and error messages. Handles JSON and FormData bodies.

- **types.ts**: TypeScript types for Payload CMS responses including `PaginatedDocs<T>`, `Where` (query operators), `FindParams`, and base types.

## Build Output

Vite builds to `dist/` in three formats: ES module, CommonJS, and UMD. Type declarations are generated via `vite-plugin-dts`.
