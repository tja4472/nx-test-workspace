- [1. Scripts](#1-scripts)
  - [1.1. emulators](#11-emulators)
  - [1.2. my-angular-app-e2e](#12-my-angular-app-e2e)
    - [1.2.1. my-angular-app-e2e:emulate-demo](#121-my-angular-app-e2eemulate-demo)
- [2. NxTestWorkspace](#2-nxtestworkspace)
  - [2.1. Quick Start & Documentation](#21-quick-start--documentation)
  - [2.2. Adding capabilities to your workspace](#22-adding-capabilities-to-your-workspace)
  - [2.3. Generate an application](#23-generate-an-application)
  - [2.4. Generate a library](#24-generate-a-library)
  - [2.5. Development server](#25-development-server)
  - [2.6. Code scaffolding](#26-code-scaffolding)
  - [2.7. Build](#27-build)
  - [2.8. Running unit tests](#28-running-unit-tests)
  - [2.9. Running end-to-end tests](#29-running-end-to-end-tests)
  - [2.10. Understand your workspace](#210-understand-your-workspace)
  - [2.11. Further help](#211-further-help)
  - [2.12. ☁ Nx Cloud](#212--nx-cloud)
    - [2.12.1. Distributed Computation Caching & Distributed Task Execution](#2121-distributed-computation-caching--distributed-task-execution)

# 1. Scripts

## 1.1. emulators

|                      |                                                                |
| :------------------- | :------------------------------------------------------------- |
| emulators:start-demo | Starts the auth and firestore emulators using the demo project |

## 1.2. my-angular-app-e2e

### 1.2.1. my-angular-app-e2e:emulate-demo

    Builds and runs `my-angular-app` using the `emulate-demo` configuration and opens the Cypress Test Runner.

|                                         |                                                                                                                  |
| :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| my-angular-app-e2e:emulate-demo         | Builds and runs `my-angular-app` using the `emulate-demo` configuration and opens the Cypress Test Runner        |
| my-angular-app-e2e:emulate-demo:running | Opens the Cypress Test Runner using the `emulate-demo` configuration using the `http://localhost:4200 ` base Url |

# 2. NxTestWorkspace

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Extensible Build Framework**

## 2.1. Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## 2.2. Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## 2.3. Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## 2.4. Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@nx-test-workspace/mylib`.

## 2.5. Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## 2.6. Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## 2.7. Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## 2.8. Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## 2.9. Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## 2.10. Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## 2.11. Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## 2.12. ☁ Nx Cloud

### 2.12.1. Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
