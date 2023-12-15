import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';

describe('Invoker.execute', () => {
    it('should execute empty invoker', async () => {
        const invoker = new Invoker([]);
        const res = await invoker.parallel();

        expect(res).toEqual([]);
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

        const res = await invoker.parallel({ concurrent: 2 }, '!');

        expect(res).toEqual(['1!', '2!', '3!', '4!']);
        expect(logs).toEqual([2, 3, 1, 4]);
    });
});
