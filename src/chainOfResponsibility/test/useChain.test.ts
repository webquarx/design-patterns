import useChain from '../useChain';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';

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
});
