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

### Constructing a Chain
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

### Using a function instead of step
There is a simple way to use function instead of chain step class.
```typescript
const chain = new ChainOfResponsibility([
    (execute, param) => {
        console.log('function execute');
        return execute(param);
    },
    new TestChainStep(),
]);

chain.execute(param);
```
Where **execute** param is a function to call execution for next step.
It's analog of super.execute() in the class version. 

### Merging Chains
Usually there is no way to merge two chains without loosing steps in first one, if there is not link to last step.
Following example does not work for usual chains, but it works for steps inherited from ChainOfResponsibilityStep.

```typescript
class Step1 extends ChainOfResponsibilityStep {}
// Step2, Step3, Step4 have the same class definitions...

const chain1 = new Step1();
chain1.setNext(new Step2());

const chain2 = new Step3();
chain2.setNext(new Step4());

// Step2 will have nextStep to Step3
chain1.setNext(chain2);
```

### Merging With Nesting
Merging chains is also working with nesting chains. This forms one long chain.  
```typescript
class Step1 extends ChainOfResponsibilityStep {}
// Step2, Step3, Step4 have the same class definitions...

const chain = new ChainOfResponsibility([
    new ChainOfResponsibility([
        new Step1(),
        new Step2(),
    ]),
    new ChainOfResponsibility([
        new Step3(),
        new Step4(),
    ]),
]);
```
As result this will be the same as:
```typescript
const step1 = new Step1();
const step2 = new Step2();
const step3 = new Step3();
const step4 = new Step4();

step1.setNext(step2).setNext(step3).setNext(step4);
```
This makes it possible to construct part of chains in different modules and combine them later into one long chain.
