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
Here is a step definition. The method is always asynchronous.
```typescript
export default class TestChainStep extends ChainOfResponsibilityStep {
    async execute(params: any) {
        console.log('TestChainStep.execute');
        return await super.execute(params);
    }
}
```

### Constructing a Chain
There are two ways to construct a chain.
```typescript
// Classic way

const firstStep = new TestChainStep();
const secondStep = new TestChainStep();
const thirdStep = new TestChainStep();

firstStep.setNext(secondStep).setNext(thirdStep);

await firstStep.execute();
```

It's possible to focus on constructing a chain, not on definition variable and series of setNext method.
```typescript
// Simple way

const chain = new ChainOfResponsibility([
    new TestChainStep(),
    new TestChainStep(),
    new TestChainStep(),
]);

await chain.execute();
```
With simple way the method setNext will be called automatically. There is no need to call it for every step when defining a chain.
Construction order is the order in array for ChainOfResponsibility class, which extends usual ChainOfResponsibilityStep.

### Using a Function for Step
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

### Constructing with useChain Function
If you prefer to use functions instead of classes, there is a way to create chain step or whole chain only with one **useChain** function.
```typescript
const step = useChain(
    (execute, param) => {
        console.log('function execute');
        return execute(param);
    },
);

const chain = useChain([
    step,
    (execute, param) => {
        console.log('function execute 2');
        return execute(param);
    },
    new TestChainStep(),
]);

chain.execute(param);
```

### Merging Chains
Usually there is no way to merge two chains without loosing steps in first one, if there is no link to last step.
That's why there is the setLast method for adding chains to the end of chain.
```typescript
class Step1 extends ChainOfResponsibilityStep {}
// Step2, Step3, Step4 have the same class definitions...

const chain1 = new Step1();
chain1.setNext(new Step2());

const chain2 = new Step3();
chain2.setNext(new Step4());

// Step2 will have nextStep to Step3
chain1.setLast(chain2);
```

### Merging With Nesting
Merging chains is also working with nesting chains. This forms one long chain.
It makes possible to construct part of chains in different modules and combine them later into one long chain.

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

The same with useChain function, e.g. where sub-chains were created in factory class:
```typescript
const chain = useChain([
    useChain([
        new Step1(),
        (execute, param) => execute(param), // Step2
    ]),
    useChain([
        (execute, param) => execute(param), // Step3
        new Step4(),
    ]),
]);
chain.execute(param);
```

The result will be the same as:
```typescript
const step1 = new Step1();
const step2 = new Step2();
const step3 = new Step3();
const step4 = new Step4();

step1.setNext(step2).setNext(step3).setNext(step4);
```
