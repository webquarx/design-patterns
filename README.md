# Design Patterns

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
    execute(/* any params */) {
        console.log('TestChainStep.execute');
    }
}

const chain = new ChainOfResponsibility([
  new TestChainStep(),
]);
chain.execute(/* any params */);
```

### Classic Usage
Construct both steps with setNext method and call execute for the first one. 

```
export default class FirstChainStep extends ChainOfResponsibilityStep {
    execute(/* any params */) {
        console.log('FirstChainStep.execute');
    }
}

export default class SecondChainStep extends ChainOfResponsibilityStep {
    execute(/* any params */) {
        console.log('SecondChainStep.execute');
    }
}

const firstStep = new FirstChainStep();
const secondStep = new SecondChainStep();

firstStep.setNext(secondStep);

firstStep.execute(/* any params */);
```
