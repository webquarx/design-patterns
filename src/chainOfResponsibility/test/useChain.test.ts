import useChain from '../useChain';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';
import { useCommand } from '../../command/useCommand';
import Command from '../../command/Command';

describe('useChain function', () => {
    it('should create chain step from a function', async () => {
        const step1 = useChain(
            (execute, data) => {
                data.push(1);
                return execute(data);
            },
        );
        const step2 = useChain(
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
        );
        step1.setLast(step2);

        const order: number[] = [];
        await step1.execute(order);

        expect(order).toEqual([1, 2]);
    });

    it('should create chain step from array of steps', async () => {
        const chain = useChain([
            (execute, data) => {
                data.push(1);
                return execute(data);
            },
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2]);
    });

    it('should create chain with merging and nesting', async () => {
        class TestStep extends ChainOfResponsibilityStep {
            async execute(data: number[]): Promise<number[]> {
                data.push(1);
                return await super.execute(data);
            }
        }

        const chain1 = useChain([
            new TestStep(),
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
            useChain(
                (execute, data) => {
                    data.push(3);
                    return execute(data);
                },
            ),
        ]);
        const chain2 = useChain(
            (execute, data) => {
                data.push(4);
                return execute(data);
            },
        );
        chain1.setLast(chain2);

        const order: number[] = [];
        await chain1.execute(order);

        expect(order).toEqual([1, 2, 3, 4]);
    });

    it('should create chain step from command', async () => {
        type Props = { foo: number };
        const incCommand = useCommand<Props>(
            async function (this: Props, context: { sum: number }) {
                context.sum += this.foo;
            },
            { foo: 1 },
        );
        const decCommand = useCommand({
            execute: async (context) => context.sum--,
            canExecute: () => false,
        });
        const chain = useChain([
            decCommand,
            incCommand,
        ]);
        const context = { sum: 1 };
        await chain.execute(context);
        expect(context.sum).toEqual(2);
    });

    it('should create chain step command with async canExecute method', async () => {
        const context: string[] = [];
        const executeCalls: string[] = [];
        class TestCommand extends Command {
            // eslint-disable-next-line class-methods-use-this
            async canExecute() {
                return await new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        executeCalls.push('class canExecute');
                        resolve(false);
                    }, 50);
                });
            }

            // eslint-disable-next-line class-methods-use-this
            async execute(res: string[]) {
                executeCalls.push('class execute');
                res.push('test class');
            }
        }
        const chain = useChain([
            new TestCommand(),
            {
                canExecute: () => new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        executeCalls.push('object canExecute');
                        resolve(true);
                    }, 50);
                }),
                execute: async (res: string[]) => {
                    executeCalls.push('object execute');
                    res.push('test object');
                },
            },
        ]);

        await chain.execute(context);
        expect(context).toEqual(['test object']);
        expect(executeCalls).toEqual(['class canExecute', 'object canExecute', 'object execute']);
    });
});
