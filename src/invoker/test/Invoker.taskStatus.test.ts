import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';
import { TTaskStatus } from '../TInvoker';

describe('Invoker.taskStatus', () => {
    it('should set statuses for successfully tasks', async () => {
        const log: string[] = [];

        const invoker = new Invoker([20, 50, 10], (item) => ({
            command: useCommand(
                async () => await new Promise((resolve) => {
                    setTimeout(resolve, item, item);
                }),
            ),
            set status(val: TTaskStatus) {
                log.push(`${item} - ${val}`);
            },
        }));

        await invoker.limit({ concurrent: 2 }).parallel();

        expect(log).toEqual([
            '20 - idle',
            '50 - idle',
            '10 - idle',
            '20 - pending',
            '50 - pending',
            '20 - fulfilled',
            '10 - pending',
            '10 - fulfilled',
            '50 - fulfilled',
        ]);
    });

    it('should set statuses until rejected task', async () => {
        const log: string[] = [];

        const invoker = new Invoker([10, 20, 30], (item) => ({
            command: useCommand(
                async () => await new Promise((resolve, reject) => {
                    if (item === 20) {
                        setTimeout(() => {
                            reject(new Error(`reject with error - ${item}`));
                        }, item);
                        return;
                    }
                    setTimeout(resolve, item, item);
                }),
            ),
            set status(val: TTaskStatus) {
                log.push(`${item} - ${val}`);
            },
        }));

        await expect(invoker.parallel()).rejects.toThrow('reject with error - 20');

        expect(log).toEqual([
            '10 - idle',
            '20 - idle',
            '30 - idle',
            '10 - pending',
            '20 - pending',
            '30 - pending',
            '10 - fulfilled',
            '20 - rejected',
        ]);
    });
});
