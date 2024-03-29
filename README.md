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
const chain = new ChainOfResponsibility([
    {
        chain: [
            new Step1(),
            new Step2(),
        ],
        canExecute: false,
    },
    new Step3(),
]);
chain.execute();
```
The ```chain``` property can be a step, a chain, a step function or an array of them.
The ```canExecute``` can be a boolean value or a _synchronous_ or _asynchronous_ function which returns a boolean.

It is also possible to use a conditional chain with the ```useChain``` function or the ```ChainOfResponsibility``` class.
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
        canExecute: (params) => params.canExecute,
    },
    {
        chain: new Step2(),
        canExecute: (params) => !params.canExecute,
    },
]);
chain.execute({canExecute: true});
```

The example can be made simpler by using ```elseChain```. If the canExecute condition is ```false```, the chain declared with the ```elseChain``` property will be executed. This property is optional.
```typescript
const chain = useChain({
    chain: new Step1(),
    elseChain: new Step2(),
    canExecute: (params) => params.canExecute,
});
chain.execute({canExecute: true});
```

There is **invalid** usage of ```canExecute``` in the conditional chain, which can lead to a typical issue.
When declaring the context parameter before the chain, calculating it in the previous step, and using it in the next step, the calculation of ```canExecute``` will be made before the conditional chain execution, and the calculation result of the previous step will not be used.
Use the ```canExecute``` function to avoid this issue.
The example below demonstrates the problem:
```typescript
const context = {canExecute: true};

const chain = useChain([
    (execute, param) => {
        param.canExecute = false;
        return execute(context);
    },
    // Invalid use of the context parameter
    {
        chain: new Step1(),
        // `canExecute` is true! It was declared as true and was not calculated
        canExecute: context.canExecute, // use a function instead
        // canExecute: (param) => param.canExecute,
    },
]);

chain.execute(context);
```
There is an example using an asynchronous ```canExecute``` method.
The entire chain's execution will be paused until the asynchronous ```canExecute``` method of the chain step is complete.
```typescript
const chain = useChain({
    chain: new Step1(),
    canExecute: () => new Promise<boolean>((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    }),
});
await chain.execute();
```

### Using the Command as a Chain Of Responsibility Step
A command can be used as a chain of responsibility step by using the ```useChain``` function.
The parameters of the step's `execute` method will be passed as parameters to the `canExecute` and `execute` methods of the command.

Additionally, asynchronous ```canExecute``` method for command is supported.

```typescript
type Props = { foo: number };
const decCommand = useCommand({
    execute: async (context) => context.sum--,
    canExecute: () => false, // command will not be executed
});
const incCommand = useCommand<Props>(
    async function (this: Props, context: { sum: number }) {
        context.sum += this.foo;
    },
    { foo: 1 }, // increment by 1
);
const chain = useChain([
    decCommand,
    incCommand,
]);
const context = { sum: 1 };
await chain.execute(context);
console.log(context.sum); // 2
```

## Command
Here is a command definition. The ```execute``` method is always _asynchronous_ and _abstract_, requiring a definition.

```typescript
class TestCommand extends Command {
    async execute(params) {
        return params;
    }
}
```

A typical Command instance does not accept parameters in its ```execute``` method, which helps to make the object more independent of the context, although such a capability is retained.
```typescript
class TestCommand extends Command {
    constructor(readonly param: object) {
        super();
    }

    async execute() {
        return this.param;
    }
}
```

### Constructing a Command
The Command pattern is typically used to encapsulate requests as objects, separating the request sender from its receiver. Thus, operation parameters are usually passed through the Command class constructor when creating the object.
There are two ways to construct a command.
```typescript
// Classic way
class TestCommand extends Command {
    private setValue: (value: string) => string;
    private value: string;

    constructor(
        setValue: (value: string) => string,
        value: string,
    ) {
        super();
        this.setValue = setValue;
        this.value = value;
    }

    async execute() {
        return this.setValue(this.value);
    }
}

const cmd = new TestCommand(
    (value: string) => value,
    'test',
);
await cmd.execute();
```

