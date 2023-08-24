# Design Patterns

[![npm version](https://badgen.net/npm/v/@webquarx/design-patterns)](https://www.npmjs.com/package/@webquarx/design-patterns)
[![Code Style](https://badgen.net/static/code%20style/airbnb?icon=airbnb)](https://github.com/airbnb/javascript)  
[![bundle min size](https://badgen.net/bundlephobia/min/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle minzip size](https://badgen.net/bundlephobia/minzip/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle dependency count](https://badgen.net/bundlephobia/dependency-count/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)
[![bundle tree-shaking support](https://badgen.net/bundlephobia/tree-shaking/@webquarx/design-patterns)](https://bundlephobia.com/package/@webquarx/design-patterns)  

## Description
Light-weight library for simple using design patterns for JavaScript and TypeScript projects.

## Chain Of Responsibility
There are two types of using Chain of Responsibility pattern: simple and classic.
The library supports both variants synchronous and asynchronous.
For asynchronous one just add async for execute method in a step and await for chain.execute or chainStep.execute.

### Simple Usage
The method setNext is called automatically, you are focused only on handling the execute method, not on construction.
While a construction order is the order in array for ChainOfResponsibility class. This class extends usual ChainOfResponsibilityStep.

```
export default class TestChainStep extends ChainOfResponsibilityStep {
    execute(params: any) {
        console.log('TestChainStep.execute');
        return super.execute(params);
    }
}

const chain = new ChainOfResponsibility([
  new TestChainStep(),
]);
chain.execute();
```

### Classic Usage
Construct both steps with setNext method and call execute for the first one. 

```
export default class FirstChainStep extends ChainOfResponsibilityStep {
    execute(params: any) {
        console.log('FirstChainStep.execute');
        return super.execute(params);
    }
}

export default class SecondChainStep extends ChainOfResponsibilityStep {
    execute(params: any) {
        console.log('SecondChainStep.execute');
        return super.execute(params);
    }
}

const firstStep = new FirstChainStep();
const secondStep = new SecondChainStep();

firstStep.setNext(secondStep);

firstStep.execute();
```
