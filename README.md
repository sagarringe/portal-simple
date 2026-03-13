# Angular Portal Demo

A demonstration of Angular CDK Portal used to render Angular components in separate pop-out browser windows from a single Angular application.

## What it does

The app displays two customer cards (Jessica and Mark). Each card has two buttons:

- **Personal Details** — opens a pop-out window showing the customer's name, age, and employer
- **Employer Details** — opens a pop-out window showing the employer's name, founding year, employee count, and description

Each pop-out type (customer / employer) gets its own independent browser window. Both can be open simultaneously. If the window is already open, clicking a different record swaps the component in-place; clicking the same record focuses the existing window.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (standalone components) |
| UI Components | Angular Material + CDK |
| Styling | SCSS |
| Language | TypeScript 5.8 |
| Build | Angular CLI / esbuild (`application` builder) |
| Linting | ESLint + `@angular-eslint` |

## How the portal works

1. `PopoutService.openPopoutModal()` opens a named browser window via `window.open('', modalName)` — one window per modal type (`CUSTOMER_DETAIL`, `EMPLOYER_DETAIL`)
2. A `DomPortalOutlet` (Angular CDK) is created targeting the pop-out window's `document.body`
3. Parent window styles (`<style>` and `<link>` elements) are cloned into the pop-out's `<head>` synchronously
4. A `ComponentPortal` wrapping `CustomerComponent` or `EmployerComponent` is attached to the outlet
5. Data is passed to the component via an `Injector` created with the `POPOUT_MODAL_DATA` injection token

Because the components render inside a CDK portal from the parent Angular application, they share the same Angular injector tree and change detection — no second Angular instance is bootstrapped.

## Project structure

```
src/
├── app/
│   ├── app.component.ts        # Root component — customer cards and button handlers
│   ├── app.config.ts           # ApplicationConfig — providers for animations and HTTP
│   ├── customer/
│   │   ├── customer.component.ts
│   │   └── customer.component.html
│   ├── employer/
│   │   ├── employer.component.ts
│   │   └── employer.component.html
│   └── services/
│       ├── popout.service.ts   # Window management and CDK portal lifecycle
│       └── popout.tokens.ts    # InjectionToken, enums, and shared modal state
└── main.ts                     # bootstrapApplication entry point
```

## Getting started

```bash
npm install
npm start        # serves at http://localhost:5000
npm run build    # production build → dist/
npm run lint     # ESLint
```

## Key Angular concepts demonstrated

- **CDK DomPortalOutlet** — renders an Angular component into an arbitrary DOM node (here, a pop-out window's body)
- **Standalone components** — no `NgModule`; `bootstrapApplication` with `ApplicationConfig`
- **`Injector.create()`** — passes data to dynamically attached components via injection tokens
- **`@HostListener('window:beforeunload')`** — closes all pop-out windows when the parent tab is closed
