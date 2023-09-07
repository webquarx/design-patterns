import useChain from '../useChain';

describe('useChain function with condition steps', () => {
    it('Should not execute step with boolean false condition', async () => {
        const chain = useChain([
            useChain({
                canExecute: false,
                steps: (execute, data) => {
                    data.push(1);
                    return execute(data);
                },
            }),
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([2]);
    });
});
