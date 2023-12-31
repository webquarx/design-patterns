import useChain from '../useChain';

describe('useChain function with condition steps', () => {
    it('Should not execute step with false condition', async () => {
        const chain = useChain([
            {
                canExecute: false,
                chain: (execute, data) => {
                    data.push(1);
                    return execute(data);
                },
            },
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
            useChain({
                canExecute: () => false,
                chain: (execute, data) => {
                    data.push(3);
                    return execute(data);
                },
            }),
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([2]);
    });

    it('Should execute steps with true condition', async () => {
        const chain = useChain([
            {
                canExecute: true,
                chain: (execute, data) => {
                    data.push(1);
                    return execute(data);
                },
            },
            (execute, data) => {
                data.push(2);
                return execute(data);
            },
            {
                canExecute: () => true,
                chain: (execute, data) => {
                    data.push(3);
                    return execute(data);
                },
            },
            useChain({
                canExecute: true,
                chain: (execute, data) => {
                    data.push(4);
                    return execute(data);
                },
            }),
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2, 3, 4]);
    });

    it('Using conditional chain nesting', async () => {
        const chain = useChain([
            {
                canExecute: true,
                chain: {
                    canExecute: () => true,
                    chain: (execute, data) => {
                        data.push(1);
                        return execute(data);
                    },
                },
            },
            {
                canExecute: false,
                chain: (execute, data) => {
                    data.push(-1);
                    return execute(data);
                },
            },
            {
                canExecute: true,
                chain: [
                    {
                        canExecute: false,
                        chain: [
                            (execute, data) => {
                                data.push(-2);
                                return execute(data);
                            },
                        ],
                    },
                    {
                        canExecute: true,
                        chain: [
                            (execute, data) => {
                                data.push(2);
                                return execute(data);
                            },
                        ],
                    },
                ],
            },
            (execute, data) => {
                data.push(3);
                return execute(data);
            },
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2, 3]);
    });
});