It's possible to focus on writing command execution without the need to define class properties since they will be automatically defined.
```typescript
// Simple way
class TestCommand extends Command<{
    setValue: (value: string) => string,
    value: string,
}> {
    async execute() {
        return this.setValue(this.value);
    }
}

const cmd = new TestCommand({
    setValue: (value: string) => value,
    value: 'test',
});
await cmd.execute();
```
The base Command class provides creation, type control, and value setting for constructor parameters.
However, be careful and do not pass object with ```execute``` and ```canExecute``` keys to the constructor, as it's prohibited.

### Command with a Condition
There is a way to prevent the execution of a command if it is not allowed. To do this, you can override the ```canExecute``` method by inheriting from the Command class.
The ```canExecute``` method returns true by default. The ```params``` will be the same as for ```execute``` method.

```typescript
class TestCommand extends Command {
    canExecute(params) {
        return !!params || true;
    }
}
```
The ```canExecute``` method of a command can also be declared as asynchronous.

### Constructing with useCommand Function
There is a way to create a command using only the ```useCommand``` function.
The first parameter can be an ```execute``` function.

```typescript
const cmd = useCommand(
    async (param) => param,
);
await cmd.execute('test');
```

Properties can also be specified in a manner similar to how it's done in class definitions.
Pass the second parameter for properties within the ```this``` object accessible in the ```execute``` function.  

Note: arrow function should not be used for ```execute```, as it does not allow access to ```this``` within property definitions.
```typescript
const cmd = useCommand<{ value: number }>(
    async function (this: { value: number }, param: number) {
        this.value += param;
        console.log(this.value); // 2
    },
    { value: 1 },
);
await cmd.execute(1);
```

The first parameter can be an object with ```execute``` and ```canExecute``` definitions. Both methods can be asynchronous.
```typescript
const cmd = useCommand({
    execute: async (param) => param,
    canExecute: () => false,
});
if (cmd.canExecute && cmd.canExecute()) {
    await cmd.execute('test'); // will be called
}
```

### Merging object properties with useCommand
Pass an object to ```useCommand``` which, in the ```execute``` function, will have access to its properties via ```this```.

Note: do not define an object directly in the useCommand function parameter, as it may result in a TypeScript type casting error. To circumvent this, assign the object to a variable one line above.
```typescript
const obj = {
    foo: 'test',
    async execute() {
        return this.foo;
    },
};
const cmd = useCommand(obj);
await cmd.execute();
```

It's possibly to merge object properties with properties passed to useCommand and access them in the ```execute``` function.
```typescript
type Foo = { foo: string };
type Bar = { bar: string };

const obj = {
    foo: 'default',
    async execute(this: Foo & Bar) {
        return this.foo + this.bar;
    },
};
const cmd = useCommand<Bar>(obj, { bar: '!' });
const res = await cmd.execute();
```

The ```obj.foo``` stores the default value, which value can be overridden with ```props``` object in the ```useCommand``` function.
```typescript
// ... example above
const cmd = useCommand<Bar>(obj, { bar: '!', foo: 'test' });
```

### Using the Chain Of Responsibility as a Command
A chain of responsibility can be employed as a command by calling the ```useCommand``` function, with the first step of the chain passed into it.

The parameters of the execute method of the command are passed as parameters to the execute method of the chain step.
```typescript
const chain = useChain(
    (execute, context) => console.log(context.foo) // test
);
const cmd = useCommand(chain);
await cmd.execute({foo: 'test'});
```
One possible scenario for using a chain as a command is for post-processing after a specific action. For instance, the first step in the chain could involve making a request, and the subsequent step could handle processing the response and adapting it to a common interface.

Several such chains can be executed simultaneously by encapsulating each one within a command and using an Invoker e.g. for asynchronous execution.

As result, the caller's side will be completely abstracted from data retrieval and the handling of specific responses.

By default, a chain doesn't support the ```canExecute``` method, whereas a command does.
Here is an example of how to declare a command with a chain and a ```canExecute``` method, including an additional chain step with a ```canExecute``` function:
```typescript
// a chain declared elsewhere
const someChain = useChain(
    (execute, context) => console.log(context.foo) // test
);
// ...
const cmd = useCommand(
    useChain({
        chain: someChain,
        canExecute: () => true,
    }),
);
await cmd.execute({foo: 'test'});
```

