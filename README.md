# Design Patterns

[![npm version](https://badgen.net/npm/v/@webquarx/design-patterns)](https://www.npmjs.com/package/@webquarx/design-patterns)
[![GitHub Workflow Status](https://github.com/webquarx/design-patterns/workflows/CI/badge.svg?branch=main)](https://github.com/webquarx/design-patterns/actions?query=workflow:CI)
[![Coverage Status](https://coveralls.io/repos/github/webquarx/design-patterns/badge.svg?branch=main)](https://coveralls.io/github/webquarx/design-patterns?branch=main)
[![Code Style](https://badgen.net/static/code%20style/airbnb?icon=airbnb)](https://github.com/airbnb/javascript)  
[![bundle min size](https://badgen.net/bundlephobia/min/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle minzip size](https://badgen.net/bundlephobia/minzip/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle dependency count](https://badgen.net/bundlephobia/dependency-count/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle tree-shaking support](https://badgen.net/bundlephobia/tree-shaking/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)  

## Description
Light-weight library for simple using design patterns for JavaScript and TypeScript projects.

## Chain Of Responsibility
Synchronous step definition
```typescript
export default class TestChainStep extends ChainOfResponsibilityStep {
    execute(params: any) {
        console.log('TestChainStep.execute');
        return super.execute(params);
    }
}
```
For asynchronous variant just add async for execute method.

## Constructing a Chain
There are two ways to construct a chain.
```typescript
// Classic way

const firstStep = new TestChainStep();
const secondStep = new TestChainStep();
const thirdStep = new TestChainStep();

firstStep.setNext(secondStep).setNext(thirdStep);

firstStep.execute();
```

It's possible to focus on constructing a chain, not on definition variable and chain of setNext methods.
```typescript
// Simple way

const chain = new ChainOfResponsibility([
  new TestChainStep(),
  new TestChainStep(),
  new TestChainStep(),
]);

chain.execute();
```
With simple way the method setNext will be called automatically. There is no need to call it for every step when defining a chain.
Construction order is the order in array for ChainOfResponsibility class, which extends usual ChainOfResponsibilityStep.
