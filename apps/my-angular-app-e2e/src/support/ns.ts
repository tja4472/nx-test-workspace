// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    loginAAA(email: string, password: string): void;

    getBySel(dataTestAttribute: string, args?: any): Chainable<Element>;
    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<Element>;
  }
}