## Invoker
Invoker allows the creation of a queue with commands for sequential or parallel execution.

### Constructing an Invoker
It is possible to create an Invoker with just one command:
```typescript
const command = new TestCommand();
const invoker = new Invoker(command);
```

Alternatively, you can create an Invoker with an array of commands:
```typescript
const invoker = new Invoker([
    new TestCommand(),
    useCommand(async (param) => param),
]);
```

You can also create an Invoker from an array with any data and the ```createCommand``` function:
```typescript
const invoker = new Invoker(
    [1, 2, 3],
    (item) => new TestCommand(item),
);
```

### Setting Execution Limits
The Invoker supports limits for executing commands, which can be set for the entire execution process.

#### Concurrent
The count of concurrently running commands; it will run all commands concurrently if not provided.
```typescript
const invoker = new Invoker([]);
invoker.limit({ concurrent: 2 });
```

#### Retries
The ```retries``` can be either a number or a function.

The ```number``` of retry attempts for executing each command. The default value for the command is 1.
If the command throws an error, it will be executed again until the specified number of retries is reached.
```typescript
const invoker = new Invoker([/* commands */]);

// Each command will be executed 3 times in case of an error
// after which it will be marked as failed.
invoker.limit({ retries: 3 });
```

The ```asynchronous function``` that will be executed if the command throws an error.

Parameters:

```command```: a command that has thrown an error.

```attempt```: the current number of retries.

```error```: the thrown error.

```...args```: all the arguments that were passed for executing the command.

It should return ```true``` to indicate that the retrying of the command execution should continue. Otherwise, the command execution will be stopped.

```typescript
const invoker = new Invoker([/* commands */]);
invoker.limit({
    // continue executing until the third attempt
    retries: async (command, attempt, error, arg1) => {
        return attempt < 3;
    },
});
```

#### Timeout
The ```timeout``` specifies the maximum number of milliseconds allowed for each command to complete.
If the timeout is reached before the command has completed, the command will fail with 'Operation timeout' exception.

```typescript
const invoker = new Invoker([/* commands */]);
invoker.limit({ timeout: 100 }); // Set a 100ms execution time limit for each command
```

The timeout and retries limits can be used together.
If both are specified and the command reaches the timeout, it will raise an exception.
With the retries parameter the Invoker will attempt to run such command again until the retries value is reached or task completes.  

### Invoker Tasks
Each command can be represented as a task. This can be useful for monitoring command status or specifying custom execution limits.

For these cases, the Invoker constructor accepts task object where the command must be assigned to the ```command``` property.
Other task fields are optional. 
```typescript
const task = {
    command: useCommand(/*...*/),
};
const invoker = new Invoker(task);
```

#### Task Statuses
For monitoring the current task status, use the ```status``` field. The possible values are:

```idle```: the task has been added to the Invoker and is waiting to start executing with the Invoker method or is in queue for its turn. 

```pending```: the task has been started, currently, it's running while the Invoker is waiting for its completion.

```fulfilled```: the task has been completed successfully without any errors.

```rejected```: the task has been completed with an error.

#### Task Limits
Each command could have its own limit, which overrides the common limit specified for the Invoker.

```retries```: the same as Invoker ```retries``` limit.
Represents the number of retry attempts for executing a command or an asynchronous function indicating whether the command execution should be continued. 

The value for the command overrides the retries value specified in the ```Invoker.limit``` method. 
```typescript
const invoker = new Invoker([
    useCommand(/*...*/), // invoker.limit retries is used
    {
        command: useCommand(/*...*/),
        retries: 4, // will override invoker.limit retries
    },
    {
        command: useCommand(/*...*/),
        // will override invoker.limit retries
        retries: async (command, attempt, error, arg1) => {
            return attempt < 3; // continue executing until the third attempt
        },
    },
]);
invoker.limit({ retries: 3 });
```

```timeout```: the same as Invoker ```timeout``` limit.
Represent the maximum number of milliseconds allowed for the command to complete.

