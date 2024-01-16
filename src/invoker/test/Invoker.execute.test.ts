import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';

describe('Invoker.execute', () => {
    it('should execute empty invoker', async () => {
        const invoker = new Invoker([]);
        const res = await invoker.parallel();

        expect(res).toEqual([]);
    });

    it('limit method sets retries to at least 1', () => {
        const invoker = new Invoker([]);

        invoker.limit({});
        // @ts-expect-error limits is private
        expect(invoker.limits.retries).toBe(1);

        invoker.limit({ retries: 0 });
        // @ts-expect-error limits is private
        expect(invoker.limits.retries).toBe(1);

        invoker.limit({ retries: 1 });
        // @ts-expect-error limits is private
        expect(invoker.limits.retries).toBe(1);

        invoker.limit({ retries: 5 });
        // @ts-expect-error limits is private
        expect(invoker.limits.retries).toBe(5);
    });

    it('should execute invoker with limiting concurrent tasks', async () => {
        const logs: number[] = [];
        const invoker = new Invoker([
            useCommand(async (val: string) => await new Promise((resolve) => {
                setTimeout(() => {
                    logs.push(1);
                    resolve(1 + val);
                }, 100);
            })),
            useCommand(async (val: string) => await new Promise((resolve) => {
                setTimeout(() => {
                    logs.push(2);
                    resolve(2 + val);
                }, 50);
            })),
            useCommand(async (val: string) => await new Promise((resolve) => {
                setTimeout(() => {
                    logs.push(3);
                    resolve(3 + val);
                }, 25);
            })),
            useCommand(async (val: string) => await new Promise((resolve) => {
                setTimeout(() => {
                    logs.push(4);
                    resolve(4 + val);
                }, 50);
            })),
        ]);

        const res = await invoker.limit({ concurrent: 2 }).parallel('!');

        expect(res).toEqual(['1!', '2!', '3!', '4!']);
        expect(logs).toEqual([2, 3, 1, 4]);
    });

    it('should set default retries value for all tasks without retries param', async () => {
        function throwErrorIfLessMax(retries: number, max: number) {
            if (retries === max) {
                return `command: ${retries}`;
            }
            throw new Error(`retry: ${retries}`);
        }

        let retry1 = 0;
        let retry2 = 0;

        const tasks = [
            useCommand(async () => {
                retry1++;
                return throwErrorIfLessMax(retry1, 3);
            }),
            {
                command: useCommand(async () => {
                    retry2++;
                    return throwErrorIfLessMax(retry2, 4);
                }),
                retries: 4,
            },
        ];

        const invoker = new Invoker(tasks);
        const results = await invoker.limit({ retries: 3 }).parallel();

        expect(results).toEqual(['command: 3', 'command: 4']);
    });
});
