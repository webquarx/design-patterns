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
Here is a step definition. The method ```execute``` is always asynchronous.
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

firstStep
    .setNext(secondStep)
    .setNext(thirdStep);

await firstStep.execute();
```

It's possible to focus on constructing a chain, not on definition of the variables and a series of the ```setNext``` methods.
```typescript
// Simple way

const chain = new ChainOfResponsibility([
    new TestChainStep(),
    new TestChainStep(),
    new TestChainStep(),
]);

await chain.execute();
```
The method ```setNext``` will be called automatically in a simple way. There is no need to call it for every step when defining a chain.
The order of steps in a chain is the same as in array for constructor of ```ChainOfResponsibility``` class, which extends the usual ```ChainOfResponsibilityStep```.

### Using a Function instead of a Step
There is a simple way to use a function instead of a chain step class.
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
The ```execute``` parameter is a function which executes the next step.
It's analog of ```super.execute()``` in the version of the step class. 

### Constructing with useChain Function
If you prefer to use functions instead of classes, there is a way to create a chain step or the whole chain using only the ```useChain``` function.
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
Usually two chains can not be merged without loosing steps in the first one if there is no link to the last step.
That's why there is the ```setLast``` method for appending chains to the end of a chain.
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
Merging chains also works with nesting chains. That forms a one long chain.
It makes possible to construct parts of chains in different modules and combine them later into one long chain.

```typescript
class Step1 extends ChainOfResponsibilityStep {}
// Step2, Step3, Step4 have the same class definitions...

const chain1 = new ChainOfResponsibility([
    new Step1(),
    new Step2(),
]);

const chain2 = new ChainOfResponsibility([
    new Step3(),
    new Step4(),
]);

const chain = new ChainOfResponsibility([chain1, chain2]);
// chain.execute calls execute method from all steps 
chain.execute(param);
```

The ```useChain``` function works the same way, e.g. where sub-chains can be created in the factory class:
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

### Chain with a Condition
There is a way to execute a chain or a sub-chain with condition without interrupting the whole chain.
In the example below ```Step1``` and ```Step2``` will never be executed, while ```Step3``` will be: 
```typescript
const conditionalChain = new ChainOfResponsibility({
    chain: [
        new Step1(),
        new Step2(),
    ],
    canExecute: false,
});

const chain = new ChainOfResponsibility([
    conditionalChain,
    new Step3(),
]);
chain.execute();
```
The ```chain``` property can be a step, a chain, a step function or an array of them.
The ```canExecute``` can be a boolean value or a function which returns a boolean.

It is also possible to use a conditional chain with the ```useChain``` function.
E.g. ```Step1``` will be executed only when canExecute returns true.
```typescript
const chain = useChain({
    chain: new Step1(),
    canExecute: (params) => params.canExecute,
});
chain.execute({canExecute: true});
```
It also works with sub-chains:
```typescript
const chain = useChain([
    {
        chain: new Step1(),
        canExecute: (params) => !params.canExecute,
    },
    {
        chain: new Step2(),
        canExecute: (params) => params.canExecute,
    },
]);
chain.execute({canExecute: true});
```