```typescript
const invoker = new Invoker([
    useCommand(/*...*/), // invoker.limit timeout is used
    {
        command: useCommand(/*...*/),
        timeout: 4000, // will override invoker.limit timeout
    },
]);
invoker.limit({ timeout: 3000 });
```

#### Task Result
After executing a command its result will be available in the ```result``` task field.
The field contains two values: ```value``` and ```error```. If the task is not completed both fields are undefined.

```result.value```: the value returned from the command's execute method

```result.error```: the error caught while executing the command

#### Task Key
Each task has its own unique key, which is automatically generated in UUID format if not provided.
```typescript
const task = {
    command: useCommand(/*...*/),
};
const invoker = new Invoker(task);
console.log(task.key); // b81141e5-19fe-465d-a0b6-f7b7b05d4e58
```

The key generation algorithm does not utilize a crypto library or any other dependencies to maintain zero dependency and minimize package size.
It is based on a well-known algorithm using `Math.random`, as the task's key does not necessitate high randomness or the avoidance of repeating the same random sequence.

In any case, it is possible to use any other UUID implementation when creating a task.
The ```task.key``` will be automatically generated only if it was not provided.
```typescript
const invoker = new Invoker(
    [1, 2, 3],
    (item) => ({
        command: new TestCommand(item),
        key: item,
    }),
);
```
Since the task key in unique, it can be used within templates with UI frameworks like Vue or React. For example, using the task key in a Vue template:
```vue
<ul>
  <li v-for="task in tasks" :key="task.key">...</li>
</ul>
```

### useTask Function
Create a task using the ```useTask``` function to ensure that all necessary fields are present in the task object.
The task will contain the following object with default values:
```typescript
const task = useTask(command);
console.log(task);
/*
 {
    command: Command,
    status: 'idle',
    retries: 1,
    result: { error: undefined, value: undefined },
    key: 'xxxxxxx-...xxx',
}
 */
```
While executing the command, the Invoker will change status and result fields of the task.
This also makes it possible to use task objects with libraries that observe object states, such as Vue or MobX.

```typescript
import { reactive, watchEffect } from 'vue';

const task = useTask({
    command: new TestCommand(),
    retries: 3,
});

const reactiveTask = reactive(task);
watchEffect(() => {
    console.log(reactiveTask.status);
});

await new Invoker(reactiveTask).parallel();
/*
idle
pending
fulfilled
 */
```

### Retrieving all tasks
The Invoker supports a read-only ```tasks``` property for retrieving all task objects in a single array.
The result from the getter is an array **that is not a copy**. For this reason, the array is safeguarded with TypeScript's ```ReadonlyArray```.

```typescript
const invoker = new Invoker(
    [1, 2, 3],
    (item) => new TestCommand(item),
);
invoker.tasks.forEach((item) => console.log(item.status))
```
The property is accessible at any time, even when tasks are running.

### Parallel
Run multiple commands simultaneously, without waiting for each one to finish before starting the next.

Once all commands have finished, their results will be returned as an array.

If any command encounters an error, the promise will be promptly rejected with the first error.
Any tasks with Idle or Pending status will be rejected with an 'Operation canceled' error.

You can limit the number of concurrently running commands using the ```limit``` method.
Without setting a command execution limit, the method will run all commands simultaneously.
In this case, its execution is equivalent to the `Promise.all` method.

The method also supports any number of arguments, which will be passed to the ```canExecute``` and ```execute``` methods of commands. 

```typescript
const commands = [/* commands */];
await new Invoker(commands).limit({ concurrent: 2 }).parallel();
```

### Errors

#### Operation Timeout
An operation timeout error will be thrown when a task is reached the timeout.

```message```: Operation Timeout

```code```: ETIME

```details.description```: The task with the key {task-key} has reached the timeout.

```details.task```: The task encountering the error

#### Operation Canceled
An "Operation Canceled" error will be thrown when a task is canceled.
This can occur when executing in parallel and a previous task was rejected with an error.

```message```: Operation Canceled

```code```: ECANCEL

```details.description```: The task with the key {task-key} was canceled.

```details.task```: The task encountering the error
