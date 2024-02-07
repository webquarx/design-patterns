import { useCommand } from '../../command/useCommand';
import Invoker from '../Invoker';

describe('Invoker.retries', () => {
    function throwErrorIfLessMax(retries: number, max: number) {
        if (retries === max) {
            return `command: ${retries}`;
        }
        throw new Error(`retry: ${retries}`);
    }

    it('should set default retries value for all tasks without retries param', async () => {
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

    it('should retries for tasks with the retries param', async () => {
        let retry2 = 0;

        const tasks = [
            {
                command: useCommand(async () => {
                    retry2++;
                    return throwErrorIfLessMax(retry2, 4);
                }),
                retries: 4,
            },
        ];

        const invoker = new Invoker(tasks);
        const results = await invoker.parallel();

        expect(results).toEqual(['command: 4']);
    });
});
