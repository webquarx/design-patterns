import { useCommand } from '../../command/useCommand';
import Invoker from '../Invoker';

describe('Invoker.timeout.test', () => {
    it('a task should fail when it reached own timeout', async () => {
        const invoker = new Invoker([
            {
                key: 'task1',
                command: useCommand(async () => await new Promise((resolve) => {
                    setTimeout(resolve, 30, 'no result, just error');
                })),
                timeout: 20,
            },
        ]);
        await expect(invoker.parallel()).rejects.toMatchObject({
            message: 'Operation Timeout',
            details: {
                code: 'ETIME',
                task: { key: 'task1' },
            },
        });
    });

    it('a task should fail when it reaches the timeout and override common timeout', async () => {
        const invoker = new Invoker([
            useCommand(async () => await new Promise((resolve) => {
                setTimeout(resolve, 30, 'no result, just error');
            })),
        ]);
        invoker.limit({ timeout: 20 });

        await expect(invoker.parallel()).rejects.toThrow('Operation Timeout');
    });

    it('task timeout should succeed and override common timeout', async () => {
        const tasks = [
            useCommand(async () => await new Promise((resolve) => {
                setTimeout(resolve, 30, 'common timeout');
            })),
            {
                command: useCommand(async () => await new Promise((resolve) => {
                    setTimeout(resolve, 55, 'task timeout');
                })),
                timeout: 60,
            },
        ];

        const invoker = new Invoker(tasks);
        const res = await invoker.limit({ timeout: 50 }).parallel();

        expect(res).toEqual(['common timeout', 'task timeout']);
    });
});
