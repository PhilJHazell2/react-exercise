# TODO

## Testing

- [ ] Configure Jest (jsdom environment, React Testing Library, `next/jest` transform) and prepare unit tests for the components in `src/tests/jest` (form, list, result-card)
- [ ] Add Playwright tests for video and audio results (`src/tests/app.spec.ts`)
- [ ] Extend Playwright tests to cover edge cases and error handling (`src/tests/app.spec.ts`)

## Dependencies

- [ ] Resolve deprecated and vulnerable packages. Upgrade or replace outdated dependencies to remove security risks and stay on supported versions

## Services (`src/services/nasa.ts`)

- [ ] Add support for more search parameters, such as `year_end`, photographer and location
- [ ] Properly encode special characters in search parameters so they don't break NASA API requests
- [ ] Add pagination support

## List (`src/components/list/List.tsx`)

- [ ] Separate presentational and container components, for example with a `useList` hook that handles data fetching and logic
- [ ] Handle NASA API errors, not just "no results found"
- [ ] Add pagination
- [ ] Let users filter and sort the results

## Result card (`src/components/result-card/ResultCard.tsx`)

- [ ] Improve separation of concerns, as in the Form component: move styled components to their own files, add a `useResultCard` hook for logic, etc.
- [ ] Add error handling and loading states for media assets
- [ ] Lazy-load media assets to improve performance

## Project structure

- [ ] Move `useNasaQuery.ts` out of the list directory into a general hooks directory, since the result card uses it too (`src/components/list/useNasaQuery.ts`)
- [ ] Look into best practices for where styled components should live (`src/components/list/Grid.tsx`, `src/components/result-card/StyledImage.tsx`)
